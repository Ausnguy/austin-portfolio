// Projects Data
// To add a new project: Copy an object below, update all fields, and it will automatically appear on the site.

export const projects = [
  {
    id: 5,
    slug: 'casequest-2026',
    title: 'Parvius: Parts Readiness System (CaseQuest 2026)',
    description:
      'A failure-prediction model, a 3D operations console and a field engineer phone app that share one live state, built for a ConocoPhillips-sponsored case competition.',
    category: 'Full-Stack',
    tags: ['Machine Learning', 'Full-Stack', 'Mobile', 'Case Competition'],
    tools: ['Python', 'NumPy', 'TypeScript', 'Redis', 'Vercel', 'Expo', 'React Native', 'WebGPU'],
    featured: true,
    spotlight: true,
    image: '/austin-portfolio/casequest/poster.jpg',
    video: 'casequest/parvius-launch.mp4',
    videoLoop: 'casequest/parvius-loop.mp4',
    videoLoopPoster: 'casequest/loop-poster.jpg',
    videoPoster: 'casequest/poster.jpg',
    videoCaption: '45-second walkthrough: a failure alert, the 3D console, stock-gated dispatch and the engineer’s phone.',
    event: 'CaseQuest 2026 · University of Houston · Oct 23–24, 2026',
    team: ['Austin Nguyen', 'Aayan Khan', 'Nick Shahbazian', 'Sidra Shaikh', 'Wali Lambert'],
    links: {
      github: 'https://github.com/Ausnguy/CaseQuest-2026',
      demo: 'https://casequest-2026.vercel.app',
      caseStudy: true,
    },
    metrics: [
      { value: 6599, suffix: ' h', label: 'of unplanned downtime analyzed across 6 sites and 18 machines' },
      { value: 24, suffix: '%', label: 'of that downtime was machines waiting for a spare part' },
      { value: 0.82, decimals: 2, label: 'AUC on a half-year of data the model never trained on' },
      { value: 90, suffix: ' / 91', label: 'mechanical failures got at least one warning first' },
      { value: 968, suffix: ' h/yr', label: 'of downtime the program is modeled to win back' },
    ],
    caseStudy: {
      problem:
        'Lone Mesa Energy, the case company, runs six oil sites with eighteen pumps and compressors. In 2025 they lost about 6,599 hours to unplanned stops, roughly $5.6M in modeled lost contribution. The case asked us, acting as consultants, to pick the one operational problem that matters most and recommend one practical fix, backed by the provided data and a working prototype.',
      approach:
        'We cleaned the competition workbook with logged rules and 39 automated integrity checks, then dug into where the hours went. A quarter of all downtime was machines sitting broken while someone waited for a part, so we recommended a critical spare-parts program, rolled out only at sites whose overdue safety actions are closed. To show how it would run day to day we built three connected pieces: a failure model that reads daily vibration, temperature and inspection notes and flags machines likely to have a bearing or seal failure within 3 days; Parvius, a manager console with a 3D map of the sites, a parts warehouse and dispatch; and a phone app the field engineer uses to take the job, travel to the site and report which kits were fitted. The console and phone share one live state through a small API.',
      results:
        'On the half of 2025 it never saw, the model scored an AUC of 0.82. 68% of alerted days were followed by a mechanical failure within 3 days, against a 9% base rate, and 90 of 91 mechanical failures got at least one warning, a median 1.5 days ahead. The spare-parts program is modeled at about 968 hours a year of downtime avoided at steady state (range 565–1,210) for $168k upfront and $18k a year. The full system is live: alerts, warehouse stock, dispatch that refuses to send an engineer without every kit, and an engineer phone app updating the same state in real time.',
      improvements:
        'The data is a scenario with one reading per machine per day, so the next step is checking the model against real sensor data such as the Petrobras 3W offshore well dataset. After that comes the costed Phase 2: condition monitoring at the worst-hit site.',
      lessons: [
        {
          title: 'Let the data pick the problem',
          body: 'We looked at every option before choosing. At each site, how often breakdowns waited on parts tracked how empty the spare shelf was almost perfectly (r ≈ −0.995). That gave our one recommendation a clear reason backed by the data.',
        },
        {
          title: 'Only use what you would have known that day',
          body: 'Sensor readings sometimes arrive late. We only let the model see readings already received by the end of each day, trained on January–June and tested on July–December, so the score reflects what a planner could really have acted on.',
        },
        {
          title: 'A simple model you can explain is powerful',
          body: 'Five plain features and a logistic regression we wrote ourselves in about 20 lines of NumPy, with no ML library, warned before 90 of 91 failures, and we can explain exactly why any alert fired.',
        },
        {
          title: 'Say clearly what it cannot do',
          body: 'Electrical trips look like normal days in the readings, so no model on this data could predict them, and we said so. Every number in the console is marked as recorded or modeled.',
        },
        {
          title: 'Put the safety rules in the software',
          body: 'The system never starts or stops a machine, never sends anyone on its own, never dispatches without the parts and has no override for a safety hold. The rules live in code, not in a slide.',
        },
        {
          title: 'Two screens, one truth',
          body: 'The manager console and the engineer phone both write to the same state. A compare-and-swap check in Redis stops one device from silently overwriting the other.',
        },
      ],
      techStack: {
        'Data & machine learning': [
          'Python 3.12, pandas, NumPy',
          'Logistic regression written from scratch (Newton’s method, ridge penalty)',
          'Data cleaning pipeline with 39 integrity checks, openpyxl',
          'pytest, uv',
        ],
        'Operations console': [
          'Single-file HTML/JavaScript app',
          '3D site map and charts drawn by hand on HTML Canvas, no 3D library',
          'Voice input: Whisper (whisper-tiny.en) running in the browser via Hugging Face transformers.js',
          'Voice output: Kokoro-82M text-to-speech on WebGPU via kokoro-js',
          'Briefing assistant built on a rules engine, no LLM or API key',
        ],
        'Dispatch API': [
          'TypeScript serverless functions on Vercel',
          'Upstash Redis with a Lua compare-and-swap for safe concurrent writes',
          'Zod request validation, Vitest tests',
        ],
        'Engineer phone app': [
          'Expo SDK 57, React Native 0.86, React 19',
          'Expo Router, Zustand, Reanimated 4',
          'expo-sensors (shake the phone to travel), expo-haptics, react-native-svg',
        ],
      },
    },
  },

  {
    id: 1,
    slug: 'mnist-digit-recognition',
    title: 'Handwriting Recognition Web Demo (MNIST)',
    description: 'In progress — interactive web demo that predicts digits you draw on a canvas',
    category: 'Web',
    tags: ['Machine Learning', 'Web App'],
    tools: ['Python', 'PyTorch', 'Flask', 'React'],
    featured: true,
    image: '/austin-portfolio/Mnist.png',
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
    image: '/austin-portfolio/bny-first-slide.png',
    pdf: 'bny-ai-optimization.pdf',
    pdfPoster: 'bny-first-slide.png',
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
    pdf: 'bp-energy-policy.pdf',
    pdfPoster: 'bp-first-slide.png',
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
        'Add clearer model validation and broaden to include other energy products. ',
      techStack: 'Python (pandas), Excel',
    },
  },
];

export const categories = ['All', 'Full-Stack', 'Research', 'Web', 'Dashboard', 'Data'];

export const getProjectBySlug = (slug) => {
  return projects.find((p) => p.slug === slug);
};

export const getFeaturedProjects = () => {
  return projects.filter((p) => p.featured);
};

export const getSpotlightProject = () => {
  return projects.find((p) => p.spotlight);
};

export const getProjectsByCategory = (category) => {
  if (category === 'All') return projects;
  return projects.filter((p) => p.category === category);
};
