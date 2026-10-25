import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EASE_OUT } from '../lib/motion';

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const ProjectCard = ({ project, index = 0 }) => {
  const videoRef = useRef(null);
  const baseUrl = import.meta.env.BASE_URL;

  // Video projects preview their loop on hover instead of a still.
  const playPreview = () => {
    if (videoRef.current && canHover()) videoRef.current.play().catch(() => {});
  };
  const stopPreview = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(16px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE_OUT }}
    >
      <Link
        to={`/projects/${project.slug}`}
        onMouseEnter={playPreview}
        onMouseLeave={stopPreview}
        className="block"
      >
        <div className="card group cursor-pointer">
          {/* Media */}
          <div className="img-frame aspect-video mb-6">
            {project.videoLoop ? (
              <video
                ref={videoRef}
                src={`${baseUrl}${project.videoLoop}`}
                poster={`${baseUrl}${project.videoLoopPoster}`}
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${project.title} preview`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={project.image}
                alt={project.title}
                width="1280"
                height="720"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="tag">{project.category}</span>
            {project.featured && <span className="tag bg-rust text-cream border-rust">Featured</span>}
          </div>

          {/* Title */}
          <h3 className="font-sans text-2xl font-bold mb-3 group-hover:text-rust transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-serif mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tools */}
          <div className="font-mono text-xs text-slate">
            {project.tools.join(' · ')}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
