import { motion } from 'framer-motion';

const ExperienceCard = ({ experience, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="timeline-item pb-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-sans text-2xl font-semibold mb-1">
            {experience.company}
          </h3>
          <div className="font-mono text-sm text-slate">
            {experience.role}
          </div>
        </div>
        <div className="font-mono text-xs">
          {experience.period}
        </div>
      </div>
      
      {/* Highlights */}
      <ul className="space-y-2 mb-4">
        {experience.highlights.map((highlight, idx) => (
          <li key={idx} className="font-serif">
            {highlight}
          </li>
        ))}
      </ul>
      
      {/* Skills */}
      <div className="flex gap-2 flex-wrap">
        {experience.skills.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
