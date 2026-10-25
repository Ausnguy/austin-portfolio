import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { EASE_OUT } from './lib/motion';

function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout>
      {/* Each route fades in on navigation so content doesn't teleport. */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, transform: reduceMotion ? 'none' : 'translateY(8px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)', transitionEnd: { transform: 'none' } }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </motion.div>
    </Layout>
  );
}

export default App;
