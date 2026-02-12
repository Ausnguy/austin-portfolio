import { motion } from 'framer-motion';
import { categories } from '../data/projects';

const ProjectFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input w-full"
        />
      </div>
      
      {/* Category Filters + Sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Categories */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`tag cursor-pointer transition-all ${
                selectedCategory === category
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'hover:bg-sand'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border-2 border-charcoal bg-white font-mono text-xs uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-rust"
        >
          <option value="newest">Newest First</option>
          <option value="featured">Featured First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters;
