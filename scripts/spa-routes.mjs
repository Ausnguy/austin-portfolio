// GitHub Pages only serves files that exist, so deep links like /projects/interdomain used to come back
// as 404s (rescued by public/404.html). Copying the built index.html into a folder per route makes
// every real page return 200, which link previews and search engines need.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const site = 'https://ausnguy.github.io/austin-portfolio/';
const pages = {
  projects: { title: 'Projects', description: 'Every project Austin Nguyen has built: data pipelines, ML models, dashboards and the apps on top, each with a plain-language write-up.' },
  experience: { title: 'Experience', description: 'Austin Nguyen’s internships, programs and jobs, with what each role involved.' },
  skills: { title: 'Skills & Education', description: 'The tools Austin Nguyen uses, where each one was used, and education at the University of Houston.' },
  ask: { title: 'Ask Austin', description: 'Ask anything about Austin Nguyen’s work. Answers come only from facts on this site.' },
  ...Object.fromEntries(projects.map((p) => [`projects/${p.slug}`, { title: p.title, description: p.description }])),
};
const routes = Object.keys(pages);

// Each route gets its own title, description and URL in the HTML itself, so link previews and crawlers that don't run
// JavaScript show the right page instead of the home page.
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ENTITIES[c]);
const base = readFileSync(join(dist, 'index.html'), 'utf8');
const withMeta = (html, { title, description }, url) => {
  const full = esc(`${title} | Austin Nguyen`);
  const desc = esc(description);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${full}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${full}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${desc}`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${desc}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
};

for (const route of routes) {
  mkdirSync(join(dist, route), { recursive: true });
  writeFileSync(join(dist, route, 'index.html'), withMeta(base, pages[route], `${site}${route}/`));
}

// Sitemap so search engines find every page (robots.txt only works at a domain root, so none here).
const urls = ['', ...routes].map((r) => `  <url><loc>${site}${r ? `${r}/` : ''}</loc></url>`);
writeFileSync(
  join(dist, 'sitemap.xml'),
  ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n'),
);

console.log(`spa-routes: wrote index.html for ${routes.length} routes and sitemap.xml`);
