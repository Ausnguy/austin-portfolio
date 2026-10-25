// GitHub Pages only serves files that exist, so deep links like /projects/interdomain used to come back
// as 404s (rescued by public/404.html). Copying the built index.html into a folder per route makes
// every real page return 200, which link previews and search engines need.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const routes = ['projects', 'experience', 'skills', 'ask', ...projects.map((p) => `projects/${p.slug}`)];

for (const route of routes) {
  mkdirSync(join(dist, route), { recursive: true });
  copyFileSync(join(dist, 'index.html'), join(dist, route, 'index.html'));
}
console.log(`spa-routes: wrote index.html for ${routes.length} routes`);
