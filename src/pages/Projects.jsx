import { useState, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { getProjectsByCategory } from '../data/projects';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProjects = useMemo(() => {
    let result = getProjectsByCategory(selectedCategory);
    const q = searchQuery.toLowerCase();

    if (q) {
      result = result.filter(project =>
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some(tag => tag.toLowerCase().includes(q)) ||
        project.tools.some(tool => tool.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
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
  }, [selectedCategory, searchQuery, sortBy]);

  const formula = `=FILTER(projects, category="${selectedCategory}"${searchQuery ? `, SEARCH("${searchQuery}")` : ''})`;
  useSheet('A1', '=FILTER(projects, category="All")');

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula={formula}>
          <h1 className="sheet-title">Projects</h1>
          <p className="body-copy mt-2 max-w-2xl">
            Data engineering, machine learning, full-stack and BI work. Search by name or tool, or filter by category.
          </p>
        </Cell>
      </Row>
      <Row>
        <Cell id="A2" formula={formula} className="!py-4">
          <ProjectFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <p className="mt-3 text-[13px] text-muted" aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </Cell>
      </Row>
      <Row>
        {filteredProjects.length > 0 ? (
          <>
            {filteredProjects.map((project, i) => (
              <Cell
                key={project.id}
                id={`${'AEI'[i % 3]}${3 + Math.floor(i / 3)}`}
                span="col-span-12 md:col-span-6 lg:col-span-4"
                formula={`=PROJECT("${project.shortTitle}")`}
              >
                <ProjectCard project={project} />
              </Cell>
            ))}
            {filteredProjects.length % 3 !== 0 && (
              <Cell
                id="Z3"
                span={`hidden lg:block ${filteredProjects.length % 3 === 1 ? 'lg:col-span-8' : 'lg:col-span-4'}`}
                formula=""
              />
            )}
          </>
        ) : (
          <Cell id="A3" formula='=IFERROR(FILTER(...), "No matches")' className="text-center !py-16">
            <p className="font-sans text-xl font-bold text-ink">No projects match</p>
            <p className="mt-2 text-ink-soft">Try a different search or pick another category.</p>
          </Cell>
        )}
      </Row>
    </Sheet>
  );
};

export default Projects;
