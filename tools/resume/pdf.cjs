// Prints tools/resume/out/resume.html to a US Letter PDF and prints the page count.
// Usage: node tools/resume/pdf.cjs <path-to-puppeteer-core> <input.html> <output.pdf> [chrome path]
const path = require('path');
const puppeteer = require(process.argv[2]);

const CHROME = process.argv[5] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.goto(`file:///${path.resolve(process.argv[3]).split(path.sep).join('/')}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: process.argv[4], format: 'Letter', printBackground: true, preferCSSPageSize: true });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await browser.close();
  console.log(`body height ${height}px (one page holds about ${Math.round(10 * 96)}px)`);
})();
