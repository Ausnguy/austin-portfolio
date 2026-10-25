import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import LoopVideo from '../components/LoopVideo';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { GitHubIcon, LinkedInIcon } from '../components/icons';
import { getFeaturedProjects, getSpotlightProject } from '../data/projects';
import { experiences } from '../data/experience';
import { skillGroups } from '../data/skills';
import { profile } from '../data/profile';

const ExperienceChart3D = lazy(() => import('../components/ExperienceChart3D'));

const HOME_FORMULA = '=TURN(messy_data, "decisions people act on")';

// Spans for the cell that fills out the last row of project cards (full class names so Tailwind keeps them).
const FILLER_SPAN = { 1: 'lg:col-span-3', 2: 'lg:col-span-6', 3: 'lg:col-span-9' };

// One headline result per kind of work, each linked to where it comes from.
const results = [
  { id: 'A3', area: 'Machine learning', value: '90 of 91', label: 'equipment failures flagged before they happened', link: '/projects/casequest-2026', linkText: 'Parvius', formula: '=COUNTIF(failures, "warned first")' },
  { id: 'D3', area: 'AI infrastructure', value: '~70%', label: 'less modeled energy by routing simple requests to small models', link: '/projects/ai-efficiency-modeling', linkText: 'BNY project', formula: '=1 - energy_after / energy_before' },
  { id: 'G3', area: 'Business', value: '$75K+', label: 'first-year revenue from the Amazon store I ran, at 30%+ margins', link: '/projects/sales-analytics-dashboard', linkText: 'ToolAndMore', formula: '=SUM(ToolAndMore!revenue_year_1)' },
  { id: 'J3', area: 'Academics', value: profile.gpa, label: 'GPA at UH Bauer, on the Dean’s List since Fall 2023', link: '/skills', linkText: 'Education', formula: '=GPA("UH Bauer")' },
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
            I build data systems end to end: the pipeline, the model, the dashboard and the app on top.
          </p>
          <p className="mt-3 body-copy max-w-2xl">
            Most recently my team shipped Parvius, a failure-prediction model, a 3D operations console and a
            field engineer phone app sharing one live state, for CaseQuest 2026. This site even runs a language model
            in your browser so you can question my resume.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View resume</a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary">Email me</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><GitHubIcon />GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><LinkedInIcon />LinkedIn</a>
          </div>
        </Cell>
        <Cell id="I1" span="col-span-12 lg:col-span-4" formula='=ASK("anything about Austin")' className="bg-accent-wash/40 flex flex-col">
          <div className="cell-ref">I1</div>
          <h2 className="mt-1 font-sans text-xl font-bold text-ink">Ask about me</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            A small language model that runs on your device and answers only from the facts in this workbook. No server,
            no API key.
          </p>
          <div className="mt-auto pt-5">
            <AskTeaser />
          </div>
        </Cell>
      </Row>

      {/* Row 2: where I am right now */}
      <Row>
        <Cell id="A2" span="col-span-12 sm:col-span-4" formula='=SCHOOL("University of Houston")' className="!py-4">
          <div className="text-[13px] text-muted">School</div>
          <div className="mt-0.5 font-semibold text-ink">MIS at UH Bauer, May 2027</div>
        </Cell>
        <Cell id="E2" span="col-span-12 sm:col-span-4" formula='=NOW("Hewlett Packard Enterprise")' className="!py-4">
          <div className="text-[13px] text-muted">Now</div>
          <div className="mt-0.5 font-semibold text-ink">Data Analyst Intern at HPE</div>
        </Cell>
        <Cell id="I2" span="col-span-12 sm:col-span-4" formula='=LOCATION("Houston, TX")' className="!py-4">
          <div className="text-[13px] text-muted">Based in</div>
          <div className="mt-0.5 font-semibold text-ink">{profile.location}</div>
        </Cell>
      </Row>

      {/* Row 3: one headline result per kind of work */}
      <Row>
        {results.map((r) => (
          <Cell key={r.id} id={r.id} span="col-span-6 lg:col-span-3" formula={r.formula} className="flex flex-col">
            <div className="text-[12.5px] font-semibold text-accent-ink">{r.area}</div>
            <div className="mt-2 font-sans text-[1.9rem] sm:text-[2.5rem] font-bold tracking-tight leading-none text-ink whitespace-nowrap">
              {r.value}
            </div>
            <p className="mt-2 text-[13.5px] sm:text-[14px] leading-snug text-ink-soft">{r.label}</p>
            <Link to={r.link} className="mt-auto pt-3 text-[13.5px] link self-start">{r.linkText}</Link>
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
            <h2 className="font-sans text-xl font-bold text-ink">Stack</h2>
            <Link to="/skills" className="text-sm link">Where I’ve used each one</Link>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {skillGroups.map(({ group, skills }) => (
              <div key={group}>
                <div className="text-[13px] text-muted">{group}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {skills.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
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

      {/* Row 8: contact */}
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
