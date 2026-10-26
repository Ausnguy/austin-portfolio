// Ask Austin's hosted model (Cloudflare Workers AI) plus anonymous visit/click counting.
// Ask: the browser sends a question plus the ids of the facts it retrieved; the facts themselves come from the same
// src/ask/knowledge.js the site uses, so this endpoint can't be fed arbitrary text or used as a general chatbot.
// Tracking: POST /track stores counts only (day, kind, name, source) in D1; GET /stats?key=... shows them.
import facts, { FACTS_VERSION } from '../../src/ask/knowledge.js';
import { buildMessages } from '../../src/ask/prompt.js';

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
const ALLOWED_ORIGINS = ['https://ausnguy.github.io'];
const LOCALHOST = /^http:\/\/localhost:\d+$/;
const MAX_QUESTION = 300;
const MAX_FACTS = 6;
const KINDS = new Set(['pv', 'click']);
const NAME = /^[a-z0-9/_:.-]{1,60}$/;
const REF = /^[a-z0-9._-]{1,30}$/;

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(origin ? cors(origin) : {}) },
  });

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ENTITIES[c]);

async function track(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad json' }, 400, origin);
  }
  const { kind, name } = body ?? {};
  const ref = body?.ref || 'direct';
  if (!KINDS.has(kind) || !NAME.test(name ?? '') || !REF.test(ref)) return json({ error: 'bad event' }, 400, origin);
  const day = new Date().toISOString().slice(0, 10);
  await env.DB.prepare(
    'INSERT INTO counts (day, kind, name, ref, n) VALUES (?, ?, ?, ?, 1) ON CONFLICT(day, kind, name, ref) DO UPDATE SET n = n + 1',
  )
    .bind(day, kind, name, ref)
    .run();
  return json({ ok: true }, 200, origin);
}

const table = (head, rows) => {
  const body = rows.length
    ? rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${head.length}">Nothing yet</td></tr>`;
  return `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`;
};

const sum = (rows, keyFn) => {
  const m = new Map();
  rows.forEach((r) => m.set(keyFn(r), (m.get(keyFn(r)) ?? 0) + r.n));
  return [...m].sort((a, b) => b[1] - a[1]);
};
const total = (rows) => rows.reduce((t, r) => t + r.n, 0);

async function stats(url, env) {
  if (!env.STATS_KEY || url.searchParams.get('key') !== env.STATS_KEY) return new Response('Not found', { status: 404 });
  const days = Math.min(Number(url.searchParams.get('days')) || 30, 365);
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const { results } = await env.DB.prepare('SELECT day, kind, name, ref, n FROM counts WHERE day >= ? ORDER BY day').bind(since).all();

  const pv = results.filter((r) => r.kind === 'pv');
  const clicks = results.filter((r) => r.kind === 'click');
  const visits = total(pv);
  const clickTotal = total(clicks);

  if (url.searchParams.get('format') === 'json') return json({ days, visits, clicks: clickTotal, rows: results }, 200);

  const bySource = sum(pv, (r) => r.ref).map(([ref, v]) => {
    const c = total(clicks.filter((x) => x.ref === ref));
    return [ref, v, c, `${v ? Math.round((c / v) * 100) : 0}%`];
  });
  const byDay = [...new Set(results.map((r) => r.day))]
    .reverse()
    .map((d) => [d, total(pv.filter((r) => r.day === d)), total(clicks.filter((r) => r.day === d))]);
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Portfolio stats</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 16px;color:#1d2329}h1{font-size:26px}h2{margin-top:32px;font-size:18px}
.big{display:flex;gap:16px;margin:16px 0}.big div{flex:1;border:1px solid #e2e5e9;border-radius:6px;padding:12px 16px}.big b{display:block;font-size:34px}
table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #e2e5e9;padding:6px 10px;text-align:left}th{background:#f3f5f7;font-size:13px}td.n{text-align:right;font-variant-numeric:tabular-nums}small{color:#636b75}</style>
<h1>Portfolio stats</h1><small>Last ${days} days. Anonymous counts only: no cookies, IPs or personal data.</small>
<div class="big"><div><b>${visits}</b>visits</div><div><b>${clickTotal}</b>link clicks</div><div><b>${visits ? Math.round((clickTotal / visits) * 100) : 0}%</b>clicks per visit</div></div>
<h2>Where visitors came from</h2><small>Add ?ref=linkedin to the link you post so LinkedIn traffic is counted exactly.</small>
${table(['Source', 'Visits', 'Clicks', 'Clicks per visit'], bySource)}
<h2>What they clicked</h2>${table(['Link', 'Clicks'], sum(clicks, (r) => r.name))}
<h2>Landing pages</h2>${table(['Page', 'Visits'], sum(pv, (r) => r.name))}
<h2>By day</h2>${table(['Day', 'Visits', 'Clicks'], byDay)}`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/stats' && request.method === 'GET') return stats(url, env);

    const origin = request.headers.get('Origin') ?? '';
    if (!ALLOWED_ORIGINS.includes(origin) && !LOCALHOST.test(origin)) return json({ error: 'origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, origin);

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const isTrack = url.pathname === '/track';
    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: `${isTrack ? 't' : 'a'}:${ip}` });
      if (!success) return json({ error: 'rate limited' }, 429, origin);
    }
    if (isTrack) return track(request, env, origin);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'bad json' }, 400, origin);
    }
    const { question, ids, version } = body ?? {};
    // The site and this Worker must be built from the same facts, or the ids would point at the wrong ones.
    if (version !== FACTS_VERSION) return json({ error: 'facts version mismatch' }, 409, origin);
    if (typeof question !== 'string' || !question.trim() || question.length > MAX_QUESTION) {
      return json({ error: 'bad question' }, 400, origin);
    }
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_FACTS || !ids.every(Number.isInteger)) {
      return json({ error: 'bad ids' }, 400, origin);
    }
    const chosen = [...new Set(ids)].map((i) => facts[i]).filter(Boolean);
    if (chosen.length === 0) return json({ error: 'bad ids' }, 400, origin);

    try {
      const result = await env.AI.run(MODEL, {
        messages: buildMessages(question.trim(), chosen),
        max_tokens: 160,
        temperature: 0,
      });
      return json({ answer: result.response ?? '' }, 200, origin);
    } catch {
      return json({ error: 'model unavailable' }, 503, origin);
    }
  },
};
