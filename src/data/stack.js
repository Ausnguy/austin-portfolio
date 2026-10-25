// Stack Data
// Built from what each project and role actually used (read from the repos and project pages), not from the
// resume's skill list. `where` points at a project slug, an experience shortName ("exp:HPE") or "site" (this
// portfolio). `team: true` marks work done as part of a team.
import { projects } from './projects';

export const stack = [
  {
    discipline: 'Data engineering',
    tools: [
      { name: 'Kafka', uses: [{ where: 'interdomain', did: 'Event bus for live route updates, keyed by peer ASN' }] },
      { name: 'Spark Structured Streaming', uses: [{ where: 'interdomain', did: '5-minute sliding windows with a 2-minute watermark to flag route instability' }] },
      { name: 'PostgreSQL', uses: [{ where: 'interdomain', did: 'Stores route events with native CIDR/INET types and indexes' }] },
      { name: 'SQL', uses: [{ where: 'interdomain', did: 'Analytics queries for active ASNs, update volume and withdrawals' }] },
      { name: 'Docker Compose', uses: [{ where: 'interdomain', did: 'Runs Postgres, Kafka and Spark together locally' }] },
      { name: 'Power Query + SharePoint', uses: [{ where: 'exp:HPE', did: 'Automated pipeline that consolidates Workday exports for reporting' }] },
      {
        name: 'pandas',
        uses: [
          { where: 'casequest-2026', did: 'Cleaning pipeline with logged rules and 39 integrity checks', team: true },
          { where: 'exp:Bloomberg Decoded: Data', did: 'Traced anomalies in a 50,000+ record trading dataset' },
        ],
      },
    ],
  },
  {
    discipline: 'Machine learning',
    tools: [
      { name: 'PyTorch', uses: [{ where: 'mnist-digit-recognition', did: 'Neural network digit classifier, ~96–98% test accuracy' }] },
      { name: 'NumPy', uses: [{ where: 'casequest-2026', did: 'Logistic regression written from scratch (Newton’s method, ridge)', team: true }] },
      { name: 'Decision trees & random forests', uses: [{ where: 'exp:CMU Tepper Summit', did: 'Customer churn prediction models in Python' }] },
      { name: 'Model routing', uses: [{ where: 'ai-efficiency-modeling', did: 'Sent simple requests to lightweight models: ~70% less modeled energy' }] },
    ],
  },
  {
    discipline: 'Backend & APIs',
    tools: [
      { name: 'FastAPI', uses: [{ where: 'interdomain', did: 'Ingestion health, metrics, recent routes and active-ASN endpoints' }] },
      { name: 'Python WebSockets', uses: [{ where: 'interdomain', did: 'Live client for the RIPE RIS feed' }] },
      { name: 'Cloudflare Workers AI', uses: [{ where: 'site', did: 'Hosts Ask Austin’s model behind a fact-checked endpoint' }] },
      { name: 'TypeScript + Redis', uses: [{ where: 'casequest-2026', did: 'Dispatch API on Vercel with compare-and-swap state', team: true }] },
    ],
  },
  {
    discipline: 'Frontend & 3D',
    tools: [
      {
        name: 'React',
        uses: [
          { where: 'site', did: 'This portfolio' },
          { where: 'interdomain', did: 'Live routing dashboard' },
        ],
      },
      { name: 'Three.js / React Three Fiber', uses: [{ where: 'site', did: '3D experience chart, company models and project thumbnails' }] },
      { name: 'Recharts', uses: [{ where: 'interdomain', did: 'Updates-per-minute and top-ASN charts' }] },
      { name: 'React Native / Expo', uses: [{ where: 'casequest-2026', did: 'Field engineer phone app', team: true }] },
      { name: 'HTML Canvas', uses: [{ where: 'casequest-2026', did: 'Hand-built 3D site map and charts, no 3D library', team: true }] },
      { name: 'Vite + Tailwind CSS', uses: [{ where: 'site', did: 'Build and styling for this portfolio' }] },
    ],
  },
  {
    discipline: 'Analytics & BI',
    tools: [
      {
        name: 'Power BI + DAX',
        uses: [
          { where: 'exp:HPE', did: 'Single source of truth for pay guidelines, salary ranges and equity budgets' },
          { where: 'sales-analytics-dashboard', did: 'Sales and ROI dashboards that guided pricing and sourcing' },
        ],
      },
      { name: 'Tableau', uses: [{ where: 'exp:CMU Tepper Summit', did: 'Dashboards on U.S. criminal justice data' }] },
      {
        name: 'Excel',
        uses: [
          { where: 'exp:USI Insurance', did: 'Cost-trend and benchmarking analysis on $1M+ in healthcare claims' },
          { where: 'fed-oil-price-analysis', did: 'Lag comparisons of interest rates and oil prices' },
        ],
      },
      { name: 'Matplotlib', uses: [{ where: 'exp:Bloomberg Decoded: Data', did: 'Visualizing anomalies in trading data' }] },
    ],
  },
  {
    discipline: 'Testing & practice',
    tools: [
      {
        name: 'Git & GitHub',
        uses: [
          { where: 'exp:HPE', did: 'Version control for the BI model and its documentation' },
          { where: 'site', did: 'Every change deployed by GitHub Actions' },
        ],
      },
      { name: 'pytest', uses: [{ where: 'interdomain', did: 'Tests for event normalization and anomaly rules' }] },
      { name: 'Vitest', uses: [{ where: 'casequest-2026', did: 'Tests for the dispatch API', team: true }] },
    ],
  },
];

// On the resume but not shown in a project on this site yet.
export const resumeOnly = ['Java', 'R', 'scikit-learn', 'Flask', 'Jupyter', 'Azure', 'Agile', 'SLURM/HPC'];

// Turns a `where` key into a label and a link for the page.
export const resolveWhere = (where) => {
  if (where === 'site') return { label: 'This site', to: '/' };
  if (where.startsWith('exp:')) return { label: where.slice(4), to: '/experience' };
  const project = projects.find((p) => p.slug === where);
  return { label: project?.shortTitle ?? where, to: `/projects/${where}` };
};
