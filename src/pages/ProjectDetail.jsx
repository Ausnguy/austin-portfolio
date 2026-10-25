import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import ProjectCard, { StatusBadge } from '../components/ProjectCard';
import Pipeline from '../components/Pipeline';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { ChevronLeft, GitHubIcon } from '../components/icons';
import { getProjectBySlug, getFeaturedProjects } from '../data/projects';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfFirstPage = ({ src, poster }) => {
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRendered, setHasRendered] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let loadingTask;
    let isActive = true;

    const loadPdf = async () => {
      try {
        loadingTask = pdfjsLib.getDocument({ url: src, disableWorker: true });
        const pdf = await loadingTask.promise;
        if (!isActive) {
          pdf.destroy();
          return;
        }
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
      } catch (error) {
        if (isActive) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isActive = false;
      loadingTask?.destroy();
      pdfRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    let renderTask;
    let isActive = true;

    const renderPage = async () => {
      if (!pdfRef.current || !canvasRef.current) return;

      try {
        setIsLoading(true);
        const page = await pdfRef.current.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = viewport.width;
        nextCanvas.height = viewport.height;
        renderTask = page.render({
          canvasContext: nextCanvas.getContext('2d'),
          viewport,
        });
        await renderTask.promise;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.getContext('2d').drawImage(nextCanvas, 0, 0);
        if (isActive) {
          setHasRendered(true);
          setIsLoading(false);
        }
      } catch (error) {
        if (isActive && error?.name !== 'RenderingCancelledException') {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    renderPage();
    return () => {
      isActive = false;
      renderTask?.cancel();
    };
  }, [pageNumber, totalPages]);

  return (
    <div className="relative aspect-[2160/1214] w-full bg-stage">
      {!hasRendered && (
        <img
          src={`${import.meta.env.BASE_URL}${poster}`}
          alt="First slide of the project PDF"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
      )}
      {isLoading && !hasError && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stage/80 px-3 py-1 font-sans text-xs font-medium text-white">
          Loading slide…
        </span>
      )}
      {hasError && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stage/80 px-3 py-1 text-center font-sans text-xs font-medium text-white">
          Download the PDF to view the full deck
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`Slide ${pageNumber} of the project PDF`}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain ${hasRendered && !hasError ? 'block' : 'hidden'}`}
      />
      {totalPages > 1 && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <button
            type="button"
            disabled={pageNumber === 1 || totalPages === 0}
            onClick={() => setPageNumber((currentPage) => Math.max(1, currentPage - 1))}
            aria-label="Previous slide"
            className="pointer-events-auto absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-stage/80 font-sans text-xl text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-white/40 bg-stage/80 px-3 py-1 font-sans text-xs text-white">
            {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pageNumber === totalPages || totalPages === 0}
            onClick={() => setPageNumber((currentPage) => Math.min(totalPages, currentPage + 1))}
            aria-label="Next slide"
            className="pointer-events-auto absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-stage/80 font-sans text-xl text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
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
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
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
            {project.pdf && (
              <a href={`${baseUrl}${project.pdf}`} download className="btn btn-primary">Download PDF</a>
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

      {/* TL;DR: the whole project in three cells */}
      {project.tldr && (
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
                    Your browser can’t play this video. <a href={`${baseUrl}${project.video}`}>Download it instead</a>.
                  </video>
                </div>
              ) : project.pdf ? (
                <div className="media-frame">
                  <PdfFirstPage src={`${baseUrl}${project.pdf}`} poster={project.pdfPoster} />
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

      {/* Case study */}
      {caseStudy && (
        <>
          <CaseRow n={n++} label="The problem" formula="=PROBLEM()">
            <p className="body-copy max-w-3xl">{caseStudy.problem}</p>
          </CaseRow>
          <CaseRow n={n++} label={`How ${we} built it`} formula="=APPROACH()">
            <p className="body-copy max-w-3xl">{caseStudy.approach}</p>
          </CaseRow>
          {project.pipeline && (
            <CaseRow n={n++} label="How it fits together" formula="=FLOW(pipeline)">
              <Pipeline steps={project.pipeline} />
            </CaseRow>
          )}
          {project.decisions && (
            <CaseRow n={n++} label="Key decisions" formula="=DECISIONS()">
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
            </CaseRow>
          )}
          <CaseRow n={n++} label="Results" formula="=RESULTS()">
            <div className="rounded-sm border-l-4 border-accent bg-accent-wash/60 px-5 py-4 max-w-3xl">
              <p className="body-copy text-ink">{caseStudy.results}</p>
            </div>
          </CaseRow>
          {caseStudy.lessons && (
            <CaseRow n={n++} label={`What ${we} learned`} formula="=LESSONS()">
              <div className="grid sm:grid-cols-2 gap-px bg-grid border border-grid">
                {caseStudy.lessons.map((lesson) => (
                  <div key={lesson.title} className="bg-paper p-4">
                    <h3 className="font-sans text-[16px] font-bold leading-snug text-ink">{lesson.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{lesson.body}</p>
                  </div>
                ))}
              </div>
            </CaseRow>
          )}
          <CaseRow n={n++} label={`What ${we}’d do next`} formula="=NEXT_STEPS()">
            <p className="body-copy max-w-3xl">{caseStudy.improvements}</p>
          </CaseRow>
          <CaseRow n={n++} label="Tech stack" formula="=STACK()">
            {typeof caseStudy.techStack === 'string' ? (
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
            )}
          </CaseRow>
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
