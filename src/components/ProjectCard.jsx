import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/projects/${project.slug}`}>
        <div className="card group cursor-pointer">
          {/* Image */}
          <div className="img-frame aspect-video mb-6">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
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
