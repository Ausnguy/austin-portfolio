# Austin Nguyen - Portfolio

A distinctive, data-driven portfolio with brutalist-editorial design. Built with React + Vite.

## 🎨 Design Philosophy

**Brutalist-Editorial Aesthetic**:
- Offset colored shadows (sage/rust)
- Hard borders and sharp edges
- Unique typography mix (Space Grotesk + Newsreader + IBM Plex Mono)
- Warm earth-tone palette
- Grid background pattern
- Asymmetric layouts

**NOT Another Generic AI Portfolio**:
- ❌ Soft blue gradients
- ❌ Rounded corners everywhere
- ❌ Inter/Roboto fonts
- ❌ Perfect symmetry
- ✅ Memorable, distinctive, human

## ✨ Features

- **Data-Driven**: Add projects by editing ONE data file
- **Smart Filtering**: Category chips + search + sort
- **Case Studies**: Dedicated project detail pages
- **Responsive**: Mobile-first design
- **Fast**: Vite for instant HMR
- **Unique Design**: Stands out from generic templates

## 🚀 Quick Start

```bash
cd austin-portfolio
npm install
npm run dev
```

Open `http://localhost:5173`

## 📝 Adding Content

### Add a Project (30 seconds)

Edit `src/data/projects.js`:

```javascript
{
  id: 7,
  slug: 'my-project',
  title: 'Project Title',
  description: 'One-line description',
  category: 'Data',  // Research, Web, Dashboard, Data
  tags: ['Python', 'ML'],
  tools: ['Python', 'TensorFlow'],
  featured: true,
  image: 'https://unsplash.com/...',
  links: {
    github: 'https://github.com/...',
    demo: null,
    caseStudy: true,
  },
  caseStudy: {
    problem: '...',
    approach: '...',
    results: '...',
    improvements: '...',
    techStack: '...',
  },
}
```

**Auto-appears on**:
- Projects page (with filtering)
- Homepage (if featured)
- Detail page at `/projects/slug`

### Add Experience

Edit `src/data/experience.js`:

```javascript
{
  id: 4,
  company: 'Company Name',
  role: 'Your Role',
  period: 'Jun 2025 - Aug 2025',
  location: 'City, State',
  description: 'Brief description',
  highlights: [
    'Achievement with metrics',
    'Another achievement',
  ],
  skills: ['Python', 'SQL'],
  type: 'Internship',
}
```

### Add Skills

Edit `src/data/skills.js`:

```javascript
'Category Name': [
  { name: 'Skill', level: 85 },  // 0-100
],
```

### Update Contact Info

Edit `src/pages/Home.jsx`:
- Search for `austin.nguyen@example.com`
- Replace with your actual email/links

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  cream: '#FFFCF2',    // Background
  charcoal: '#2B2B2B', // Text/borders
  rust: '#C85A54',     // Accent
  sage: '#8FAD88',     // Secondary
  sand: '#E8DCC4',     // Tertiary
}
```

### Change Fonts

1. Update Google Fonts link in `index.html`
2. Update `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your Sans', 'system-ui'],
  serif: ['Your Serif', 'Georgia'],
  mono: ['Your Mono', 'monospace'],
}
```

## 📁 Structure

```
austin-portfolio/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ExperienceCard.jsx
│   │   └── ProjectFilters.jsx
│   ├── data/              ⭐ EDIT THESE
│   │   ├── projects.js
│   │   ├── experience.js
│   │   └── skills.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── ProjectDetail.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js     🎨 Design tokens
└── vite.config.js
```

## 🏗️ Build for Production

```bash
npm run build
npm run preview  # Preview build
```

Deploy the `dist/` folder.

## 🚀 Deployment

**Recommended: Vercel** (easiest)

1. Push to GitHub
2. Import on Vercel
3. Deploy (auto-detects Vite)

**Alternatives**:
- Netlify: Drag/drop `dist/` folder
- GitHub Pages: `npm run build` + upload
- Any static host: Upload `dist/` folder

## 📦 Tech Stack

- React 18
- Vite (build tool)
- React Router (routing)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Custom fonts (Space Grotesk, Newsreader, IBM Plex Mono)

## 🎯 What Makes This Different

1. **Distinctive Design**: Brutalist-editorial aesthetic, not generic AI template
2. **Warm Colors**: Earth tones instead of corporate blues
3. **Unique Typography**: 3-font system for hierarchy
4. **Offset Shadows**: Colored shadows (sage/rust), not gray
5. **Data-Driven**: Edit 3 files, content appears everywhere
6. **Fast**: Vite for instant dev experience
7. **Memorable**: Stands out in a sea of similar portfolios

## 💡 Design Principles

**Brutalist Elements**:
- Hard 2px borders
- Sharp edges (no border-radius)
- Offset colored shadows
- Bold typography

**Editorial Elements**:
- Serif body text (Newsreader)
- Section numbering (/ 01, / 02)
- Quote blocks
- Asymmetric layouts

**Technical Elements**:
- Monospace labels (IBM Plex Mono)
- Grid background
- Timeline design
- Tag system

## 📄 License

Free to use for personal portfolios. Make it your own!

---

**Built with attention to detail and a rejection of generic design.**
