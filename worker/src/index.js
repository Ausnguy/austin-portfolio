// Ask Austin's hosted model on Cloudflare Workers AI.
// The browser sends a question plus the ids of the facts it retrieved; the facts themselves come from the same
// src/ask/knowledge.js the site uses, so this endpoint can't be fed arbitrary text or used as a general chatbot.
import facts, { FACTS_VERSION } from '../../src/ask/knowledge.js';
import { buildMessages } from '../../src/ask/prompt.js';

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
const ALLOWED_ORIGINS = ['https://ausnguy.github.io'];
const LOCALHOST = /^http:\/\/localhost:\d+$/;
const MAX_QUESTION = 300;
const MAX_FACTS = 6;

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

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    if (!ALLOWED_ORIGINS.includes(origin) && !LOCALHOST.test(origin)) return json({ error: 'origin not allowed' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, origin);

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return json({ error: 'rate limited' }, 429, origin);
    }

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
