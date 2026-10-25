# Austin_Nguyen.xlsx

Austin Nguyen's portfolio, built as a spreadsheet workbook: sheets for projects, experience and skills, a formula
bar that explains whatever cell you click, and an assistant that answers questions about Austin using a language
model that runs entirely in the visitor's browser.

**Live:** https://ausnguy.github.io/austin-portfolio/

## Highlights

- **Ask Austin.** Questions are matched against a fact sheet generated from the site's own data (BM25 keyword
  search, no download). "Does Austin know X?" questions are answered exactly by searching the data for X.
  Other questions go to a Cloudflare Worker (`worker/`) running Llama 3.1 8B on Workers AI. The browser sends
  only fact ids, never text, so the endpoint can't be used as a general chatbot; every returned sentence is checked
  against the facts and dropped if its words, names, numbers or claims aren't supported.
- **3D experience chart.** React Three Fiber and drei: column height is months in each role, topped by a model of
  what the company does and its logo.
- **Generated thumbnails.** Project images are rendered from R3F scenes in `tools/thumbnails`.
- **Fast first load.** Each sheet is its own chunk; the 3D chart loads only when scrolled near.

## Stack

React 18, Vite 5, Tailwind CSS 3, Framer Motion, React Three Fiber 8 + drei 9 (three.js), pdf.js, and a
Cloudflare Worker with Workers AI for Ask Austin. Deployed to GitHub Pages by `.github/workflows/main.yml` on every push to `main`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/austin-portfolio/
npm run build    # vite build, then scripts/spa-routes.mjs copies index.html into each route folder
npm run worker:deploy   # redeploy Ask Austin's Worker after changing anything in src/data (wrangler login first)
```

## Edit content

Everything on the site comes from `src/data/`:

| File | What it holds |
|---|---|
| `profile.js` | Name, contact, education and the plain-sentence facts Ask Austin uses |
| `experience.js` | Roles, dates (drive the timeline and 3D chart), highlights, logo and 3D model |
| `projects.js` | Projects, case studies, metrics, pipelines and links |
| `stack.js` | Tools by discipline, each tied to the project or role that used it and what it did |

Ask Austin's fact sheet (`src/ask/knowledge.js`) is built from these files, so it stays in sync automatically.

## Regenerate images

```bash
npm run dev
node tools/thumbnails/render.cjs <path-to-puppeteer-core>   # project thumbnails -> public/thumbs
node tools/social/render.cjs <path-to-puppeteer-core>       # link preview + iOS icon -> public/
```

Company logos in `public/logos` come from Wikimedia Commons and usi.com.
