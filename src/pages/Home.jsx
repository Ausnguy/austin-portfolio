import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import LoopVideo from '../components/LoopVideo';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { GitHubIcon, LinkedInIcon } from '../components/icons';
import { getFeaturedProjects, getSpotlightProject } from '../data/projects';
import { experiences } from '../data/experience';
import { stack, resolveWhere } from '../data/stack';
import { profile } from '../data/profile';

const ExperienceChart3D = lazy(() => import('../components/ExperienceChart3D'));

const HOME_FORMULA = '=TURN(messy_data, "decisions people act on")';

// Spans for the cell that fills out the last row of project cards (full class names so Tailwind keeps them).
const FILLER_SPAN = { 1: 'lg:col-span-3', 2: 'lg:col-span-6', 3: 'lg:col-span-9' };

// What I can do, shown as work: the skill it proves, what I did, one proof number, the tools, and where to read more.
const results = [
  {
    id: 'A3',
    skill: 'Data engineering',
    headline: 'Streaming pipeline on live internet routing data',
    proof: { value: '6', unit: 'stages', note: 'RIPE feed → Kafka → Spark → PostgreSQL → API → dashboard' },
    tools: ['Kafka', 'Spark', 'PostgreSQL', 'FastAPI'],
    status: 'In progress, V1 live',
    link: '/projects/interdomain',
    linkText: 'See how it works',
    formula: '=SKILL("data engineering")',
  },
  {
    id: 'D3',
    skill: 'Machine learning',
    headline: 'Built a failure-prediction model from scratch, with a team of 5',
    proof: { value: '90 of 91', unit: '', note: 'equipment failures flagged on unseen data' },
    tools: ['Python', 'NumPy', 'TypeScript', 'Expo'],
    link: '/projects/casequest-2026',
    linkText: 'Watch the demo',
    formula: '=SKILL("machine learning")',
  },
  {
    id: 'G3',
    skill: 'BI at enterprise scale',
    headline: 'Own the automated Power BI pipeline behind compensation reporting at HPE',
    proof: { value: 'Automated', unit: '', note: 'compensation reporting that used to be manual' },
    tools: ['Power BI', 'DAX', 'Power Query', 'SharePoint'],
    link: '/experience',
    linkText: 'See the role',
    formula: '=SKILL("business intelligence")',
  },
  {
    id: 'J3',
    skill: 'Ownership and analytics',
    headline: 'Ran an Amazon store, using pricing and ROI analysis to guide what to buy',
    proof: { value: '$75K+', unit: '', note: 'first-year revenue at 30%+ margins' },
    tools: ['Excel', 'Pricing analysis', 'Sourcing'],
    link: '/projects/sales-analytics-dashboard',
    linkText: 'Read the case study',
    formula: '=SKILL("analytics")',
  },
];

// The hero's receipts: each one is something shipped, linked to where it's shown.
const proof = [
  { text: 'Building a real-time internet routing pipeline on Kafka, Spark Structured Streaming and PostgreSQL', to: '/projects/interdomain' },
  { text: 'My CaseQuest team’s from-scratch failure model warned before 90 of 91 equipment failures', to: '/projects/casequest-2026' },
  { text: 'Built and own an automated Power BI compensation pipeline at HPE', to: '/experience' },
  { text: 'Deployed an AI assistant for this site on Cloudflare, with a filter that stops it making things up', to: '/ask' },
];

// What went into building this site, for the "This site is a project too" row.
const siteBuild = [
  { id: 'A8', title: 'Hosted AI', body: 'Ask Austin runs Llama 3.1 8B on a Cloudflare Worker I deployed. The browser sends fact ids, never text, so the endpoint can’t be used as a general chatbot.', formula: '=MODEL("llama-3.1-8b", "Cloudflare")' },
  { id: 'D8', title: 'Hallucination filter', body: 'Every generated sentence is checked against the facts; unsupported names, numbers or claims are dropped before you see them.', formula: '=FILTER(sentences, SUPPORTED(facts))' },
  { id: 'G8', title: 'Generated 3D', body: 'The company models, logos and project thumbnails are built in code with React Three Fiber and drei.', formula: '=RENDER(scene, "R3F")' },
  { id: 'J8', title: 'Fast and accessible', body: 'Lighthouse on the live site: Performance 94, Accessibility 100, Best Practices 100, SEO 100.', formula: '=LIGHTHOUSE("live")' },
];

const currentStatus = [
  { id: 'A2', label: 'School', value: 'MIS at UH Bauer, 3.95 GPA, May 2027', formula: '=SCHOOL("University of Houston")' },
  { id: 'D2', label: 'Now', value: 'Data Analyst Intern at HPE', formula: '=NOW("Hewlett Packard Enterprise")' },
  { id: 'G2', label: 'Building', value: 'Interdomain, a real-time BGP pipeline', formula: '=BUILDING("Interdomain")', to: '/projects/interdomain' },
  { id: 'J2', label: 'Based in', value: profile.location, formula: '=LOCATION("Houston, TX")' },
];

const toMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + m - 1;
};
const now = new Date();
const nowMonth = now.getFullYear() * 12 + now.getMonth() + 1;

// Months spent in each role, oldest first, for the 3D chart.
const roles = [...experiences]
  .sort((a, b) => toMonth(a.start) - toMonth(b.start))
  .map((exp) => ({
    name: exp.shortName,
    company: exp.company,
    role: exp.role,
    period: exp.period,
    summary: exp.summary,
    logo: exp.logo,
    item: exp.item,
    months: (exp.end ? toMonth(exp.end) + 1 : nowMonth) - toMonth(exp.start),
    current: !exp.end,
  }));

// Mounts its children only once they come near the viewport, so heavy chunks load on demand.
const WhenNear = ({ children, fallback }) => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '400px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="h-full">{near ? children : fallback}</div>;
};

const AskTeaser = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(q.trim() ? `/ask?q=${encodeURIComponent(q.trim())}` : '/ask');
      }}
    >
      <label className="flex items-center h-11 rounded border border-grid bg-paper focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <span className="pl-3 pr-1 font-mono text-[14px] text-accent-ink select-none" aria-hidden="true">=ASK(</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          name="question"
          autoComplete="off"
          placeholder="What has Austin built?"
          aria-label="Ask a question about Austin"
          className="min-w-0 flex-1 h-full bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
        />
        <span className="pr-3 font-mono text-[14px] text-accent-ink select-none" aria-hidden="true">)</span>
      </label>
      <button type="submit" className="btn btn-primary w-full mt-3">Ask Austin</button>
    </form>
  );
};

const Home = () => {
  useSheet('A1', HOME_FORMULA);
  const spotlight = getSpotlightProject();
  const others = getFeaturedProjects().filter((p) => p !== spotlight);
  const baseUrl = import.meta.env.BASE_URL;
  const resumeUrl = `${baseUrl}resume.pdf`;

  return (
    <Sheet>
      {/* Row 1: who I am, and the assistant */}
      <Row>
        <Cell id="A1" span="col-span-12 lg:col-span-8" formula={HOME_FORMULA} className="lg:!p-10">
          <h1 className="font-sans text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95] text-ink">
            Austin Nguyen
          </h1>
          <p className="mt-5 text-xl sm:text-2xl leading-snug text-ink max-w-2xl">
            I ship data systems end to end: streaming pipelines, ML models, BI at enterprise scale, and the apps on top.
          </p>
          <ul className="mt-5 max-w-2xl divide-y divide-grid border-y border-grid">
            {proof.map((item, i) => (
              <li key={item.text}>
                <Link to={item.to} className="group flex items-baseline gap-3 py-2.5">
                  <span className="font-mono text-[12px] text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-[15px] sm:text-[15.5px] leading-snug text-ink group-hover:underline decoration-accent decoration-2 underline-offset-4">
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View resume</a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary">Email me</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><GitHubIcon />GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><LinkedInIcon />LinkedIn</a>
          </div>
        </Cell>
        <Cell id="I1" span="col-span-12 lg:col-span-4" formula='=ASK("anything about Austin")' className="bg-accent-wash/40 flex flex-col">
          <div className="cell-ref text-ink-soft">I1</div>
          <h2 className="mt-1 font-sans text-xl font-bold text-ink">Ask about me</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Ask anything about my work. Answers come only from the facts in this workbook, and every one is fact-checked
            before you see it. Nothing to download.
          </p>
          <div className="mt-auto pt-5">
            <AskTeaser />
          </div>
        </Cell>
      </Row>

      {/* Row 2: where I am right now. Three cells on wider screens, one compact list on phones. */}
      <Row>
        {currentStatus.map((item) => (
          <Cell key={item.id} id={item.id} span="hidden sm:block sm:col-span-6 lg:col-span-3" formula={item.formula} className="!py-4">
            <div className="text-[13px] text-muted">{item.label}</div>
            {item.to ? (
              <Link to={item.to} className="mt-0.5 block font-semibold text-ink underline decoration-accent/40 decoration-2 underline-offset-4 hover:decoration-accent">{item.value}</Link>
            ) : (
              <div className="mt-0.5 font-semibold text-ink">{item.value}</div>
            )}
          </Cell>
        ))}
        <Cell id="A2" span="col-span-12 sm:hidden" formula={currentStatus[0].formula} className="!py-3">
          <dl className="divide-y divide-grid">
            {currentStatus.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-4 py-1.5">
                <dt className="text-[13px] text-muted">{item.label}</dt>
                <dd className="text-[14.5px] font-semibold text-ink text-right">
                  {item.to ? <Link to={item.to} className="underline decoration-accent/40 decoration-2 underline-offset-4">{item.value}</Link> : item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Cell>
      </Row>

      {/* Row 3: four things I can do, each shown as work */}
      <Row>
        {results.map((r) => (
          <Cell key={r.id} id={r.id} span="col-span-12 sm:col-span-6 lg:col-span-3" formula={r.formula} className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-semibold text-accent-ink">{r.skill}</span>
              {r.status && <span className="text-[11.5px] font-medium text-[#7A5B00] dark:text-[#F2D27A]">{r.status}</span>}
            </div>
            <h3 className="mt-2 font-sans text-[17px] font-bold leading-snug text-ink">{r.headline}</h3>
            <div className="mt-3 rounded-sm bg-head/70 px-3 py-2.5">
              <div className="font-sans text-[1.7rem] font-bold tracking-tight leading-none text-ink">
                {r.proof.value}
                {r.proof.unit && <span className="ml-1.5 text-[15px] font-semibold text-ink-soft">{r.proof.unit}</span>}
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{r.proof.note}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.tools.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <Link to={r.link} className="mt-auto pt-4 text-[13.5px] link self-start">{r.linkText}</Link>
          </Cell>
        ))}
      </Row>

      {/* Row 4: featured project */}
      {spotlight && (
        <Row>
          <Cell id="A4" span="col-span-12 lg:col-span-7" pad={false} formula={`=HYPERLINK("${spotlight.links.demo}", "${spotlight.shortTitle}")`}>
            <div className="aspect-video bg-stage">
              <LoopVideo
                src={`${baseUrl}${spotlight.videoLoop}`}
                poster={`${baseUrl}${spotlight.videoLoopPoster}`}
                to={`/projects/${spotlight.slug}`}
                label="Open the Parvius case study and full demo video"
                className="w-full h-full object-cover"
              />
            </div>
          </Cell>
          <Cell id="H4" span="col-span-12 lg:col-span-5" formula='=FILTER(projects, featured=TRUE)' className="flex flex-col">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-accent-ink">Featured build</span>
              <span className="text-muted">{spotlight.date}</span>
            </div>
            <h2 className="mt-2 font-sans text-2xl font-bold leading-tight text-ink">{spotlight.title}</h2>
            <p className="mt-3 text-[15.5px] font-semibold text-ink">{spotlight.highlight}.</p>
            <p className="mt-2 body-copy">{spotlight.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {spotlight.tools.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <div className="mt-auto pt-6 flex flex-wrap gap-2.5">
              <Link to={`/projects/${spotlight.slug}`} className="btn btn-primary">Case study + video</Link>
              <a href={spotlight.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Live demo</a>
              <a href={spotlight.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><GitHubIcon />Code</a>
            </div>
          </Cell>
        </Row>
      )}

      {/* Row 5: everything else I've built */}
      <Row>
        {others.map((project, i) => (
          <Cell
            key={project.id}
            id={`${'ADGJ'[i % 4]}5`}
            span="col-span-12 md:col-span-6 lg:col-span-3"
            formula={`=PROJECT("${project.shortTitle}")`}
          >
            <ProjectCard project={project} index={i} compact />
          </Cell>
        ))}
        {others.length % 4 !== 0 && (
          <Cell id="Z5" span={`col-span-12 md:col-span-6 ${FILLER_SPAN[4 - (others.length % 4)]}`} formula="=COUNTA(projects)" className="flex items-center justify-center">
            <Link to="/projects" className="link">Open the Projects sheet</Link>
          </Cell>
        )}
      </Row>

      {/* Row 6: stack */}
      <Row>
        <Cell id="A6" formula="=STACK()">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-sans text-xl font-bold text-ink">Stack, by what I built with it</h2>
            <Link to="/skills" className="text-sm link">What each tool did</Link>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {stack.map(({ discipline, tools }) => (
              <div key={discipline}>
                <div className="text-[13px] font-semibold text-accent-ink">{discipline}</div>
                <ul className="mt-1.5 space-y-1">
                  {tools.map((tool) => (
                    <li key={tool.name} className="flex flex-wrap items-baseline gap-x-2 text-[14.5px]">
                      <span className="font-medium text-ink">{tool.name}</span>
                      <span className="text-[12.5px] text-muted">
                        {[...new Set(tool.uses.map((u) => resolveWhere(u.where).label))].join(', ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Cell>
      </Row>

      {/* Row 7: experience at a glance */}
      <Row>
        <Cell id="A7" span="col-span-12 lg:col-span-6" pad={false} formula="=CHART(months_per_role, 3D_COLUMN)">
          <div className="h-[320px] sm:h-[400px] lg:h-[460px] lg:sticky lg:top-[7.5rem]">
            <WhenNear fallback={<div className="h-full grid place-items-center text-sm text-muted">Loading chart…</div>}>
              <Suspense fallback={<div className="h-full grid place-items-center text-sm text-muted">Loading chart…</div>}>
                <ExperienceChart3D
                  roles={roles}
                  label={`3D column chart of months spent in each role: ${roles.map((r) => `${r.name} ${r.months} months`).join(', ')}`}
                />
              </Suspense>
            </WhenNear>
          </div>
        </Cell>
        <Cell id="G7" span="col-span-12 lg:col-span-6" formula="=SORT(roles, start_date, -1)">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-sans text-xl font-bold text-ink">Experience</h2>
            <span className="text-[13px] text-muted">Column height = months in the role</span>
          </div>
          <ol className="mt-3 divide-y divide-grid border-y border-grid">
            {[...roles].reverse().map((r) => (
              <li key={r.name} className="py-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
                <div className="h-9 rounded-sm bg-white border border-grid grid place-items-center px-1.5">
                  {r.logo ? (
                    <img src={`${baseUrl}${r.logo}`} alt="" className="max-h-6 max-w-full object-contain" loading="lazy" />
                  ) : (
                    <span className="text-[11px] font-bold text-[#1D2329]">{r.name}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={`text-[15px] font-semibold ${r.current ? 'text-accent-ink' : 'text-ink'}`}>{r.company}</span>
                    <span className="font-mono text-[12px] text-muted whitespace-nowrap">{r.period}</span>
                  </div>
                  <div className="text-[13.5px] text-ink-soft">{r.role}</div>
                  <p className="mt-1 text-[13.5px] leading-snug text-muted">{r.summary}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/experience" className="link mt-4 inline-block">Full timeline and details</Link>
        </Cell>
      </Row>

      {/* Row 8: the site itself as a project */}
      <Row>
        <Cell id="A8h" formula='=HYPERLINK("https://github.com/Ausnguy/austin-portfolio")' className="!pb-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-sans text-xl font-bold text-ink">This site is a project too</h2>
            <a href="https://github.com/Ausnguy/austin-portfolio" target="_blank" rel="noopener noreferrer" className="link text-sm">Read the code</a>
          </div>
        </Cell>
      </Row>
      <Row>
        {siteBuild.map((item) => (
          <Cell key={item.id} id={item.id} span="col-span-12 sm:col-span-6 lg:col-span-3" formula={item.formula}>
            <h3 className="font-sans text-[16px] font-bold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{item.body}</p>
          </Cell>
        ))}
      </Row>

      {/* Row 9: contact */}
      <Row>
        <Cell id="A8" formula={`=HYPERLINK("mailto:${profile.email}")`} className="lg:!p-10">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-ink">Let’s build something.</h2>
          <p className="mt-3 body-copy max-w-2xl">
            I’m interested in data analyst, business intelligence and data science roles, and always up for talking
            about ML projects or e-commerce analytics.
          </p>
          <a href={`mailto:${profile.email}`} className="link mt-6 inline-block text-xl sm:text-3xl break-all">{profile.email}</a>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default Home;
