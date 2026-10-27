// Writes public/thumbs/<slug>.png for every scene in main.jsx.
// Usage: start `npm run dev`, then `node tools/thumbnails/render.cjs <path-to-puppeteer-core> [chrome path]`
// (set PORT if the dev server isn't on 5173). Pass slugs after the paths to render only those.
const path = require('path');
const puppeteer = require(process.argv[2]);

const CHROME = process.argv[3] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = `http://localhost:${process.env.PORT ?? 5173}/austin-portfolio/tools/thumbnails/index.html`;
const OUT = path.join(__dirname, '..', '..', 'public', 'thumbs');
const ALL = ['interdomain', 'mnist-digit-recognition', 'ai-efficiency-modeling', 'sales-analytics-dashboard', 'fed-oil-price-analysis', 'marketstreet'];
const SLUGS = process.argv.slice(4).length ? process.argv.slice(4) : ALL;

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.setViewport({ width: 1280, height: 720 });
  for (const slug of SLUGS) {
    await page.goto(`${BASE}?scene=${slug}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.__ready === true', { timeout: 60000 });
    await (await page.$('canvas')).screenshot({ path: path.join(OUT, `${slug}.png`) });
    console.log('wrote', slug);
  }
  await browser.close();
})();
