import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard, { StatusBadge } from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { getProjectsByCategory } from '../data/projects';

const year = (project) => project.date?.match(/\d{4}/)?.[0] ?? '—';

// Every project as one spreadsheet table: the quickest way to scan all of it.
const ProjectTable = ({ projects }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
      <thead>
        <tr className="bg-head text-[12.5px] text-muted">
          {['Year', 'Project', 'Built with', 'Result', 'Links'].map((h) => (
            <th key={h} scope="col" className="border border-grid px-3 py-2 font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id} className="align-top hover:bg-accent-wash/30">
            <td className="border border-grid px-3 py-2.5 font-mono text-[13px] text-ink-soft">{year(p)}</td>
            <td className="border border-grid px-3 py-2.5">
              <Link to={`/projects/${p.slug}`} className="font-semibold text-ink hover:text-accent-ink underline decoration-accent/40 underline-offset-4">{p.title}</Link>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
                <span>{p.category}</span>
                <StatusBadge status={p.status} />
              </div>
            </td>
            <td className="border border-grid px-3 py-2.5 text-[13px] text-ink-soft">{p.tools.join(', ')}</td>
            <td className="border border-grid px-3 py-2.5 text-ink">{p.highlight}</td>
            <td className="border border-grid px-3 py-2.5 whitespace-nowrap">
              <div className="flex flex-col gap-1">
                <Link to={`/projects/${p.slug}`} className="link text-[13px]">Case study</Link>
                {p.links.github && <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="link text-[13px]">Code</a>}
                {p.links.demo && <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="link text-[13px]">Live demo</a>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const readView = () => {
  try {
    return localStorage.getItem('projects-view') === 'table' ? 'table' : 'cards';
  } catch {
    return 'cards';
  }
};

const Projects = () => {
  const [view, setView] = useState(readView);
  const chooseView = (next) => {
    setView(next);
    try {
      localStorage.setItem('projects-view', next);
    } catch {
      // Storage can be blocked; the choice still applies for this visit.
    }
  };
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
          // By year, undated last; ties keep the newest-added first.
          return (year(b) === '—' ? 0 : Number(year(b))) - (year(a) === '—' ? 0 : Number(year(a))) || b.id - a.id;
      }
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const formula = `=FILTER(projects, category="${selectedCategory}"${searchQuery ? `, SEARCH("${searchQuery}")` : ''})`;
  useSheet('A1', '=FILTER(projects, category="All")', 'Projects');

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
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[13px] text-muted" aria-live="polite">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
            <div className="inline-flex rounded border border-grid overflow-hidden" role="group" aria-label="Layout">
              {['cards', 'table'].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => chooseView(v)}
                  className={`h-8 px-3 text-[13px] font-medium capitalize transition-colors ${view === v ? 'bg-accent text-white' : 'bg-paper text-ink-soft hover:text-ink'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </Cell>
      </Row>
      <Row>
        {filteredProjects.length > 0 && view === 'table' ? (
          <Cell id="A3" formula='=TABLE(projects)' pad={false}>
            <ProjectTable projects={filteredProjects} />
          </Cell>
        ) : filteredProjects.length > 0 ? (
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
