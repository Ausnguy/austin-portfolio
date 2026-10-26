// Anonymous visit and click counts. Sends only { kind, name, ref } to the Worker: no cookies, no IDs, no IP kept.
// Your own visits can be excluded: open the site once with ?notrack=1 (use ?notrack=0 to turn counting back on).
import { ASK_ENDPOINT } from '../ask/constants';

const ENDPOINT = `${ASK_ENDPOINT}/track`;

const SOURCES = [
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'linkedin'],
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)google\./, 'google'],
  [/(^|\.)(x|twitter)\.com$|^t\.co$/, 'x'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
];

const safe = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

const disabled = () =>
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1' ||
  navigator.doNotTrack === '1' ||
  safe(() => localStorage.getItem('notrack') === '1', false);

// Where the visit came from: ?ref= or ?utm_source= wins, then the referrer.
const sourceOf = () => {
  const params = new URLSearchParams(location.search);
  const tagged = (params.get('ref') || params.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30);
  if (tagged) return tagged;
  const host = safe(() => new URL(document.referrer).hostname.toLowerCase(), '');
  if (!host || host === location.hostname) return 'direct';
  return SOURCES.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, '').replace(/[^a-z0-9._-]/g, '').slice(0, 30);
};

const send = (kind, name) => {
  const ref = safe(() => sessionStorage.getItem('ref'), null) || 'direct';
  fetch(ENDPOINT, {
    method: 'POST',
    // text/plain keeps this a "simple" request, so the browser skips a CORS preflight.
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ kind, name, ref }),
    keepalive: true,
  }).catch(() => {});
};

const classify = (a) => {
  const href = a.getAttribute('href') || '';
  if (/resume\.pdf/.test(href)) return 'resume';
  if (href.startsWith('mailto:')) return 'email';
  if (/linkedin\.com/.test(href)) return 'linkedin';
  if (/github\.com/.test(href)) return 'github';
  if (/casequest-2026\.vercel\.app/.test(href)) return 'demo';
  return null;
};

export const trackEvent = (name) => {
  if (!disabled()) send('click', name);
};

export const initTracking = () => {
  const params = new URLSearchParams(location.search);
  if (params.has('notrack')) safe(() => localStorage.setItem('notrack', params.get('notrack') === '0' ? '0' : '1'));
  if (disabled()) return;

  // One visit per browser session, counted on the landing page.
  if (!safe(() => sessionStorage.getItem('counted'), null)) {
    const ref = sourceOf();
    safe(() => {
      sessionStorage.setItem('ref', ref);
      sessionStorage.setItem('counted', '1');
    });
    const page = location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/';
    send('pv', page.toLowerCase().replace(/[^a-z0-9/_:.-]/g, '').slice(0, 60) || '/');
  }

  document.addEventListener('click', (event) => {
    const a = event.target.closest?.('a[href]');
    const name = a && classify(a);
    if (name) send('click', name);
  });
};
