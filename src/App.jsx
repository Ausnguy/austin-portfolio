import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from './components/Layout';
import { WorkbookProvider } from './components/workbook';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Ask from './pages/Ask';
import { EASE_OUT } from './lib/motion';

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
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/ask" element={<Ask />} />
          </Routes>
        </motion.div>
      </Layout>
    </WorkbookProvider>
  );
}

export default App;
