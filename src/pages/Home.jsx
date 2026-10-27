import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import LoopVideo from '../components/LoopVideo';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { GitHubIcon, LinkedInIcon } from '../components/icons';
import { getFeaturedProjects, getSpotlightProject, projects } from '../data/projects';
import { experiences } from '../data/experience';
import ToolIcon from '../components/ToolIcon';
import { homeTools, metaFor } from '../data/toolIcons';
import { profile } from '../data/profile';

const ExperienceChart3D = lazy(() => import('../components/ExperienceChart3D'));

const HOME_FORMULA = '=TURN(messy_data, "decisions people act on")';

// Spans for the cell that fills out the last row of project cards (full class names so Tailwind keeps them).
const FILLER_SPAN = { 1: 'lg:col-span-3', 2: 'lg:col-span-6', 3: 'lg:col-span-9' };

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

// Three plain facts, each linked to where the detail lives.
const stats = [
  { value: String(projects.length), label: 'projects I’ve built and written up', to: '/projects' },
  { value: String(experiences.length), label: 'jobs, internships and programs since 2023', to: '/experience' },
  { value: profile.gpa, label: 'GPA at the University of Houston', to: '/skills' },
];

const Home = () => {
  useSheet('A1', HOME_FORMULA);
  const spotlight = getSpotlightProject();
  const others = getFeaturedProjects().filter((p) => p !== spotlight).slice(0, 4);
  const baseUrl = import.meta.env.BASE_URL;
  const resumeUrl = `${baseUrl}resume.pdf?v=3`;

  return (
    <Sheet>
      {/* Who I am, and the assistant */}
      <Row>
        <Cell id="A1" span="col-span-12 lg:col-span-8" formula={HOME_FORMULA} className="lg:!p-10">
          <div className="font-sans text-2xl sm:text-3xl font-semibold text-accent-ink">Hi, I’m Austin.</div>
          <h1 className="mt-5 font-sans text-[2rem] sm:text-5xl lg:text-[3.4rem] font-medium tracking-[-0.015em] leading-[1.18] text-ink max-w-3xl">
            I got into <strong className="font-bold">data</strong> by running an{' '}
            {/* Wordmark letters fill the top 59% of the image. Dropping the image 0.49em below the baseline puts the letters on
                the text baseline, and the line box grows to make room for the smile instead of colliding with the next line. */}
            <img src={`${baseUrl}logos/amazon.png`} alt="Amazon" className="mx-[0.12em] inline h-[1.2em] w-auto align-[-0.49em] dark:hidden" />
            <img src={`${baseUrl}logos/amazon-dark.png`} alt="Amazon" className="mx-[0.12em] hidden h-[1.2em] w-auto align-[-0.49em] dark:inline" />
            {' '}store.
          </h1>
          <p className="mt-6 max-w-2xl text-xl sm:text-2xl lg:text-[1.7rem] font-normal leading-snug text-ink-soft">
            Now I build the <strong className="font-semibold text-ink">pipelines, models and dashboards</strong> that help people{' '}
            <strong className="font-semibold text-ink">decide what to do next</strong>.
          </p>
          <p className="mt-5 text-[15px] text-muted">MIS at the University of Houston · Data Analyst Intern at HPE · {profile.location}</p>
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
            before you see it.
          </p>
          <div className="mt-auto pt-5">
            <AskTeaser />
          </div>
        </Cell>
      </Row>

      {/* Three numbers */}
      <Row>
        {stats.map((item, i) => (
          <Cell key={item.value} id={`${'ADG'[i]}2`} span="col-span-12 sm:col-span-4" formula={`=PROOF(${i + 1})`}>
            <Link to={item.to} className="group block">
              <div className="font-sans text-5xl sm:text-6xl font-bold tracking-tight leading-none text-ink">{item.value}</div>
              <p className="mt-3 text-[16px] leading-snug text-ink-soft group-hover:text-ink">{item.label}</p>
            </Link>
          </Cell>
        ))}
      </Row>

      {/* Featured project */}
      {spotlight && (
        <Row>
          <Cell id="A3" span="col-span-12 lg:col-span-7" pad={false} formula={`=HYPERLINK("${spotlight.links.demo}", "${spotlight.shortTitle}")`}>
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
          <Cell id="H3" span="col-span-12 lg:col-span-5" formula="=FILTER(projects, featured=TRUE)" className="flex flex-col">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-accent-ink">Featured build</span>
              <span className="text-muted">{spotlight.date}</span>
            </div>
            <h2 className="mt-2 font-sans text-2xl font-bold leading-tight text-ink">{spotlight.title}</h2>
            <p className="mt-3 body-copy">{spotlight.description}</p>
            <div className="mt-auto pt-6 flex flex-wrap gap-2.5">
              <Link to={`/projects/${spotlight.slug}`} className="btn btn-primary">Case study + video</Link>
              <a href={spotlight.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Live demo</a>
            </div>
          </Cell>
        </Row>
      )}

      {/* More projects */}
      <Row>
        {others.map((project, i) => (
          <Cell
            key={project.id}
            id={`${'ADGJ'[i % 4]}4`}
            span="col-span-12 md:col-span-6 lg:col-span-3"
            formula={`=PROJECT("${project.shortTitle}")`}
          >
            <ProjectCard project={project} index={i} compact />
          </Cell>
        ))}
        {others.length % 4 !== 0 && (
          <Cell id="Z4" span={`col-span-12 md:col-span-6 ${FILLER_SPAN[4 - (others.length % 4)]}`} formula="=COUNTA(projects)" className="flex items-center justify-center">
            <Link to="/projects" className="link">Open the Projects sheet</Link>
          </Cell>
        )}
      </Row>
      <Row>
        <Cell id="A5" formula="=COUNTA(projects)" className="!py-3 text-center">
          <Link to="/projects" className="link">See every project</Link>
        </Cell>
      </Row>

      {/* Toolbox: logos only, the detail lives on the Skills sheet */}
      <Row>
        <Cell id="A6" formula="=STACK()">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2 className="font-sans text-xl font-bold text-ink">Toolbox</h2>
            <Link to="/skills" className="text-sm link">What each tool did</Link>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 border-l border-t border-grid">
            {homeTools.map((name) => (
              <Link
                key={name}
                to="/skills"
                className="flex flex-col items-center justify-center gap-2.5 border-b border-r border-grid bg-paper px-2 py-5 sm:py-7 text-center hover:bg-head/70 transition-colors duration-150"
              >
                <ToolIcon name={name} />
                <span className="text-[13px] leading-tight text-ink-soft">{metaFor(name).label}</span>
              </Link>
            ))}
          </div>
        </Cell>
      </Row>

      {/* Experience at a glance */}
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
                </div>
              </li>
            ))}
          </ol>
          <Link to="/experience" className="link mt-4 inline-block">Full timeline and details</Link>
        </Cell>
      </Row>

      {/* Contact */}
      <Row>
        <Cell id="A8" formula={`=HYPERLINK("mailto:${profile.email}")`} className="lg:!p-10">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-ink">Let’s build something.</h2>
          <p className="mt-3 body-copy max-w-2xl">
            I’m interested in data analyst, business intelligence and data science roles, and always up for talking
            about ML projects or e-commerce analytics.
          </p>
          <a href={`mailto:${profile.email}`} className="link mt-6 inline-block text-xl sm:text-3xl break-all">{profile.email}</a>
          <p className="mt-6 text-[13.5px] text-muted">
            This site is a project too: hosted AI assistant, 3D charts, Lighthouse 94 / 100 / 100 / 100.{' '}
            <a href="https://github.com/Ausnguy/austin-portfolio" target="_blank" rel="noopener noreferrer" className="link">Read the code</a>
          </p>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default Home;
