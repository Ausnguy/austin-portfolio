// Projects Data
// To add a new project: Copy an object below, update all fields, and it will automatically appear on the site.

export const projects = [

  {
    id: 7,
    slug: 'marketstreet',
    role: 'Team of 6',
    event: 'MIS 3371 (Section 10129), University of Houston',
    team: ['Austin Nguyen', 'Sophia Musetti', 'Arya Nair', 'Benjamin Nguyen', 'Shayaan M Dawra', 'Agah Duzenli'],
    tldr: [
      'Beginner investors want to practice trading without risking real money, and a trading system needs clear rules about what is allowed.',
      'MarketStreet, a paper-trading app where a user submits a simulated buy or sell order that is checked against business rules, then accepted or rejected with a reason.',
      'Requirements, business rules, data dictionary, state diagram and a working order-form prototype are done; the application logic and data storage are still being built.',
    ],
    decisions: [
      {
        title: 'Catch bad input in the browser, and rule failures in the application',
        why: 'Missing fields and non-numeric quantities are blocked on the form and create no record. Once an order is received it gets a transaction ID, and any order that breaks a business rule is saved as Rejected with a reason, leaving cash and holdings unchanged.',
      },
      {
        title: 'Two final statuses: Accepted and Rejected',
        why: 'Every order moves from Submitted to Validated to Accepted or Rejected, and the last two are final, so the record of a trade can never change after the fact.',
      },
    ],
    title: 'MarketStreet: Paper Trading System',
    shortTitle: 'MarketStreet',
    status: 'wip',
    date: 'Sep 2026 – present',
    highlight: 'A simulated stock trade, checked against business rules and recorded',
    description:
      'A paper-trading system where users practice buying and selling stocks with simulated money, built as a team project for MIS 3371.',
    category: 'Web',
    tags: ['Web App', 'Systems Design', 'Work in progress'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    featured: false,
    image: '/austin-portfolio/thumbs/marketstreet.png',
    pipeline: [
      { name: 'User submits an order', detail: 'Buy or sell, stock symbol and number of shares' },
      { name: 'Browser checks the form', detail: 'Missing or non-numeric input is blocked and nothing is recorded' },
      { name: 'Application checks the rules', detail: 'Valid trade type and symbol, whole-number shares, enough cash to buy or enough shares to sell' },
      { name: 'Trade is recorded', detail: 'Transaction ID, status, price, value and timestamp' },
      { name: 'Portfolio updates', detail: 'Accepted trades change cash and holdings; rejected trades show the reason' },
    ],
    links: {
      github: 'https://github.com/UH-MIS3371/MIS3371-Section10129-Group14',
      demo: null,
      caseStudy: true,
    },
    caseStudy: {
      problem:
        'Someone learning to trade may want to practice without risking real money. A paper-trading system also needs consistent rules, so users can see what happened to each trade and why.',
      approach:
        'We designed the system around one main transaction, a simulated stock trade. We wrote the requirements, business rules, user stories and a data dictionary, drew the workflow, the architecture and a state diagram, and split the responsibilities between the presentation layer, the application logic and the data. Each order is checked against the rules: a valid trade type and stock symbol, a positive whole number of shares, enough cash for a purchase and enough shares for a sale. We then built a step-by-step order form prototype that shows the account balance and the price of each stock.',
      results:
        'The design documents and the order-form prototype are done. The application logic that enforces the rules and the storage for transactions are still in progress.',
      improvements:
        'Connect the form to the application layer, store each transaction with its status and timestamps, and show a history of completed trades.',
      techStack: 'HTML, CSS and JavaScript for the order-form prototype; design documents and diagrams for the requirements, rules, data and states',
    },
  },
  {
    id: 6,
    slug: 'interdomain',
    role: 'Solo project',
    tldr: [
      'Routing changes can take parts of the internet offline, and the raw BGP feed is a firehose that is hard to watch live.',
      'A Python, Kafka, Spark, PostgreSQL, FastAPI and React pipeline for live internet routing data.',
      'Version 1 runs end to end at about 8.7K events per second, with dashboard queries cut from 13–27 s to 44–62 ms; the Kafka and Spark layer is still being built out.',
    ],
    decisions: [
      {
        title: 'Ship a working V1 before the big data stack',
        why: 'V1 is RIPE RIS Live to Python to PostgreSQL to FastAPI. Kafka, Spark/Databricks, Delta Lake, dbt and Airflow are added only after that works end to end.',
      },
      {
        title: 'Batch, pre-aggregate and partition when traffic outgrew V1',
        why: 'Sustained high-volume traffic built a 19.6M-message backlog. 5K-record batch ingestion, pre-aggregated minute-level metrics and time-partitioned storage cleared it.',
      },
    ],
    title: 'Interdomain: Real-Time BGP Routing Observability',
    shortTitle: 'Interdomain',
    status: 'wip',
    date: 'Oct 2026 – present',
    highlight: 'Handles ~8.7K live events/sec; dashboard queries cut from 13–27 s to 44–62 ms',
    metrics: [
      { display: '~8.7K', label: 'streaming events per second (about 33K records per second)' },
      { display: '23', label: 'worldwide monitoring locations feeding the stream' },
      { display: '19.6M', label: 'message backlog eliminated by batching and pre-aggregation' },
      { display: '>99%', label: 'lower dashboard query latency, from 13–27 s to 44–62 ms' },
    ],
    description:
      'A real-time platform that watches the internet’s routing table change, stores every route announcement and withdrawal, and flags anomalies like withdrawal spikes.',
    category: 'Data Engineering',
    tags: ['Streaming', 'Data Engineering', 'Networking', 'Work in progress'],
    tools: ['Python', 'Kafka', 'Spark', 'PostgreSQL', 'FastAPI', 'Docker', 'React'],
    featured: true,
    image: '/austin-portfolio/thumbs/interdomain.png',
    pipeline: [
      { name: 'RIPE RIS Live', detail: 'Public stream of BGP updates from route collectors worldwide' },
      { name: 'Python ingestion', detail: 'WebSocket client normalizes updates into route events and writes them in 5K-record batches' },
      { name: 'Kafka', detail: 'bgp-updates topic, keyed by peer ASN' },
      { name: 'Spark + PostgreSQL', detail: 'Sliding-window instability checks; minute-level pre-aggregation and time-partitioned storage' },
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
        'Version 1 runs end to end: live ingestion from RIPE RIS, PostgreSQL storage, the analytics API and a dashboard. It processes about 8.7K streaming events per second (about 33K records per second) from 23 monitoring locations. When sustained traffic built a 19.6M-message backlog, 5K-record batch ingestion, pre-aggregated minute-level metrics and time-partitioned storage cleared it and cut dashboard query latency by more than 99%, from 13–27 s to 44–62 ms. A tested rule flags withdrawal spikes when at least 40% of 20 or more events are withdrawals. The Kafka and Spark streaming layer is in place and still being built out.',
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
      'Lone Mesa Energy lost about 6,599 hours to unplanned machine stops in 2025, and 24% of it was machines waiting for a spare part.',
      'A failure-warning model, a 3D operations console and an engineer phone app that all share one live set of data.',
      'The model warned before 90 of 91 mechanical failures on data it had never seen. The parts program is modeled to save about 968 hours a year.',
    ],
    // Drawn by src/components/Architecture.jsx: zones hold nodes, edges are the arrows between nodes.
    architecture: {
      label: 'Architecture of Parvius: the case workbook is cleaned in Python and scored by a failure model; the scores go to a TypeScript dispatch API on Vercel that keeps shared state in Redis; the ops console and the engineer phone app both read and write that state.',
      caption: 'Arrows show which way data moves. A two-way arrow means both sides read and write.',
      spec: {
        zones: [
          { title: 'Data and model', subtitle: 'Python, run offline', nodes: ['workbook', 'clean', 'model'] },
          { title: 'Shared state', subtitle: 'TypeScript on Vercel', hub: true, nodes: ['api', 'store'] },
          { title: 'Two screens', subtitle: 'One live state', nodes: ['console', 'phone'] },
        ],
        nodes: {
          workbook: { name: 'Case workbook', lines: ['Readings, stop events and assets', 'for 6 sites and 18 machines'], tools: ['Excel'] },
          clean: { name: 'Cleaning pipeline', lines: ['Logged rules and 39 automated', 'integrity checks'], tools: ['Python', 'pandas'] },
          model: { name: 'Failure model', lines: ['Logistic regression written from', 'scratch (Newton’s method, ridge)', 'flags a bearing or seal failure', '3 days out'], tools: ['NumPy'] },
          api: { name: 'Dispatch API', lines: ['Serverless functions with', 'validated requests. Refuses to', 'send an engineer unless every', 'kit is in stock'], tools: ['TypeScript', 'Vercel', 'Zod'] },
          store: { name: 'State store', lines: ['Redis with a compare-and-swap', 'check, so one device can’t', 'silently overwrite the other'], tools: ['Redis'] },
          console: { name: 'Ops console', lines: ['Single-file web app: 3D site map', 'hand-drawn on Canvas, voice', 'input with Whisper in the', 'browser, voice output with', 'Kokoro on WebGPU'], tools: ['HTML Canvas', 'Hugging Face'], wideY: 62 },
          phone: { name: 'Engineer phone app', lines: ['Take the job, travel to the site', 'and report the kits fitted.', 'Shake the phone to travel'], tools: ['React Native', 'Expo'] },
        },
        edges: [
          { from: 'workbook', to: 'clean' },
          { from: 'clean', to: 'model' },
          { from: 'model', to: 'api', label: 'model output', labelCenter: true, toAt: 0.35 },
          { from: 'api', to: 'store', both: true, label: 'compare-and-swap' },
          { from: 'api', to: 'console', both: true, fromAt: 0.35, lane: 0 },
          { from: 'api', to: 'phone', both: true, fromAt: 0.8, lane: 1 },
        ],
      },
    },
    // Plain-language layer shown first on the project page: the case, the solution, and what was built.
    story: {
      case: {
        headline: 'Lone Mesa Energy lost about 6,599 hours to unplanned machine stops in 2025.',
        points: [
          'It runs six oil sites with 18 pumps and compressors.',
          'The downtime cost about $5.6M in modeled lost contribution (revenue minus the direct cost of producing it).',
          'A quarter of it (24%) was machines sitting idle, waiting for a spare part.',
        ],
        note: 'Our job in the competition: act as consultants, pick the one problem that matters most, and recommend one practical fix, backed by the data and a working prototype.',
      },
      solution: {
        headline: 'Stock the critical spare parts, and warn 3 days before a machine fails.',
        points: [
          'Keep critical parts on hand, but only at sites that have closed their overdue safety actions.',
          'A model flags machines likely to fail within 3 days, so the right parts and an engineer are ready.',
          'We modeled it at about 968 fewer downtime hours a year.',
        ],
      },
      built: [
        { title: 'Failure model', who: 'For the planner', body: 'Reads each machine’s daily vibration, temperature and inspection notes, and flags likely bearing or seal failures 3 days out.' },
        { title: 'Ops console', who: 'For the manager', body: 'A 3D map of the sites with parts stock and dispatch. It won’t send an engineer unless every needed kit is on the shelf.' },
        { title: 'Phone app', who: 'For the field engineer', body: 'The engineer takes the job, travels to the site and reports which kits were fitted. It shares live data with the console.' },
      ],
    },
    decisions: [
      {
        title: 'Predict 3 days out, using a 2-day window',
        why: 'The data chose the window. 91% of mechanical failures show vibration above 1.3× normal two days before, and only 1% show it three days before.',
      },
      {
        title: 'One alert level, not two',
        why: 'We tried a lower “watch” level and dropped it. The days it flagged failed less often than an average day.',
      },
      {
        title: 'Score only on readings already received',
        why: 'Late readings are left out, so every score is what a planner could really have seen that day. A test checks this.',
      },
    ],
    title: 'Parvius: Parts Readiness System (CaseQuest 2026)',
    shortTitle: 'Parvius (CaseQuest)',
    date: 'Oct 2026',
    highlight: 'Model warned before 90 of 91 equipment failures on unseen data',
    description:
      'A system that warns when oil-field machines are about to fail, and sends the right engineer with the right parts. Built for CaseQuest 2026, a ConocoPhillips-sponsored case competition.',
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
      { value: 6599, suffix: ' h', label: 'of unplanned downtime across 6 sites and 18 machines' },
      { value: 24, suffix: '%', label: 'of that downtime was machines waiting for a spare part' },
      { value: 0.82, decimals: 2, label: 'model score (AUC) on half a year of data it never saw. 1.0 is perfect, 0.5 is a coin flip' },
      { value: 90, suffix: ' / 91', label: 'mechanical failures got at least one warning first' },
      { value: 968, suffix: ' h/yr', label: 'of downtime the parts program is modeled to avoid' },
    ],
    caseStudy: {
      problem:
        'Lone Mesa Energy runs six oil sites with 18 pumps and compressors. In 2025 it lost about 6,599 hours to unplanned stops, a modeled $5.6M in lost contribution. The case asked us, as consultants, to pick the one operational problem that matters most and recommend one practical fix, backed by the data and a working prototype.',
      approach:
        'We cleaned the competition workbook with logged rules and 39 automated checks, then looked for where the hours went. A quarter of all downtime was machines sitting broken while someone waited for a part. That became our recommendation: a critical spare-parts program, rolled out only at sites that have closed their overdue safety actions. To show how it would run day to day, we built three connected pieces. A failure model reads daily vibration, temperature and inspection notes and flags machines likely to have a bearing or seal failure within 3 days. A manager console shows a 3D map of the sites, the parts warehouse and dispatch. A phone app lets the field engineer take the job, travel to the site and report which kits were fitted. The console and the phone share one live set of data through a small API.',
      results:
        'On the second half of 2025, data it never saw, the model scored an AUC of 0.82 (1.0 is perfect, 0.5 is a coin flip). 68% of the days it flagged were followed by a mechanical failure within 3 days, against 9% for a typical day. 90 of 91 mechanical failures got at least one warning first, a median 1.5 days ahead. The spare-parts program is modeled to avoid about 968 downtime hours a year (range 565–1,210), for $168k upfront and $18k a year. The full system works end to end: alerts, warehouse stock, dispatch that refuses to send an engineer without every kit, and a phone app that updates the same live data.',
      improvements:
        'The data is a scenario with one reading per machine per day. Next, we would check the model against real sensor data, such as the Petrobras 3W offshore well dataset. After that comes a costed Phase 2: condition monitoring at the worst-hit site.',
      lessons: [
        {
          title: 'Let the data pick the problem',
          body: 'We looked at every option before choosing. At each site, how often breakdowns waited on parts closely tracked how empty the spare shelf was (correlation r ≈ −0.995, where −1 is a perfect inverse link). That gave our one recommendation a clear reason.',
        },
        {
          title: 'Only use what you would have known that day',
          body: 'Sensor readings sometimes arrive late. The model sees only readings received by the end of each day. We trained it on January to June and tested it on July to December, so the score reflects what a planner could really have acted on.',
        },
        {
          title: 'A simple model you can explain',
          body: 'Five plain features and a logistic regression (a standard model that weighs evidence into a risk score), written by us in about 20 lines of NumPy with no ML library. It warned before 90 of 91 failures, and we can say exactly why any alert fired.',
        },
        {
          title: 'Say what it can’t do',
          body: 'Electrical trips look like normal days in the readings, so no model on this data could predict them, and we said so. Every number in the console is marked as recorded or modeled.',
        },
        {
          title: 'Put the safety rules in the software',
          body: 'The system never starts or stops a machine, never sends anyone on its own, never dispatches without the parts, and has no override for a safety hold. The rules live in code, not in a slide.',
        },
        {
          title: 'Two screens, one truth',
          body: 'The manager console and the engineer’s phone write to the same data. A check in Redis (compare-and-swap: save only if nobody changed it since you last read it) stops one device from silently overwriting the other.',
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
    date: 'Jan – Feb 2026',
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
