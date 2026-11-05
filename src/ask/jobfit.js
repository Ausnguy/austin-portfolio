// Job-fit check: finds the skills a pasted job description asks for and lines each one up against where Austin used it,
// straight from the Skills sheet (src/data/stack.js). Runs entirely in the browser: the posting is never sent or stored,
// and nothing is inferred, so a skill counts only when a project or role on this site shows it.
import { stack, resumeOnly, resolveWhere } from '../data/stack';
import { profile } from '../data/profile';

const uses = Object.fromEntries(stack.flatMap((d) => d.tools.map((t) => [t.name, t.uses])));

// What postings ask for, how to spot it, and which tools on the Skills sheet count as evidence.
// `exact` patterns are case-sensitive, for words that are also ordinary English ("Excel", "R").
const SKILLS = [
  { label: 'SQL', find: /\b(sql|postgres(ql)?|mysql|t-sql|pl\/sql|relational database)/i, tools: ['SQL', 'PostgreSQL'], cert: 'SQL (Intermediate)', course: 'Database Management Systems' },
  { label: 'Python', find: /\bpython\b/i, tools: ['pandas', 'NumPy', 'scikit-learn + XGBoost', 'FastAPI'], cert: 'Programming in Python', course: 'Data Programming' },
  { label: 'pandas / NumPy', find: /\b(pandas|numpy)\b/i, tools: ['pandas', 'NumPy'] },
  { label: 'Excel', exact: /\bExcel\b|\b(spreadsheets?|pivot ?tables?|vlookup|xlookup)\b/i, tools: ['Excel', 'Power Query + SharePoint'] },
  { label: 'Power BI / DAX', find: /\b(power ?bi|dax)\b/i, tools: ['Power BI + DAX'] },
  { label: 'Tableau', find: /\btableau\b/i, tools: ['Tableau'] },
  { label: 'Dashboards and reporting', find: /\b(dashboards?|data visuali[sz]ation|visuali[sz]e|reporting)\b/i, tools: ['Power BI + DAX', 'Tableau', 'Recharts', 'Matplotlib'] },
  { label: 'ETL and data pipelines', find: /\b(etl|elt|data pipelines?|pipelines?|data ingestion|data integration)\b/i, tools: ['Batch ingestion & pre-aggregation', 'Power Query + SharePoint', 'Kafka'] },
  { label: 'Streaming (Kafka, Spark)', find: /\b(kafka|streaming|real[- ]time|spark|pyspark)\b/i, tools: ['Kafka', 'Spark Structured Streaming'] },
  { label: 'Data cleaning and quality', find: /\b(data quality|data cleaning|clean(ing)? data|data validation|data integrity|anomal(y|ies))\b/i, tools: ['pandas'] },
  { label: 'Machine learning', find: /\b(machine learning|predictive model(s|ing)?|classification|scikit|xgboost|random forests?)\b/i, exact: /\bML\b/, tools: ['scikit-learn + XGBoost', 'NumPy', 'Decision trees & random forests', 'PyTorch'] },
  { label: 'Forecasting', find: /\bforecast(s|ing)?\b/i, tools: ['scikit-learn + XGBoost'] },
  { label: 'Statistics and regression', find: /\b(statistic(s|al)|regression|hypothesis test(s|ing)?)\b/i, tools: ['NumPy', 'scikit-learn + XGBoost'], course: 'Business Statistics' },
  { label: 'Deep learning', find: /\b(deep learning|neural networks?|pytorch|tensorflow)\b/i, tools: ['PyTorch'] },
  { label: 'APIs', find: /\b(rest(ful)? apis?|apis?\b|fastapi)/i, tools: ['FastAPI', 'TypeScript + Redis'] },
  { label: 'Docker', find: /\b(docker|containers?)\b/i, tools: ['Docker Compose'] },
  { label: 'Git and version control', find: /\b(git|github|version control)\b/i, tools: ['Git & GitHub'] },
  { label: 'Testing', find: /\b(unit test(s|ing)?|automated test(s|ing)?|test-driven|pytest)\b/i, tools: ['pytest', 'Vitest'] },
  { label: 'React / front end', find: /\b(react|front[- ]end)\b/i, tools: ['React'] },
  { label: 'TypeScript', find: /\btypescript\b/i, tools: ['TypeScript + Redis'] },
  // On the resume only, or not shown anywhere: listed so the check is honest about gaps.
  { label: 'R', exact: /(^|[\s,(/])R(?=[\s,)/.]|$)(?!&)/, resume: 'R' },
  { label: 'Java', find: /\bjava\b(?!script)/i, resume: 'Java' },
  { label: 'JavaScript', find: /\bjavascript\b/i, resume: 'JavaScript' },
  { label: 'AWS', find: /\b(aws|amazon web services|s3|redshift|lambda)\b/i, resume: 'AWS' },
  { label: 'Linux', find: /\b(linux|unix|bash|shell scripting)\b/i, resume: 'Linux' },
  { label: 'Agile', find: /\b(agile|scrum)\b/i, resume: 'Agile' },
  { label: 'Azure', find: /\bazure\b/i },
  { label: 'Google Cloud / BigQuery', find: /\b(gcp|google cloud|bigquery)\b/i },
  { label: 'Snowflake', find: /\bsnowflake\b/i },
  { label: 'Databricks', find: /\bdatabricks\b/i, cert: 'Databricks Fundamentals' },
  { label: 'dbt', find: /\bdbt\b/i },
  { label: 'Airflow', find: /\bairflow\b/i },
  { label: 'Looker', find: /\blooker\b/i },
  { label: 'SAS / SPSS', find: /\b(sas|spss|stata)\b/i },
  { label: 'Alteryx', find: /\balteryx\b/i },
  { label: 'A/B testing', find: /\b(a\/b test(s|ing)?|ab test(s|ing)?|experimentation)\b/i },
  { label: 'NoSQL', find: /\b(nosql|mongodb|cassandra|dynamodb)\b/i },
];

const DEGREE = /\b(bachelor'?s?|b\.?s\.?|b\.?b\.?a\.?|degree|pursuing|graduat(e|ing|ion))\b/i;

const matches = (skill, text) => (skill.find?.test(text) ?? false) || (skill.exact?.test(text) ?? false);

// Evidence for a skill: up to three places it was used, without repeating a place.
const evidenceFor = (tools) => {
  const seen = new Set();
  const out = [];
  tools.forEach((tool) =>
    (uses[tool] ?? []).forEach((u) => {
      if (seen.has(u.where) || out.length >= 3) return;
      seen.add(u.where);
      out.push({ ...resolveWhere(u.where), did: u.did, team: u.team });
    }),
  );
  return out;
};

export const checkFit = (posting) => {
  const text = posting.slice(0, 20000);
  const rows = SKILLS.filter((s) => matches(s, text)).map((s) => {
    const evidence = s.tools ? evidenceFor(s.tools) : [];
    const cert = s.cert && profile.certifications.find((c) => c.name === s.cert);
    if (cert) evidence.push({ label: 'Certification', to: '/skills', did: `${cert.name} (${cert.issuer})` });
    if (s.course && profile.coursework.includes(s.course)) evidence.push({ label: 'Coursework', to: '/skills', did: `${s.course}, University of Houston` });
    if (evidence.length) return { label: s.label, status: 'shown', evidence };
    if (s.resume && resumeOnly.includes(s.resume)) return { label: s.label, status: 'resume', evidence: [] };
    return { label: s.label, status: 'missing', evidence: [] };
  });
  if (DEGREE.test(text)) {
    rows.unshift({
      label: 'Degree',
      status: 'shown',
      evidence: [{ label: 'Education', to: '/skills', did: `${profile.degree}, University of Houston, graduating ${profile.graduation} (${profile.gpa} GPA)` }],
    });
  }
  const order = { shown: 0, resume: 1, missing: 2 };
  rows.sort((a, b) => order[a.status] - order[b.status]);
  return { rows, shown: rows.filter((r) => r.status === 'shown').length };
};
