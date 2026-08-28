import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

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
    <div className="relative aspect-[2160/1214] w-full bg-charcoal">
      {!hasRendered && (
        <img
          src={`${import.meta.env.BASE_URL}${poster}`}
          alt="First slide of the project PDF"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
      )}
      {isLoading && !hasError && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-charcoal/80 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cream">
          Loading slide...
        </span>
      )}
      {hasError && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-charcoal/80 px-3 py-1 text-center font-mono text-xs uppercase tracking-wider text-cream">
          Use Download PDF to view the full deck
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
            className="pointer-events-auto absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-cream bg-charcoal/80 font-mono text-xl text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-cream/60 bg-charcoal/80 px-3 py-1 font-mono text-xs text-cream">
            {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pageNumber === totalPages || totalPages === 0}
            onClick={() => setPageNumber((currentPage) => Math.min(totalPages, currentPage + 1))}
            aria-label="Next slide"
            className="pointer-events-auto absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-cream bg-charcoal/80 font-mono text-xl text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
import { getProjectBySlug } from '../data/projects';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-sans text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="btn">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
  
  const { caseStudy } = project;
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-white border-b-2 border-charcoal py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate hover:text-charcoal mb-8 transition-colors"
            >
              ← Back
            </button>
            
            <div className="flex items-start gap-3 mb-4 flex-wrap">
              <span className="tag">{project.category}</span>
              {project.featured && <span className="tag bg-rust text-cream border-rust">Featured</span>}
            </div>
            
            <h1 className="font-sans text-5xl md:text-6xl font-bold mb-6">
              {project.title}
            </h1>
            
            <p className="font-serif text-xl mb-8 max-w-3xl">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mr-4"
              >
                View Code
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Live Demo
              </a>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Hero Image */}
      {!project.pdf && <section className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="img-frame"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full aspect-video object-cover"
          />
        </motion.div>

      </section>}

      {project.pdf && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-start">
            <div className="overflow-hidden border-2 border-charcoal bg-white">
              <PdfFirstPage
                src={`${import.meta.env.BASE_URL}${project.pdf}`}
                poster={project.pdfPoster}
              />
            </div>
            <aside className="lg:pt-1">
              <div className="section-num mb-3">/ PROJECT PDF</div>
              <h2 className="font-sans text-2xl font-bold mb-4">{project.title}</h2>
              <a
                href={`${import.meta.env.BASE_URL}${project.pdf}`}
                download
                className="btn inline-block w-full text-center"
              >
                Download PDF
              </a>
            </aside>
          </div>
        </section>
      )}
      
      {/* Case Study Content */}
      {caseStudy && (
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-12">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-num">/ PROBLEM</div>
              <h2 className="font-sans text-3xl font-bold mb-4">
                What needed solving
              </h2>
              <p className="font-serif text-lg leading-relaxed">
                {caseStudy.problem}
              </p>
            </motion.div>
            
            {/* Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="section-num">/ APPROACH</div>
              <h2 className="font-sans text-3xl font-bold mb-4">
                How I tackled it
              </h2>
              <p className="font-serif text-lg leading-relaxed">
                {caseStudy.approach}
              </p>
            </motion.div>
            
            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-sage/10 border-2 border-sage p-8"
            >
              <div className="section-num">/ RESULTS</div>
              <h2 className="font-sans text-3xl font-bold mb-4">
                What came out of it
              </h2>
              <p className="font-serif text-lg leading-relaxed">
                {caseStudy.results}
              </p>
            </motion.div>
            
            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="section-num">/ WHAT I'D IMPROVE</div>
              <h2 className="font-sans text-3xl font-bold mb-4">
                Next time
              </h2>
              <p className="font-serif text-lg leading-relaxed">
                {caseStudy.improvements}
              </p>
            </motion.div>
            
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="section-num">/ TECH STACK</div>
              <h2 className="font-sans text-3xl font-bold mb-4">
                Tools used
              </h2>
              <p className="font-serif text-lg leading-relaxed mb-6">
                {caseStudy.techStack}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="tag">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* More Projects */}
      <section className="bg-sand py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-sans text-3xl font-bold mb-6">
            See more work
          </h2>
          <Link to="/projects" className="btn">
            All Projects
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
