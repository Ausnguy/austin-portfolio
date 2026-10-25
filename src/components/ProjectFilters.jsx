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
          type="search"
          name="search"
          aria-label="Search projects"
          autoComplete="off"
          placeholder="Search projects…"
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
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
              className={`tag cursor-pointer transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] ${
                selectedCategory === category
                  ? 'bg-charcoal text-cream border-charcoal'
                  : 'hover:bg-sand'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Sort Dropdown */}
        <select
          aria-label="Sort projects"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border-2 border-charcoal bg-white text-charcoal font-mono text-xs uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-rust"
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
