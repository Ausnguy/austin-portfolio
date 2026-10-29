import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import './index.css';
import { initTracking } from './lib/track';

initTracking();

// After a new deploy, an open tab can ask for a script file that no longer exists, which used to leave a blank page.
// Reload once to pick up the new version (the flag stops a reload loop).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  try {
    if (sessionStorage.getItem('reloaded-for-update')) return;
    sessionStorage.setItem('reloaded-for-update', '1');
  } catch {
    return;
  }
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/austin-portfolio">
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
