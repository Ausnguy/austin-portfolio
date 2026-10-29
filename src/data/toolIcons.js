// How each stack tool is drawn: a brand logo from simple-icons (`slug`), or a lettered tile when none exists.
// src/data/iconPaths.js is generated from the slugs below by `npm run icons`.
const accent = '#107C41';

export const toolMeta = {
  Kafka: { slug: 'apachekafka', label: 'Kafka' },
  'Spark Structured Streaming': { slug: 'apachespark', label: 'Spark' },
  PostgreSQL: { slug: 'postgresql', label: 'PostgreSQL' },
  'Batch ingestion & pre-aggregation': { mono: 'ETL', label: 'Batch ingestion' },
  SQL: { mono: 'SQL', label: 'SQL', color: '#336791' },
  'Docker Compose': { slug: 'docker', label: 'Docker' },
  'Power Query + SharePoint': { mono: 'PQ', label: 'Power Query', color: '#F2C811', ink: '#1D2329' },
  pandas: { slug: 'pandas', label: 'pandas' },
  PyTorch: { slug: 'pytorch', label: 'PyTorch' },
  NumPy: { slug: 'numpy', label: 'NumPy' },
  'Decision trees & random forests': { mono: 'RF', label: 'Tree models' },
  'scikit-learn + XGBoost': { slug: 'scikitlearn', label: 'scikit-learn' },
  'Model routing': { mono: 'MR', label: 'Model routing' },
  FastAPI: { slug: 'fastapi', label: 'FastAPI' },
  'Python WebSockets': { slug: 'python', label: 'Python' },
  'Cloudflare Workers AI': { slug: 'cloudflareworkers', label: 'Workers AI' },
  'TypeScript + Redis': { slug: 'typescript', label: 'TypeScript' },
  React: { slug: 'react', label: 'React' },
  'Three.js / React Three Fiber': { slug: 'threedotjs', label: 'Three.js' },
  Recharts: { mono: 'Rc', label: 'Recharts', color: '#22B5BF' },
  'React Native / Expo': { slug: 'expo', label: 'Expo' },
  'HTML Canvas': { slug: 'html5', label: 'Canvas' },
  'Vite + Tailwind CSS': { slug: 'tailwindcss', label: 'Tailwind' },
  'Power BI + DAX': { mono: 'BI', label: 'Power BI', color: '#F2C811', ink: '#1D2329' },
  Tableau: { slug: 'tableau', label: 'Tableau' },
  Excel: { mono: 'X', label: 'Excel', color: '#107C41' },
  Matplotlib: { mono: 'Mp', label: 'Matplotlib', color: '#11557C' },
  'Git & GitHub': { slug: 'github', label: 'Git & GitHub' },
  pytest: { slug: 'pytest', label: 'pytest' },
  Vitest: { slug: 'vitest', label: 'Vitest' },
  Databricks: { slug: 'databricks', label: 'Databricks' },
  Python: { slug: 'python', label: 'Python' },
  TypeScript: { slug: 'typescript', label: 'TypeScript' },
  Vercel: { slug: 'vercel', label: 'Vercel' },
  Redis: { slug: 'redis', label: 'Redis' },
  Zod: { slug: 'zod', label: 'Zod' },
  'Hugging Face': { slug: 'huggingface', label: 'Hugging Face' },
  'React Native': { slug: 'react', label: 'React Native' },
  Expo: { slug: 'expo', label: 'Expo' },
  HackerRank: { slug: 'hackerrank', label: 'HackerRank' },
};

export const iconSlugs = [...new Set(Object.values(toolMeta).map((m) => m.slug).filter(Boolean))];

export const metaFor = (name) => toolMeta[name] ?? { mono: name.slice(0, 2), label: name, color: accent };

// The twelve tools shown as logos on the home page.
export const homeTools = [
  'Kafka', 'Spark Structured Streaming', 'PostgreSQL', 'Docker Compose', 'PyTorch', 'pandas',
  'FastAPI', 'React', 'TypeScript + Redis', 'Three.js / React Three Fiber', 'Vite + Tailwind CSS', 'Tableau',
];
