# Setup Guide

## Installation

1. **Navigate to project**
```bash
cd austin-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Start dev server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:5173
```

---

## Customize Your Content

### 1. Update Projects

**File**: `src/data/projects.js`

Replace sample projects with yours:
- Change title, description
- Update tags, tools
- Add your GitHub/demo links
- Fill in case study sections

### 2. Update Experience

**File**: `src/data/experience.js`

Add your work history:
- Company, role, period
- Highlights with metrics
- Skills used

### 3. Update Skills

**File**: `src/data/skills.js`

Update skill levels (0-100):
- Add new categories
- Add/remove skills
- Adjust proficiency

### 4. Update Contact Info

**File**: `src/pages/Home.jsx`

Search and replace:
- `austin.nguyen@example.com`
- `linkedin.com/in/austinnguyen`
- `github.com/austinnguyen`

---

## Customize Design (Optional)

### Change Colors

**File**: `tailwind.config.js`

```javascript
colors: {
  cream: '#YOUR_BG_COLOR',
  charcoal: '#YOUR_TEXT_COLOR',
  rust: '#YOUR_ACCENT_COLOR',
  sage: '#YOUR_SECONDARY_COLOR',
  sand: '#YOUR_TERTIARY_COLOR',
}
```

Popular palettes:
- **Monochrome**: Black/white/gray
- **Ocean**: Navy/teal/cream
- **Sunset**: Orange/purple/pink
- **Forest**: Green/brown/tan

### Change Fonts

1. Pick fonts from [Google Fonts](https://fonts.google.com)

2. Update `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

3. Update `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your Sans Font', 'system-ui'],
  serif: ['Your Serif Font', 'Georgia'],
  mono: ['Your Mono Font', 'monospace'],
}
```

---

## Build & Deploy

### Build for Production

```bash
npm run build
```

Creates optimized files in `dist/`

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repo
5. Click "Deploy"

**Done!** Your site is live.

### Deploy to Netlify

1. Build: `npm run build`
2. Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

### Deploy to GitHub Pages

1. Install: `npm install --save-dev gh-pages`

2. Update `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/austin-portfolio",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy: `npm run deploy`

---

## Troubleshooting

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Changes not showing?
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Restart dev server

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Module not found?
Make sure you're in the right directory:
```bash
cd austin-portfolio
npm install
```

---

## Common Tasks

**Add new page**:
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add nav link in `src/components/Layout.jsx`

**Add new component**:
1. Create file in `src/components/`
2. Import and use in pages

**Update meta tags**:
Edit `index.html` `<title>` and add meta tags

**Add resume**:
1. Create/export resume as PDF
2. Name it `resume.pdf`
3. Place in `public/` folder
4. Link works automatically

---

## Next Steps

1. ✅ Install and run locally
2. ✅ Replace sample content with yours
3. ✅ Customize colors/fonts (optional)
4. ✅ Test on mobile
5. ✅ Build and deploy
6. ✅ Share your portfolio!

---

**Questions?** Check README.md or review the code comments.
