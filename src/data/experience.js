// Experience Data
// To add new experience: Copy an object below, update fields, and it will automatically appear on the site.
// start/end are 'YYYY-MM' and drive the timeline chart; end: null means current.

export const experiences = [
  {
    id: 1,
    company: 'Hewlett Packard Enterprise (HPE)',
    shortName: 'HPE',
    logo: 'logos/hpe.png',
    item: 'server',
    summary: 'Built the automated Power BI pipeline behind compensation reporting, plus a Python forecasting pipeline.',
    role: 'Data Analyst Intern – Compensation & Equity',
    period: 'May 2026 – Present',
    start: '2026-05',
    end: null,
    location: 'Spring, TX',
    description: 'Building analytics pipelines and reporting tools for compensation and equity operations',
    highlights: [
      'Built and own an automated BI pipeline (Power Query, SharePoint, Power BI, DAX) that replaced manual compensation reporting.',
      'Turned scattered Workday exports into one source of truth for pay guidelines, salary ranges and equity budgets.',
      'Kept it reliable with normalized data, key-based joins, duplicate detection, standardized KPI logic and GitHub version control.',
      'Engineered a modular Python forecasting pipeline (Pandas, scikit-learn, XGBoost, Power BI/XMLA) that automates time-series backtesting of 8 statistical and ML models across 14 fiscal quarters, and identified a $164M gap in projected channel sales.',
    ],
    skills: ['Power Query', 'SharePoint', 'Power BI', 'DAX', 'Workday', 'Git & GitHub', 'Python', 'scikit-learn', 'XGBoost'],
    type: 'Internship',
  },

  {
    id: 5,
    company: 'Bloomberg',
    shortName: 'Bloomberg Decoded: Data',
    logo: 'logos/bloomberg.png',
    item: 'terminal',
    summary: '1 of 35 picked from 500+ applicants; debugged anomalies in a 50,000+ record trading dataset.',
    role: 'Decoded: Data',
    period: 'August 2026',
    start: '2026-08',
    end: '2026-08',
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
    shortName: 'USI Insurance',
    logo: 'logos/usi.png',
    item: 'umbrella',
    summary: 'Analyzed $1M+ in healthcare claims to support renewals for 10+ employer clients.',
    role: 'Data Analytics Intern – Employee Benefits',
    period: 'June 2025 – July 2025',
    start: '2025-06',
    end: '2025-07',
    location: 'Houston, TX',
    description: 'Worked on healthcare and underwriting analytics projects',
    highlights: [
      'Analyzed $1M+ in healthcare claims data using Excel, performing cost trend, utilization, and benchmarking analysis to identify patterns and support renewal strategies for 10+ employer clients.',
      'Standardized and validated 5,000+ row healthcare datasets through data cleaning, field normalization, reconciliation, and QA checks, improving consistency for downstream analysis and annual client renewals.',
    ],
    skills: ['Excel', 'Healthcare Analytics', 'Data Cleaning', 'Data Validation'],
    type: 'Internship',
  },

  {
    id: 6,
    company: 'Carnegie Mellon University - Tepper School of Business',
    shortName: 'CMU Tepper Summit',
    logo: 'logos/cmu.png',
    item: 'gradcap',
    summary: 'Built churn models and proposed the BNY AI efficiency model.',
    role: 'Business Analytics Summer Summit',
    period: 'May 2025',
    start: '2025-05',
    end: '2025-05',
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
    shortName: 'Costco',
    logo: 'logos/costco.png',
    item: 'cart',
    summary: 'Beat monthly sales targets by 15% and trained 5+ associates.',
    role: 'Major Sales Associate',
    period: 'November 2024 – May 2026',
    start: '2024-11',
    end: '2026-05',
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
    shortName: 'ToolAndMore',
    logo: null,
    item: 'drill',
    summary: 'Ran an Amazon store to $75K+ first-year revenue at 30%+ margins.',
    role: 'Owner & Operator',
    period: 'November 2023 – April 2024',
    start: '2023-11',
    end: '2024-04',
    location: 'Houston, TX',
    description: 'Amazon FBA e-commerce business specializing in tools and hardware',
    highlights: [
      'Generated $75K+ revenue in the first year by launching and scaling an Amazon e-commerce business focused on power tools, hardware, and niche high-margin products.',
      'Maintained 30%+ profit margins by conducting ROI, profitability, sourcing, and pricing analysis to evaluate product economics, guide purchasing decisions, and optimize inventory restocking.',
    ],
    skills: ['Pricing Analytics', 'E-commerce', 'Sales Data'],
    type: 'Entrepreneurship',
  },
];

export const getExperiencesByType = (type) => {
  if (!type) return experiences;
  return experiences.filter(exp => exp.type === type);
};
