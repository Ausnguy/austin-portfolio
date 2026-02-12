import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <section className="max-w-7xl mx-auto px-6 py-8">
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
      </section>
      
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
