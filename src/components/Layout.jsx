import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useWorkbook } from './workbook';

export const SHEETS = [
  { to: '/', label: 'Summary', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills & Education', short: 'Skills' },
  { to: '/ask', label: 'Ask Austin' },
];

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="w-9 h-9 grid place-items-center rounded text-white/90 hover:text-white hover:bg-white/10 transition-colors"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
};

const FormulaBar = () => {
  const { active } = useWorkbook();
  return (
    <div className="flex items-stretch h-9 bg-paper border-b border-grid text-[13.5px]">
      <div className="w-16 sm:w-20 shrink-0 flex items-center px-3 border-r border-grid font-mono text-muted">
        {active.ref}
      </div>
      <div className="px-3 flex items-center border-r border-grid font-serif italic text-muted select-none" aria-hidden="true">
        fx
      </div>
      <div className="min-w-0 flex-1 flex items-center px-3 font-mono text-ink truncate" title={active.formula}>
        <span className="truncate">{active.formula}</span>
      </div>
    </div>
  );
};

const SheetTab = ({ sheet, compact = false }) => (
  <NavLink
    to={sheet.to}
    end={sheet.end}
    className={({ isActive }) =>
      `shrink-0 h-11 md:h-10 px-4 inline-flex items-center text-[14px] border-r border-grid transition-colors ${
        isActive
          ? 'bg-paper text-accent-ink font-semibold shadow-[inset_0_-3px_0_rgb(var(--accent))]'
          : 'text-ink-soft hover:text-ink hover:bg-paper/60'
      }`
    }
  >
    {compact && sheet.short ? sheet.short : sheet.label}
  </NavLink>
);

const Layout = ({ children }) => {
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf?v=5`;

  return (
    <div className="min-h-screen flex flex-col md:pb-[4.75rem]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded focus:bg-paper focus:text-ink text-sm font-semibold"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40">
        {/* Title bar */}
        <div className="bg-[#107C41] text-white">
          <div className="page h-12 px-3 sm:px-4 flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-semibold text-[16px] whitespace-nowrap">
              <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-6 w-6 rounded-[5px] ring-1 ring-white/30" />
              <span>Austin_Nguyen<span className="font-normal text-white/90">.xlsx</span></span>
            </Link>
            <nav aria-label="Sheets" className="hidden md:flex items-center gap-1 text-[14.5px]">
              {SHEETS.map((sheet) => (
                <NavLink
                  key={sheet.to}
                  to={sheet.to}
                  end={sheet.end}
                  className={({ isActive }) =>
                    `px-2.5 h-8 inline-flex items-center rounded transition-colors ${
                      isActive ? 'bg-white/15 text-white font-semibold' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {sheet.label}
                </NavLink>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 inline-flex items-center rounded bg-white text-[#0B5A2F] text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
        {/* Phones: sheet tabs sit under the title bar, so nothing is pinned over the content. */}
        <nav aria-label="Sheet tabs" className="md:hidden flex overflow-x-auto bg-head border-b border-grid [scrollbar-width:none]">
          {SHEETS.map((sheet) => (
            <SheetTab key={sheet.to} sheet={sheet} compact />
          ))}
        </nav>
        <div className="hidden md:block page border-x border-grid">
          <FormulaBar />
        </div>
      </header>

      <main id="main" className="page w-full flex-1">
        {children}
      </main>

      <footer className="md:hidden px-4 py-6 text-center text-[13px] text-muted">© 2026 Austin Nguyen · anonymous visit counts, no cookies</footer>

      {/* Desktop: sheet tabs and status bar, pinned like Excel's */}
      <div className="hidden md:block fixed bottom-0 inset-x-0 z-40 bg-head border-t border-grid">
        <nav aria-label="Sheet tabs" className="page flex overflow-x-auto">
          {SHEETS.map((sheet) => (
            <SheetTab key={sheet.to} sheet={sheet} />
          ))}
        </nav>
        <div className="bg-[#107C41] text-white/90 text-[12px]">
          <div className="page h-7 px-3 sm:px-4 flex items-center justify-between">
            <span>Ready</span>
            <span>© 2026 Austin Nguyen · anonymous visit counts, no cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
