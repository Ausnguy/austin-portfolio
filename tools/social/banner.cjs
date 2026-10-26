// Writes public/linkedin-banner.png (1584x396). Usage: node tools/social/banner.cjs <path-to-puppeteer-core> [chrome path]
const path = require('path');
const puppeteer = require(process.argv[2]);
const CHROME = process.argv[3] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 396 });
  await page.goto(`file:///${path.join(__dirname, 'banner.html').split(path.sep).join('/')}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, '..', '..', 'public', 'linkedin-banner.png') });
  await browser.close();
  console.log('wrote linkedin-banner.png');
})();
