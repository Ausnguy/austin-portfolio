// Experience Data
// To add new experience: Copy an object below, update fields, and it will automatically appear on the site.

export const experiences = [
  {
    id: 1,
    company: 'Hewlett Packard Enterprise (HPE)',
    role: 'Data Analyst Intern – Compensation & Equity',
    period: 'May 2026 – Present',
    location: 'Spring, TX',
    description: 'Building analytics pipelines and reporting tools for compensation and equity operations',
    highlights: [
      'Built an automated BI pipeline that combined 5+ Workday HR and compensation datasets using Power Query, SharePoint, Power BI, and DAX, cutting 10–12 hours of manual work from each reporting cycle',
      'Created Power BI dashboards and reusable DAX measures for pay guidelines, salary ranges, equity budgets, employee data, and compensation calculations',
      'Made the reports easier to trust and maintain by defining KPI logic, standardizing Workday exports, validating records, and documenting the transformation and refresh process',
    ],
    skills: ['Power Query', 'SharePoint', 'Power BI', 'DAX', 'Compensation Analytics'],
    type: 'Internship',
  },

  {
    id: 5,
    company: 'Bloomberg',
    role: 'Decoded: Data',
    period: 'August 2026',
    location: 'Princeton, NJ',
    description: 'Selected for Bloomberg\'s competitive Decoded: Data program',
    highlights: [
      'Selected as 1 of 35 participants from 500+ applicants for Bloomberg\'s competitive Decoded: Data program',
      'Analyzed a 50,000+ record trading dataset using Python, Pandas, NumPy, and Matplotlib to investigate anomalies, trace data issues, and debug inconsistencies affecting downstream analysis',
      'Applied data quality, validation, and troubleshooting practices while working with Bloomberg Data professionals on real-world data management concepts',
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Quality'],
    type: 'Program',
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
    id: 6,
    company: 'Carnegie Mellon University - Tepper School of Business',
    role: 'Business Analytics Summer Summit',
    period: 'May 2025',
    location: 'Pittsburgh, PA',
    description: 'Applied analytics and machine learning to business and public-sector datasets',
    highlights: [
      'Proposed an AI infrastructure model for BNY Mellon projected to cut compute-related energy costs by 69%',
      'Built decision tree and random forest models in Python to predict customer churn',
      'Built Tableau dashboards to visualize U.S. criminal justice data trends',
    ],
    skills: ['Python', 'Machine Learning', 'Tableau', 'Data Visualization'],
    type: 'Program',
  },

  {
    id: 4,
    company: 'Costco Wholesale',
    role: 'Major Sales Associate',
    period: 'November 2024 – May 2026',
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
  {
    id: 3,
    company: 'ToolAndMore LLC',
    role: 'Owner & Operator',
    period: 'November 2023 – April 2024',
    location: 'Houston, TX',
    description: 'Amazon FBA e-commerce business specializing in tools and hardware',
    highlights: [
      'Generated $75K+ revenue in first year',
      'Maintained 30%+ profit margins through pricing analysis',
      'Analyzed sales data to optimize sourcing decisions',
      'Managed inventory, logistics, and product strategy',
    ],
    skills: ['Pricing Analytics', 'E-commerce', 'Sales Data'],
    type: 'Entrepreneurship',
  },
];

export const getExperiencesByType = (type) => {
  if (!type) return experiences;
  return experiences.filter(exp => exp.type === type);
};
