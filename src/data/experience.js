// Experience Data
// To add new experience: Copy an object below, update fields, and it will automatically appear on the site.

export const experiences = [
  {
    id: 1,
    company: 'Hewlett Packard Enterprise (HPE)',
    role: 'Data Analyst Intern – Compensation & Equity  (Incoming)',
    period: 'Summer 2026',
    location: 'Spring, TX',
    description: 'Incoming intern supporting compensation analytics and reporting initiatives',
    highlights: [
      'Selected for Summer 2026 Compensation Analyst Internship',
    ],
    skills: ['Excel','SQL', 'Power BI', 'Compensation Analytics', 'Data Analysis'],
    type: 'Internship',
  },

{
  id: 2,
  company: 'USI Insurance Services',
  role: 'Data Analytics Intern – Employee Benefits',
  period: 'June 2025 – July 2025',
  location: 'Houston, TX',
  description: 'Worked on healthcare and underwriting analytics projects',
  highlights: [
    'Analyzed $1M+ in healthcare claims data using Excel',
    'Identified cost-saving trends across 10+ employer client plans',
    'Performed QA checks on 5,000+ row datasets improving reporting accuracy by 95%+',
  ],
  skills: ['Excel', 'Healthcare Analytics', 'Data Analysis', 'Reporting'],
  type: 'Internship',
},

   {
    id: 3,
    company: 'ToolAndMore LLC',
    role: 'Owner & Operator',
    period: 'Nov 2023 – Apr 2024',
    location: 'Houston, TX',
    description: 'Amazon FBA e-commerce business specializing in tools and hardware',
    highlights: [
      'Generated $75K+ revenue in first year',
      'Maintained 30%+ profit margins through pricing analysis',
      'Analyzed sales data to optimize sourcing decisions',
      'Managed inventory, logistics, and product strategy',
    ],
    skills: [, 'Pricing Analytics', 'E-commerce', 'Sales Data'],
    type: 'Entrepreneurship',
  },
  {
    id: 3,
    company: 'Costco Wholesale',
    role: 'Major Sales Associate',
    period: '2024 - Present',
    location: 'Houston, TX',
    description: 'Customer service and sales support in high-volume retail environment',
    highlights: [
      'Beat monthly targets by 15% through consultative approach',
      'Trained 5+ associates on products and sales techniques',
      'Maintained 98% customer satisfaction scores',
    ],
    skills: ['Sales', 'Customer Service', 'Training'],
    type: 'Part-time',
  },
];

export const getExperiencesByType = (type) => {
  if (!type) return experiences;
  return experiences.filter(exp => exp.type === type);
};
