// GitHub Pages only serves files that exist, so deep links like /projects/interdomain used to come back
// as 404s (rescued by public/404.html). Copying the built index.html into a folder per route makes
// every real page return 200, which link previews and search engines need.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const routes = ['projects', 'experience', 'skills', 'ask', ...projects.map((p) => `projects/${p.slug}`)];

for (const route of routes) {
  mkdirSync(join(dist, route), { recursive: true });
  copyFileSync(join(dist, 'index.html'), join(dist, route, 'index.html'));
}

// Sitemap so search engines find every page (robots.txt only works at a domain root, so none here).
const site = 'https://ausnguy.github.io/austin-portfolio/';
const urls = ['', ...routes].map((r) => `  <url><loc>${site}${r ? `${r}/` : ''}</loc></url>`);
writeFileSync(
  join(dist, 'sitemap.xml'),
  ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n'),
);

console.log(`spa-routes: wrote index.html for ${routes.length} routes and sitemap.xml`);
