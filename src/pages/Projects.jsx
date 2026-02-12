import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { projects, getProjectsByCategory } from '../data/projects';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const filteredProjects = useMemo(() => {
    let result = getProjectsByCategory(selectedCategory);
    
    if (searchQuery) {
      result = result.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return b.featured - a.featured;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return b.id - a.id;
      }
    });
    
    return result;
  }, [selectedCategory, searchQuery, sortBy]);
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b-2 border-charcoal py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-num">/ ALL WORK</div>
            <h1 className="font-sans text-5xl md:text-6xl font-bold mb-4">
              Projects
            </h1>
            <p className="font-serif text-xl max-w-3xl">
              A collection of data analytics, machine learning, and business intelligence projects. 
              Each one taught me something about making data useful.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Filters and Projects */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <ProjectFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        <div className="mt-8 mb-4">
          <p className="font-mono text-xs text-slate">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="font-sans text-2xl font-bold mb-2">No projects found</div>
            <p className="font-serif text-slate">Try adjusting your filters</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Projects;
