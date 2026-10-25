// Writes public/og.png (1200×630 link preview) and public/apple-touch-icon.png (180×180).
// Usage: node tools/social/render.cjs <path-to-puppeteer-core> [chrome path]
const path = require('path');
const puppeteer = require(process.argv[2]);

const CHROME = process.argv[3] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PUBLIC = path.join(__dirname, '..', '..', 'public');
const fileUrl = (p) => `file:///${p.replace(/\\/g, '/')}`;

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(fileUrl(path.join(__dirname, 'og.html')), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(PUBLIC, 'og.png') });
  console.log('wrote og.png');

  // iOS home screen icon: the favicon on a solid background (iOS adds its own rounding).
  await page.setViewport({ width: 180, height: 180 });
  await page.setContent(`<body style="margin:0;background:#107C41"><img src="${fileUrl(path.join(PUBLIC, 'favicon.svg'))}" style="width:180px;height:180px;display:block"></body>`);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(PUBLIC, 'apple-touch-icon.png') });
  console.log('wrote apple-touch-icon.png');

  await browser.close();
})();
