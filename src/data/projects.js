// Projects Data
// To add a new project: Copy an object below, update all fields, and it will automatically appear on the site.

export const projects = [
  {
    id: 6,
    slug: 'interdomain',
    role: 'Solo project',
    tldr: [
      'Routing changes can take parts of the internet offline, and the raw BGP feed is a firehose that is hard to watch live.',
      'A Python, Kafka, Spark, PostgreSQL, FastAPI and React pipeline for live internet routing data.',
      'Version 1 runs end to end with a live dashboard; the Kafka and Spark streaming layer is in progress.',
    ],
    decisions: [
      {
        title: 'Ship a working V1 before the big data stack',
        why: 'V1 is RIPE RIS Live to Python to PostgreSQL to FastAPI. Kafka, Spark/Databricks, Delta Lake, dbt and Airflow are added only after that works end to end.',
      },
    ],
    title: 'Interdomain: Real-Time BGP Routing Observability',
    shortTitle: 'Interdomain',
    status: 'wip',
    date: 'Oct 2026 – present',
    highlight: 'Streams live internet routing updates through Kafka and Spark into PostgreSQL',
    description:
      'A real-time platform that watches the internet’s routing table change, stores every route announcement and withdrawal, and flags anomalies like withdrawal spikes.',
    category: 'Data Engineering',
    tags: ['Streaming', 'Data Engineering', 'Networking', 'Work in progress'],
    tools: ['Python', 'Kafka', 'Spark', 'PostgreSQL', 'FastAPI', 'Docker', 'React'],
    featured: true,
    image: '/austin-portfolio/thumbs/interdomain.png',
    pipeline: [
      { name: 'RIPE RIS Live', detail: 'Public stream of BGP updates from route collectors worldwide' },
      { name: 'Python ingestion', detail: 'WebSocket client normalizes each update into route events' },
      { name: 'Kafka', detail: 'bgp-updates topic, keyed by peer ASN' },
      { name: 'Spark + PostgreSQL', detail: 'Sliding-window instability checks; events stored with CIDR/INET types' },
      { name: 'FastAPI', detail: 'Health, metrics, recent routes, withdrawals, active ASNs' },
      { name: 'React dashboard', detail: 'Updates per minute, top ASNs, withdrawals, live/stale/offline' },
    ],
    links: {
      github: 'https://github.com/Ausnguy/Interdomain',
      demo: null,
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'BGP is how the networks that make up the internet tell each other which addresses they can reach. When routes get withdrawn or start flapping, parts of the internet can go dark, but the raw update feed is a firehose that is hard to watch in real time.',
      approach:
        'A Python WebSocket client subscribes to RIPE RIS Live, the public stream of BGP updates from route collectors around the world, and normalizes each message into route-level events: announcement or withdrawal, prefix, peer ASN, AS path and next hop. Events flow through a Kafka topic keyed by peer ASN. A consumer writes them to PostgreSQL using native CIDR and INET types with indexes on time, event type and ASN, while a Spark Structured Streaming job reads the same topic, explodes each update into individual route events and watches 5-minute sliding windows with a 2-minute watermark for route instability. A FastAPI service serves ingestion health, summary metrics, activity, recent routes, withdrawals and the most active ASNs to a React dashboard.',
      results:
        'Version 1 runs end to end: live ingestion from RIPE RIS, storage in PostgreSQL, the analytics API and a dashboard showing updates per minute, the most active peer ASNs, recent withdrawals and whether ingestion is live, stale or offline. A tested rule flags withdrawal spikes when at least 40% of 20 or more events are withdrawals. The Kafka and Spark streaming layer is in place and still being built out.',
      improvements:
        'Next is Databricks and Delta Lake, dbt and Airflow on top of the stream, plus more reliability checks from the roadmap: abnormal update volume, rapidly changing AS paths, duplicate and malformed records, stale ingestion, source disconnects and consumer lag.',
      techStack: {
        Ingestion: [
          'Python WebSocket client for RIPE RIS Live',
          'Apache Kafka (KRaft mode) via confluent-kafka, keyed by peer ASN',
        ],
        'Stream processing': [
          'Spark Structured Streaming (PySpark, Spark 4.2) with sliding windows and watermarks',
          'Python anomaly rules with pytest tests',
        ],
        'Storage & API': [
          'PostgreSQL 17 with CIDR/INET types and indexes, psycopg 3',
          'FastAPI and Uvicorn, with an ingestion health endpoint',
        ],
        'Dashboard & ops': [
          'React 19, Recharts and Vite',
          'Docker Compose for Postgres, Kafka and Spark',
        ],
      },
    },
  },

  {
    id: 5,
    slug: 'casequest-2026',
    role: 'Team of 5',
    tldr: [
      'Lone Mesa Energy lost about 6,599 hours to unplanned stops in 2025, and 24% of it was machines waiting for spare parts.',
      'A failure-prediction model, a 3D operations console and an engineer phone app that share one live state.',
      'The model warned before 90 of 91 mechanical failures on unseen data; the parts program is modeled at about 968 hours a year saved.',
    ],
    decisions: [
      {
        title: 'Predict 3 days out from a 2-day window',
        why: 'The data set the window: 91% of mechanical failures show vibration above 1.3× normal two days out, and only 1% three days out.',
      },
      {
        title: 'One alert level, not two',
        why: 'A lower “watch” band was tried and dropped, because its days failed less often than average.',
      },
      {
        title: 'Score only on readings already received',
        why: 'Late-arriving readings are excluded, so every score is what a planner could really have seen that day. A test checks this.',
      },
    ],
    title: 'Parvius: Parts Readiness System (CaseQuest 2026)',
    shortTitle: 'Parvius (CaseQuest)',
    date: 'Oct 2026',
    highlight: 'Model warned before 90 of 91 equipment failures on unseen data',
    description:
      'A failure-prediction model, a 3D operations console and a field engineer phone app that share one live state, built for a ConocoPhillips-sponsored case competition.',
    category: 'Full-Stack',
    tags: ['Machine Learning', 'Full-Stack', 'Mobile', 'Case Competition'],
    tools: ['Python', 'NumPy', 'TypeScript', 'Redis', 'Vercel', 'Expo', 'React Native', 'WebGPU'],
    featured: true,
    spotlight: true,
    image: '/austin-portfolio/casequest/poster.jpg',
    pipeline: [
      { name: 'Case workbook', detail: 'Readings, stop events and assets for 6 sites and 18 machines' },
      { name: 'Python cleaning', detail: 'Logged rules and 39 integrity checks' },
      { name: 'Failure model', detail: 'Logistic regression flags bearing or seal failures 3 days out' },
      { name: 'Dispatch API', detail: 'TypeScript on Vercel, state in Redis with compare-and-swap' },
      { name: 'Console + phone app', detail: '3D ops console for the manager, Expo app for the engineer' },
    ],
    video: 'casequest/parvius-launch.mp4',
    videoLoop: 'casequest/parvius-loop.mp4',
    videoLoopPoster: 'casequest/loop-poster.jpg',
    videoPoster: 'casequest/poster.jpg',
    videoCaption: '45-second walkthrough: a failure alert, the 3D console, stock-gated dispatch and the engineer’s phone.',
    event: 'CaseQuest 2026, University of Houston, Oct 23–24, 2026',
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
    role: 'Solo project',
    tldr: [
      'Show how a model can turn messy handwritten input into a usable prediction.',
      'A PyTorch neural network with a reproducible preprocessing and inference pipeline for 28×28 images.',
      'About 96–98% accuracy on the 10,000-image test set; the draw-a-digit web demo is in progress.',
    ],
    title: 'Handwriting Recognition (MNIST)',
    shortTitle: 'MNIST classifier',
    date: 'Jan 2026 – present',
    highlight: '~96–98% test accuracy on 10,000 held-out images',
    description: 'A PyTorch neural network that classifies handwritten digits, with an interactive draw-a-digit web demo in progress',
    category: 'Web',
    tags: ['Machine Learning', 'Web App'],
    tools: ['Python', 'PyTorch'],
    featured: true,
    image: '/austin-portfolio/thumbs/mnist-digit-recognition.png',
    links: {
      github: null, // add your real repo link when ready
      demo: null,   // add your real deployed link when ready
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'Build a simple, interactive ML demo that shows how a model can turn messy input into a usable prediction.',
      approach:
        'Trained a deep neural network in PyTorch on the 70,000-image MNIST dataset, with a reproducible preprocessing and inference pipeline for 28×28 grayscale images so every evaluation runs the same way. Next is a Flask API for inference and a React canvas so people can draw a digit and get a prediction in real time.',
      results:
        'The model reaches about 96–98% accuracy on the 10,000-image test set. The interactive web demo is still in progress.',
      improvements:
        'Add confidence scores, improve preprocessing for messy handwriting, and expand to letters/symbols.',
      techStack: 'Python and PyTorch; Flask and React are planned for the web demo',
    },
  },

  {
    id: 2,
    slug: 'ai-efficiency-modeling',
    tldr: [
      'AI workloads are expensive to run in compute and energy.',
      'A distributed inference strategy that routes simpler requests to lightweight models, plus caching.',
      'About 70% less modeled energy use, and modeled latency down from 611 ms to 276 ms.',
    ],
    title: 'AI Efficiency Modeling (BNY Mellon Project)',
    shortTitle: 'BNY AI efficiency',
    date: 'May 2025',
    highlight: '~70% less modeled energy use, latency 611 ms → 276 ms',
    description: 'A distributed inference strategy that cuts the modeled energy use and latency of AI workloads',
    category: 'Research',
    tags: ['Analytics', 'AI Infrastructure'],
    tools: ['Python', 'Pandas', 'Matplotlib'],
    featured: true,
    image: '/austin-portfolio/thumbs/ai-efficiency-modeling.png',
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
        'Routing simpler requests to lightweight models reduced modeled AI energy consumption by about 70%. Evaluating model-routing and caching strategies cut modeled inference latency by about 55%, from 611 ms to 276 ms.',
      improvements:
        'Would validate the estimates with additional runtime benchmarks and expand logging coverage across more workloads.',
      techStack: 'Python (pandas, matplotlib), Jupyter Notebooks',
    },
  },

  {
    id: 3,
    slug: 'sales-analytics-dashboard',
    role: 'Owner & operator',
    tldr: [
      'An Amazon store needs fast visibility into what sells, what is stuck and where profit comes from.',
      'Sales and ROI tracking with dashboards that guided pricing, sourcing and restocking.',
      '$75K+ revenue in the first year at 30%+ profit margins.',
    ],
    title: 'E-Commerce Sales Analytics (ToolAndMore)',
    shortTitle: 'ToolAndMore analytics',
    date: 'Nov 2023 – Apr 2024',
    highlight: '$75K+ first-year revenue at 30%+ margins',
    description: 'Dashboards and analysis used to track sales, inventory, and profitability',
    category: 'Dashboard',
    tags: ['Business Intelligence', 'Analytics'],
    tools: ['Power BI', 'Excel', 'Python'],
    featured: true,
    image: '/austin-portfolio/thumbs/sales-analytics-dashboard.png',
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
        'Generated $75K+ revenue in the first year while keeping profit margins above 30%, using ROI, profitability, sourcing and pricing analysis to decide what to buy and when to restock.',
      improvements:
        'Add competitor price tracking and forecasting to better plan inventory buys.',
      techStack: 'Power BI, Excel, Python',
    },
  },

  {
    id: 4,
    slug: 'fed-oil-price-analysis',
    tldr: [
      'Can changes in Fed policy help explain movements in oil prices?',
      'Historical rate and price data with time-series exploration and lag comparisons in Python and Excel.',
      'Documented patterns and possible lag effects to explore with stronger models.',
    ],
    title: 'Fed & Oil Price Analysis (BP Project)',
    shortTitle: 'BP Fed & oil',
    highlight: 'Lag analysis of interest rates against oil prices',
    description: 'Explored how changes in interest rates relate to oil price movements over time',
    category: 'Research',
    tags: ['Economics', 'Time Series'],
    tools: ['Python', 'Excel'],
    featured: true,
    image: '/austin-portfolio/thumbs/fed-oil-price-analysis.png',
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

export const categories = ['All', 'Full-Stack', 'Data Engineering', 'Research', 'Web', 'Dashboard'];

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
