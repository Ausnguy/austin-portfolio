import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });
      
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (id) => {
    if (location.pathname !== '/') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const isActive = (path, section = null) => {
    if (section && location.pathname === '/') {
      return activeSection === section;
    }
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cream border-b-2 border-charcoal">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-sans font-bold text-lg hover:text-rust transition-colors">
            AN
          </Link>
          
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`font-mono text-xs uppercase tracking-wider relative pb-0.5 transition-colors ${
                isActive('/') ? 'text-charcoal' : 'text-slate hover:text-charcoal'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust"></span>
              )}
            </Link>
            
            {location.pathname === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('work')}
                  className={`font-mono text-xs uppercase tracking-wider relative pb-0.5 transition-colors ${
                    isActive(null, 'work') ? 'text-charcoal' : 'text-slate hover:text-charcoal'
                  }`}
                >
                  Work
                  {isActive(null, 'work') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust"></span>
                  )}
                </button>
                
                <button
                  onClick={() => scrollToSection('projects')}
                  className={`font-mono text-xs uppercase tracking-wider relative pb-0.5 transition-colors ${
                    isActive(null, 'projects') ? 'text-charcoal' : 'text-slate hover:text-charcoal'
                  }`}
                >
                  Projects
                  {isActive(null, 'projects') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust"></span>
                  )}
                </button>
                
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`font-mono text-xs uppercase tracking-wider relative pb-0.5 transition-colors ${
                    isActive(null, 'contact') ? 'text-charcoal' : 'text-slate hover:text-charcoal'
                  }`}
                >
                  Contact
                  {isActive(null, 'contact') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust"></span>
                  )}
                </button>
              </>
            )}
            
            {location.pathname === '/projects' && (
              <Link
                to="/projects"
                className={`font-mono text-xs uppercase tracking-wider relative pb-0.5 transition-colors ${
                  isActive('/projects') ? 'text-charcoal' : 'text-slate hover:text-charcoal'
                }`}
              >
                Projects
                {isActive('/projects') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rust"></span>
                )}
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t-2 border-charcoal py-8 bg-cream relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="font-mono text-xs">© 2026 Austin Nguyen</div>
            <div className="font-mono text-xs text-slate">Built with React + Vite</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
