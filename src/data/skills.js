// Skills Data
// To add a skill: add it to a group below. "Used in" on the site is worked out automatically
// by matching the skill name against experience `skills` and project `tools`.

import { experiences } from './experience';
import { projects } from './projects';

export const skillGroups = [
  { group: 'Languages', skills: ['SQL', 'Python', 'R', 'Java'] },
  { group: 'Python libraries', skills: ['Pandas', 'NumPy', 'Matplotlib', 'PyTorch', 'scikit-learn'] },
  { group: 'BI & analytics', skills: ['Power BI', 'DAX', 'Tableau', 'Excel', 'KPI reporting'] },
  { group: 'Data processing & ETL', skills: ['Power Query', 'SharePoint', 'Data Cleaning', 'Data Validation', 'Data Transformation'] },
  { group: 'Web', skills: ['HTML/CSS', 'JavaScript', 'React', 'Flask'] },
  { group: 'Tools & practices', skills: ['Git & GitHub', 'Jupyter', 'VS Code', 'Azure', 'Agile', 'SLURM/HPC'] },
];

const same = (a, b) => a.toLowerCase() === b.toLowerCase();

// Where a group's skills show up in experience and projects, newest first, without duplicates.
export const getGroupEvidence = (skills) => {
  const used = [];
  experiences.forEach((exp) => {
    if (exp.skills.some((s) => skills.some((k) => same(s, k)))) used.push(exp.shortName);
  });
  projects.forEach((project) => {
    if (project.tools.some((t) => skills.some((k) => same(t, k)))) used.push(project.shortTitle);
  });
  return [...new Set(used)];
};
