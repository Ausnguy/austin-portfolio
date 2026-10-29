import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { WorkbookProvider } from './components/workbook';
import Home from './pages/Home';

// The Summary loads with the app; every other sheet is its own chunk, fetched when opened.
const loaders = {
  Projects: () => import('./pages/Projects'),
  ProjectDetail: () => import('./pages/ProjectDetail'),
  Experience: () => import('./pages/Experience'),
  Skills: () => import('./pages/Skills'),
  Ask: () => import('./pages/Ask'),
  NotFound: () => import('./pages/NotFound'),
};
const Projects = lazy(loaders.Projects);
const ProjectDetail = lazy(loaders.ProjectDetail);
const Experience = lazy(loaders.Experience);
const Skills = lazy(loaders.Skills);
const Ask = lazy(loaders.Ask);
const NotFound = lazy(loaders.NotFound);

// Once the first screen is up, fetch the other sheets in the background so switching tabs never waits on the network.
const prefetchSheets = () => Object.values(loaders).forEach((load) => load().catch(() => {}));

// Full-height placeholder so nothing below (like the footer) jumps when the sheet arrives.
const SheetLoading = () => <div className="min-h-screen bg-paper border-x border-grid" aria-busy="true" />;

function App() {
  const location = useLocation();

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1500));
    const handle = idle(prefetchSheets);
    return () => (window.cancelIdleCallback ?? clearTimeout)(handle);
  }, []);

  // New sheet starts at the top, or at the element named in the hash.
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <WorkbookProvider>
      <Layout>
        {/* Switching sheets is a frequent action, so it swaps instantly: no fade from blank, which read as a flash. */}
        <div>
          <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<SheetLoading />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </div>
      </Layout>
    </WorkbookProvider>
  );
}

export default App;
