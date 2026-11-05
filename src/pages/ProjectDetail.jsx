import { useParams, Link } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import ProjectCard, { StatusBadge } from '../components/ProjectCard';
import Pipeline from '../components/Pipeline';
import Architecture from '../components/Architecture';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { ChevronLeft, GitHubIcon } from '../components/icons';
import { getProjectBySlug, getFeaturedProjects } from '../data/projects';

const PdfDeck = lazy(() => import('../components/PdfDeck'));

const formatMetric = (m) =>
  m.display ??
  `${m.value.toLocaleString('en-US', { minimumFractionDigits: m.decimals ?? 0, maximumFractionDigits: m.decimals ?? 0 })}${m.suffix ?? ''}`;

// One labelled row of the case study: the section name in the first cell, the content beside it.
// On phones the heading sits inside the content cell, so no grid line splits them.
const CaseRow = ({ n, label, formula, children }) => (
  <Row>
    <Cell id={`A${n}`} span="hidden lg:block lg:col-span-3" formula={formula}>
      <h2 className="font-sans text-lg font-bold text-ink">{label}</h2>
    </Cell>
    <Cell id={`D${n}`} span="col-span-12 lg:col-span-9" formula={formula}>
      <h2 className="lg:hidden mb-3 font-sans text-lg font-bold text-ink">{label}</h2>
      {children}
    </Cell>
  </Row>
);

// Long prose becomes a short list: one point per sentence (three or more sentences), plain text otherwise.
const Bullets = ({ text }) => {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z0-9$])/);
  if (parts.length < 3) return <p className="body-copy max-w-3xl">{text}</p>;
  return (
    <ul className="max-w-3xl space-y-2.5">
      {parts.map((part) => (
        <li key={part} className="relative pl-5 body-copy">
          <span aria-hidden="true" className="absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full bg-accent" />
          {part}
        </li>
      ))}
    </ul>
  );
};

// Metric cells always fill the row: 2x2 on phones, one row from desktop width.
const metricSpan = (i, n) => {
  if (n === 4) return 'col-span-6 lg:col-span-3';
  if (n === 3) return 'col-span-12 sm:col-span-4';
  if (i === n - 1 && n % 2 === 1) return 'col-span-12 lg:col-span-4';
  return 'col-span-6 lg:col-span-2';
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [tabId, setTabId] = useState('how');
  useSheet('A1', project ? `=PROJECT("${project.shortTitle}")` : '=NA()', project ? project.title : 'Project not found');

  if (!project) {
    return (
      <Sheet>
        <Row>
          <Cell id="A1" formula="=NA()" className="text-center !py-24">
            <h1 className="sheet-title">#N/A: this project doesn’t exist</h1>
            <p className="mt-3 text-ink-soft">The link may be out of date. Pick one from the full list instead.</p>
            <Link to="/projects" className="btn btn-primary mt-8">See all projects</Link>
          </Cell>
        </Row>
      </Sheet>
    );
  }

  const { caseStudy } = project;
  const tabs = caseStudy
    ? [
        { id: 'how', label: 'How it works (technical)' },
        project.decisions && { id: 'decisions', label: 'Key decisions' },
        caseStudy.lessons && { id: 'learned', label: `What ${project.team ? 'we' : 'I'} learned` },
        { id: 'stack', label: 'Tech stack' },
      ].filter(Boolean)
    : [];
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0];
  const baseUrl = import.meta.env.BASE_URL;
  const we = project.team ? 'we' : 'I';
  const moreProjects = getFeaturedProjects().filter((p) => p.id !== project.id).slice(0, 3);
  const figureCaption = project.video
    ? project.videoCaption || project.title
    : project.pdf
      ? 'The project deck. Use the arrows to page through the slides.'
      : project.title;
  const facts = [
    project.role && ['Role', project.role],
    project.event && ['Event', project.event],
    project.team && ['Team', project.team.join(', ')],
    ['Category', project.category],
    project.date && ['When', project.date],
    ['Tools', project.tools.join(', ')],
  ].filter(Boolean);
  let n = 4;

  return (
    <Sheet>
      {/* Title and facts */}
      <Row>
        <Cell id="A1" span="col-span-12 lg:col-span-8" formula={`=PROJECT("${project.shortTitle}")`} className="lg:!p-8">
          <Link to="/projects" className="inline-flex min-h-11 md:min-h-0 items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
            <ChevronLeft />
            Projects
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-accent-ink">{project.category}</span>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="mt-2 font-sans text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-ink">{project.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft max-w-3xl">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><GitHubIcon />View code</a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Live demo</a>
            )}
          </div>
        </Cell>
        <Cell id="I1" span="col-span-12 lg:col-span-4" pad={false} formula={`=INFO("${project.shortTitle}")`}>
          <dl className="divide-y divide-grid">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] text-[14.5px]">
                <dt className="px-4 py-3 bg-head/60 border-r border-grid text-muted">{k}</dt>
                <dd className="px-4 py-3 text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Cell>
      </Row>

      {/* The case and the solution, in plain language, before anything technical */}
      {project.story && (
        <Row>
          <Cell id="A2" span="col-span-12 md:col-span-6" formula="=CASE()" className="border-t-4 border-t-[#C27C0E] bg-[#FCF4E3] dark:bg-[#2A2417]">
            {/* Amber marks the problem: it draws the eye and pairs with the green solution beside it, without red's alarm. */}
            <div className="text-[13px] font-bold text-[#8A5A00] dark:text-[#F2C14E]">The case</div>
            <h2 className="mt-2 font-sans text-xl sm:text-2xl font-bold leading-snug text-ink">{project.story.case.headline}</h2>
            <ul className="mt-4 space-y-2">
              {project.story.case.points.map((pt) => (
                <li key={pt} className="relative pl-5 text-[16px] leading-snug text-ink-soft">
                  <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[#C27C0E]" />
                  {pt}
                </li>
              ))}
            </ul>
            {project.story.case.note && <p className="mt-4 text-[14px] leading-relaxed text-muted">{project.story.case.note}</p>}
          </Cell>
          <Cell id="H2" span="col-span-12 md:col-span-6" formula="=SOLUTION()" className="border-t-4 border-t-accent bg-accent-wash/40">
            <div className="text-[13px] font-bold text-accent-ink">Our solution</div>
            <h2 className="mt-2 font-sans text-xl sm:text-2xl font-bold leading-snug text-ink">{project.story.solution.headline}</h2>
            <ul className="mt-4 space-y-2">
              {project.story.solution.points.map((pt) => (
                <li key={pt} className="relative pl-5 text-[16px] leading-snug text-ink-soft">
                  <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
          </Cell>
        </Row>
      )}
      {/* TL;DR: the whole project in three cells */}
      {project.tldr && !project.story && (
        <Row>
          {['Problem', 'What was built', 'Result'].map((label, i) => (
            <Cell key={label} id={`${'AEI'[i]}2`} span="col-span-12 md:col-span-4" formula={`=TLDR(${i + 1})`} className={i === 2 ? 'bg-accent-wash/40' : ''}>
              <div className="text-[12.5px] font-semibold text-accent-ink">{label}</div>
              <p className={`mt-1 text-[15px] leading-snug ${i === 2 ? 'font-semibold text-ink' : 'text-ink-soft'}`}>{project.tldr[i]}</p>
            </Cell>
          ))}
        </Row>
      )}

      {/* Main figure */}
      {(project.video || project.pdf || project.image) && (
        <Row>
          <Cell id="A2" formula={project.video ? `=VIDEO("${project.video}")` : '=IMAGE(figure_1)'}>
            <figure>
              <figcaption className="mb-3 text-sm text-muted">
                <strong className="text-ink font-semibold">Figure 1.</strong> {figureCaption}
              </figcaption>
              {project.video ? (
                <div className="media-frame aspect-video">
                  <video
                    src={`${baseUrl}${project.video}`}
                    poster={`${baseUrl}${project.videoPoster}`}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  >
                    Your browser can’t play this video.
                  </video>
                </div>
              ) : project.pdf ? (
                <div className="media-frame">
                  <Suspense fallback={<img src={`${baseUrl}${project.pdfPoster}`} alt="First slide of the project deck" className="aspect-[2160/1214] w-full bg-stage object-contain" />}>
                    <PdfDeck src={`${baseUrl}${project.pdf}`} poster={project.pdfPoster} />
                  </Suspense>
                </div>
              ) : (
                <div className="media-frame aspect-video">
                  <img src={project.image} alt="" width="1280" height="720" className="w-full h-full object-cover" />
                </div>
              )}
            </figure>
          </Cell>
        </Row>
      )}

      {/* Key numbers */}
      {project.metrics && (
        <Row>
          {project.metrics.map((m, i) => (
            <Cell
              key={m.label}
              id={`${String.fromCharCode(65 + i * 2)}3`}
              span={metricSpan(i, project.metrics.length)}
              formula={`=METRIC("${m.label}")`}
            >
              <div className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-ink whitespace-nowrap">{formatMetric(m)}</div>
              <p className="mt-1.5 text-[13.5px] leading-snug text-ink-soft">{m.label}</p>
            </Cell>
          ))}
        </Row>
      )}

      {/* What was built */}
      {project.story?.built && (
        <Row>
          {project.story.built.map((item, i) => (
            <Cell key={item.title} id={`${'AEI'[i]}4`} span="col-span-12 md:col-span-4" formula={`=BUILT(${i + 1})`}>
              <div className="text-[12.5px] font-semibold text-accent-ink">{item.who}</div>
              <h3 className="mt-1 font-sans text-[17px] font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
            </Cell>
          ))}
        </Row>
      )}

      {/* Case study */}
      {caseStudy && (
        <>
          {!project.story && (
            <CaseRow n={n++} label="The problem" formula="=PROBLEM()">
              <p className="body-copy max-w-3xl">{caseStudy.problem}</p>
            </CaseRow>
          )}
          <CaseRow n={n++} label="Results" formula="=RESULTS()">
            <div className="rounded-sm border-l-4 border-accent bg-accent-wash/60 px-5 py-4 max-w-3xl">
              <Bullets text={caseStudy.results} />
            </div>
          </CaseRow>

          {/* The long parts live behind tabs so the page isn't a wall of text */}
          <Row>
            <Cell id={`A${n++}`} formula="=DETAILS()" className="!p-0">
              <div role="tablist" aria-label="Project details" className="flex overflow-x-auto border-b border-grid [scrollbar-width:none]">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    id={`tab-${t.id}`}
                    role="tab"
                    type="button"
                    aria-selected={t.id === tab.id}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => setTabId(t.id)}
                    className={`whitespace-nowrap px-4 sm:px-6 py-3.5 text-[14.5px] font-semibold border-b-2 -mb-px transition-colors duration-150 ${
                      t.id === tab.id ? 'border-accent text-accent-ink bg-accent-wash/40' : 'border-transparent text-ink-soft hover:text-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} className="p-4 sm:p-6 lg:p-8">
                {tab.id === 'how' && (
                  <div className="space-y-6">
                    {project.architecture ? <Architecture spec={project.architecture.spec} caption={project.architecture.caption} label={project.architecture.label} /> : project.pipeline && <Pipeline steps={project.pipeline} />}
                    <Bullets text={caseStudy.approach} />
                  </div>
                )}
                {tab.id === 'decisions' && (
                  <ol className="grid sm:grid-cols-2 gap-px bg-grid border border-grid">
                    {project.decisions.map((d, i) => (
                      <li key={d.title} className="bg-paper p-4 sm:[&:last-child:nth-child(odd)]:col-span-2">
                        <div className="font-mono text-[11px] text-muted">Decision {i + 1}</div>
                        <h3 className="mt-0.5 font-sans text-[16px] font-bold leading-snug text-ink">{d.title}</h3>
                        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{d.why}</p>
                        {d.alternative && <p className="mt-1.5 text-[14px] leading-relaxed text-muted">Alternative considered: {d.alternative}</p>}
                      </li>
                    ))}
                  </ol>
                )}
                {tab.id === 'learned' && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-px bg-grid border border-grid">
                      {caseStudy.lessons.map((lesson) => (
                        <div key={lesson.title} className="bg-paper p-4">
                          <h3 className="font-sans text-[16px] font-bold leading-snug text-ink">{lesson.title}</h3>
                          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{lesson.body}</p>
                        </div>
                      ))}
                    </div>
                    {caseStudy.improvements && (
                      <div>
                        <h3 className="font-sans text-[15px] font-bold text-ink">What {we}’d do next</h3>
                        <div className="mt-2"><Bullets text={caseStudy.improvements} /></div>
                      </div>
                    )}
                  </div>
                )}
                {tab.id === 'stack' &&
                  (typeof caseStudy.techStack === 'string' ? (
                    <p className="body-copy">{caseStudy.techStack}</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-px bg-grid border border-grid">
                      {Object.entries(caseStudy.techStack).map(([group, items]) => (
                        <div key={group} className="bg-paper p-4">
                          <h3 className="font-sans text-[15px] font-bold text-ink">{group}</h3>
                          <ul className="mt-2 space-y-1.5">
                            {items.map((item) => (
                              <li key={item} className="relative pl-4 text-[14.5px] leading-snug text-ink-soft">
                                <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-accent" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </Cell>
          </Row>
        </>
      )}

      {/* More work */}
      {moreProjects.length > 0 && (
        <Row>
          {moreProjects.map((p, i) => (
            <Cell key={p.id} id={`${'AEI'[i]}${n}`} span="col-span-12 md:col-span-4" formula={`=PROJECT("${p.shortTitle}")`}>
              <ProjectCard project={p} compact />
            </Cell>
          ))}
        </Row>
      )}
    </Sheet>
  );
};

export default ProjectDetail;
