import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkbook } from './workbook';
import { profile } from '../data/profile';
import { trackEvent } from '../lib/track';

// A 60-second guided tour for recruiters: it moves between sheets, selects one cell per stop like a co-author would,
// and explains it in a note styled like an Excel comment. Start it with startTour() or a link ending in ?tour=1.
const STEPS = [
  {
    path: '/',
    target: '[data-cell="A1"]',
    title: 'Who Austin is',
    body: `MIS at the University of Houston (${profile.gpa} GPA) and a Data Analyst Intern at HPE. Open to Spring 2027 internships and new-grad roles from Summer 2027.`,
  },
  {
    path: '/',
    target: '[data-cell="A3"]',
    title: 'Start with Parvius',
    body: 'A system that warns before oil-field machines fail. Austin built the front end and the failure-prediction model, which warned before 90 of 91 failures on data it had never seen.',
  },
  {
    path: '/projects',
    target: '[data-cell="A1"]',
    title: 'Every project, written up',
    body: 'Each one opens with the problem and the result in plain language. The technical detail is further down for anyone who wants it.',
  },
  {
    path: '/experience',
    target: '[data-cell="A1"]',
    title: 'Experience',
    body: 'Internships at HPE and USI Insurance Services, Bloomberg’s Decoded: Data program, and Carnegie Mellon Tepper’s business analytics summit.',
  },
  {
    path: '/skills',
    target: '[data-cell="A1"]',
    title: 'Skills, with proof',
    body: 'Every tool links to the project or role where Austin actually used it.',
  },
  {
    path: '/ask',
    target: '#fit',
    title: 'Hiring for a role?',
    body: 'Paste the job description here to see which of its requirements Austin’s work covers, and which it doesn’t.',
  },
];

export const startTour = () => window.dispatchEvent(new Event('tour:start'));

const findCell = (selector) => document.querySelector(selector)?.closest('[data-cell]') ?? null;

// Waits (up to 2s) for a step's cell to exist, since a sheet may still be loading.
const waitForCell = (selector) =>
  new Promise((resolve) => {
    let tries = 0;
    const look = () => {
      const cell = findCell(selector);
      if (cell || ++tries > 40) resolve(cell);
      else setTimeout(look, 50);
    };
    look();
  });

// The outline lives in page coordinates, so it scrolls with its cell instead of chasing it.
const pageRect = (cell) => {
  const r = cell.getBoundingClientRect();
  return { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
};

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Tour = () => {
  const [step, setStep] = useState(null);
  const [rect, setRect] = useState(null);
  // True while a page-to-page move runs as a view transition, which animates the outline itself.
  const [crossing, setCrossing] = useState(false);
  const cellRef = useRef(null);
  const headingRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setPeek } = useWorkbook();
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf?v=7`;

  const close = useCallback(() => {
    setStep(null);
    setRect(null);
    setPeek(null);
  }, [setPeek]);

  // Start from a button anywhere, or from a shared link with ?tour=1.
  useEffect(() => {
    const start = () => {
      trackEvent('tour');
      // Load every sheet the tour visits now, so no stop waits on the network.
      [import('../pages/Projects'), import('../pages/Experience'), import('../pages/Skills'), import('../pages/Ask')].forEach((p) => p.catch(() => {}));
      setStep(0);
    };
    window.addEventListener('tour:start', start);
    if (new URLSearchParams(window.location.search).get('tour') === '1') start();
    return () => window.removeEventListener('tour:start', start);
  }, []);

  // Go to the step's sheet, wait for its cell, scroll it into view and outline it.
  useEffect(() => {
    if (step === null) return undefined;
    const s = STEPS[step];
    if (pathname !== s.path) {
      navigate(s.path);
      return undefined;
    }
    let tries = 0;
    let timer;
    const measure = () => cellRef.current && setRect(pageRect(cellRef.current));
    const locate = () => {
      const cell = findCell(s.target);
      if (!cell) {
        if (++tries < 60) timer = setTimeout(locate, 50);
        return;
      }
      cellRef.current = cell;
      cell.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
      setPeek({ ref: cell.dataset.cell, formula: `=TOUR(${step + 1}, ${STEPS.length})` });
      measure();
      headingRef.current?.focus({ preventScroll: true });
    };
    locate();
    // Images and charts can still be settling, so measure again once they have.
    const settle = setTimeout(measure, 700);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      clearTimeout(settle);
      window.removeEventListener('resize', measure);
    };
  }, [step, pathname, navigate, setPeek]);

  // Moving to another sheet runs as a view transition: the page crossfades while the outline and the note glide
  // to their new place. Same-sheet moves scroll smoothly and the outline slides on its own.
  const goTo = useCallback(
    (i) => {
      const next = STEPS[i];
      if (next.path === pathname || reducedMotion() || !document.startViewTransition) {
        setStep(i);
        return;
      }
      setCrossing(true);
      const transition = document.startViewTransition(async () => {
        flushSync(() => {
          setStep(i);
          navigate(next.path);
        });
        const cell = await waitForCell(next.target);
        if (!cell) return;
        cellRef.current = cell;
        cell.scrollIntoView({ block: 'center', behavior: 'instant' });
        flushSync(() => setRect(pageRect(cell)));
      });
      transition.finished.finally(() => setCrossing(false));
    },
    [pathname, navigate],
  );

  useEffect(() => {
    if (step === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) goTo(step + 1);
      if (e.key === 'ArrowLeft' && step > 0) goTo(step - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, close, goTo]);

  if (step === null) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <>
      {rect &&
        createPortal(
          <div className="tour-layer" aria-hidden="true">
            <div
              className={`swarm-box tour-box ${crossing ? 'is-crossing' : ''}`}
              style={{ '--c': '#107C41', left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
            >
              <span>Tour {step + 1}/{STEPS.length}</span>
            </div>
          </div>,
          document.body,
        )}
      <div role="dialog" aria-label="Site tour" className="tour-note">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#107C41] text-[11px] font-bold text-white" aria-hidden="true">AN</span>
          <span className="text-[13px] font-semibold text-ink">Austin Nguyen</span>
          <span className="ml-auto font-mono text-[12px] text-muted">{step + 1} / {STEPS.length}</span>
        </div>
        <div key={step} className="tour-step">
          <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-sans text-[17px] font-bold text-ink focus:outline-none">{s.title}</h2>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {last ? (
            <>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary h-11 md:h-10">View resume</a>
              <a href={`mailto:${profile.email}`} className="btn btn-secondary h-11 md:h-10">Email Austin</a>
              <button type="button" onClick={close} className="btn btn-secondary h-11 md:h-10 ml-auto">Done</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => goTo(step + 1)} className="btn btn-primary h-11 md:h-10">Next</button>
              {step > 0 && <button type="button" onClick={() => goTo(step - 1)} className="btn btn-secondary h-11 md:h-10">Back</button>}
              <button type="button" onClick={close} className="ml-auto h-11 md:h-10 px-2 text-[14px] font-medium text-muted hover:text-ink">End tour</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Tour;
