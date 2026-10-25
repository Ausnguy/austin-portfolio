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
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      {/* Search */}
      <input
        type="search"
        name="search"
        aria-label="Search projects"
        autoComplete="off"
        placeholder="Search projects or tools…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-10 w-full lg:w-72 rounded border border-grid bg-paper px-3 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />

      {/* Categories */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto [scrollbar-width:none] lg:flex-1" role="group" aria-label="Filter by category">
        {categories.map((category) => {
          const selected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 h-9 px-3 rounded text-sm font-medium border transition-[transform,background-color,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                selected
                  ? 'bg-accent text-white border-accent'
                  : 'bg-paper text-ink-soft border-grid hover:border-muted hover:text-ink'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <select
        aria-label="Sort projects"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-10 rounded border border-grid bg-paper px-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        <option value="newest">Sort: newest first</option>
        <option value="featured">Sort: featured first</option>
        <option value="title">Sort: title A–Z</option>
      </select>
    </div>
  );
};

export default ProjectFilters;
