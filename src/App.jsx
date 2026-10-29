import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { WorkbookProvider } from './components/workbook';
import Home from './pages/Home';
import { EASE_OUT } from './lib/motion';

// The Summary loads with the app; every other sheet is its own chunk, fetched when opened.
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Experience = lazy(() => import('./pages/Experience'));
const Skills = lazy(() => import('./pages/Skills'));
const Ask = lazy(() => import('./pages/Ask'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Full-height placeholder so nothing below (like the footer) jumps when the sheet arrives.
const SheetLoading = () => <div className="min-h-screen bg-paper border-x border-grid" aria-busy="true" />;

function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

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
        {/* Each sheet fades in on navigation so content doesn't teleport. */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, transform: reduceMotion ? 'none' : 'translateY(6px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' } }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
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
        </motion.div>
      </Layout>
    </WorkbookProvider>
  );
}

export default App;
