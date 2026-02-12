// Projects Data
// To add a new project: Copy an object below, update all fields, and it will automatically appear on the site.

export const projects = [
  {
    id: 1,
    slug: 'mnist-digit-recognition',
    title: 'Handwriting Recognition Web Demo (MNIST)',
    description: 'In progress — interactive web demo that predicts digits you draw on a canvas',
    category: 'Web',
    tags: ['Machine Learning', 'Web App'],
    tools: ['Python', 'PyTorch', 'Flask', 'React'],
    featured: true,
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
    links: {
      github: null, // add your real repo link when ready
      demo: null,   // add your real deployed link when ready
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'Build a simple, interactive ML demo that shows how a model can turn messy input into a usable prediction.',
      approach:
        'Training a neural network in PyTorch on the MNIST dataset. Building a Flask API for inference and a React UI with a canvas so users can draw digits and get predictions in real time.',
      results:
        'Work in progress — model training and web demo integration in progress.',
      improvements:
        'Add confidence scores, improve preprocessing for messy handwriting, and expand to letters/symbols.',
      techStack: 'PyTorch, Flask, React, Python',
    },
  },

  {
    id: 2,
    slug: 'ai-efficiency-modeling',
    title: 'AI Efficiency Modeling (BNY Mellon Project)',
    description: 'Analysis and recommendations to reduce GPU runtime and improve AI system efficiency',
    category: 'Research',
    tags: ['Analytics', 'AI Infrastructure'],
    tools: ['Python', 'Pandas', 'Matplotlib'],
    featured: true,
    image: 'https://i.imgur.com/k8t3aow.png',
    links: {
      github: null,
      demo: null,
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'AI workloads can be expensive to run. The goal was to find practical ways to reduce compute usage and improve efficiency.',
      approach:
        'Reviewed AI infrastructure patterns and built a lightweight Python logging/middleware approach to track compute activity and spot inefficiencies. Summarized recommendations and expected impact.',
      results:
        'Produced a set of optimization recommendations with estimated reductions in energy/compute usage and measurable efficiency gains.',
      improvements:
        'Would validate the estimates with additional runtime benchmarks and expand logging coverage across more workloads.',
      techStack: 'Python (pandas, matplotlib), Jupyter Notebooks',
    },
  },

  {
    id: 3,
    slug: 'sales-analytics-dashboard',
    title: 'E-Commerce Sales Analytics (ToolAndMore)',
    description: 'Dashboards and analysis used to track sales, inventory, and profitability',
    category: 'Dashboard',
    tags: ['Business Intelligence', 'Analytics'],
    tools: ['Power BI', 'Excel', 'Python'],
    featured: true,
    image: 'https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg',
    links: {
      github: null,
      demo: null,
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'Running an Amazon business requires fast visibility into what is selling, what is stuck, and where profit is coming from.',
      approach:
        'Tracked sales and ROI trends over time and built dashboards to monitor performance. Used analysis to guide pricing and sourcing decisions.',
      results:
        'Improved decision-making around pricing and sourcing and supported higher margins through data-driven adjustments.',
      improvements:
        'Add competitor price tracking and forecasting to better plan inventory buys.',
      techStack: 'Power BI, Excel, Python',
    },
  },

  {
    id: 4,
    slug: 'fed-oil-price-analysis',
    title: 'Fed & Oil Price Analysis (BP Project)',
    description: 'Explored how changes in interest rates relate to oil price movements over time',
    category: 'Research',
    tags: ['Economics', 'Time Series'],
    tools: ['Python', 'Excel'],
    featured: true,
    image: 'https://download.logo.wine/logo/BP/BP-Logo.wine.png',
    links: {
      github: null,
      demo: null,
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'Understand whether Fed policy changes can help explain patterns in oil prices.',
      approach:
        'Collected historical rate and price data and ran basic time-series exploration and lag comparisons to look for relationships.',
      results:
        'Documented patterns and potential lag effects that can be explored more deeply with stronger models.',
      improvements:
        'Add clearer model validation and broaden to include other energy products.',
      techStack: 'Python (pandas), Excel',
    },
  },
];

export const categories = ['All', 'Research', 'Web', 'Dashboard', 'Data'];

export const getProjectBySlug = (slug) => {
  return projects.find((p) => p.slug === slug);
};

export const getFeaturedProjects = () => {
  return projects.filter((p) => p.featured);
};

export const getProjectsByCategory = (category) => {
  if (category === 'All') return projects;
  return projects.filter((p) => p.category === category);
};
