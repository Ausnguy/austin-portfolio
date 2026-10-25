// BM25 keyword search over the fact sheet. Runs instantly with nothing to download,
// and picks the facts the language model is allowed to answer from.

import facts from './knowledge';

const STOP = new Set(
  'a an and are as at be but by can did do does for from has have he his how i in is it its me of on or tell that the their them they this to was what when where which who why will with you your about austin austins nguyen'.split(' '),
);

// Words people use for the same idea, so "where does he go to school" finds the education facts.
const SYNONYMS = [
  ['school', 'university', 'college', 'study', 'studying', 'major', 'degree', 'education', 'graduate', 'graduating', 'graduation', 'mis', 'bauer'],
  ['gpa', 'grades', 'grade', 'academic', 'deans'],
  ['job', 'work', 'working', 'intern', 'internship', 'experience', 'employer', 'role', 'company', 'currently'],
  ['contact', 'email', 'reach', 'hire', 'hiring', 'linkedin', 'connect'],
  ['stack', 'tech', 'tools', 'technologies', 'languages', 'skills', 'framework', 'frameworks', 'know'],
  ['ml', 'machine', 'learning', 'model', 'models', 'ai', 'neural', 'pytorch', 'predict', 'prediction'],
  ['project', 'projects', 'built', 'build', 'building', 'shipped'],
  ['casequest', 'parvius', 'competition', 'conocophillips'],
  ['learn', 'learned', 'lesson', 'lessons', 'takeaway'],
  ['business', 'amazon', 'ecommerce', 'toolandmore', 'revenue', 'entrepreneur'],
];
const synonymOf = new Map();
SYNONYMS.forEach((group) => group.forEach((w) => synonymOf.set(w, group)));

const stem = (w) => w.replace(/(ing|ed|es|s)$/, '');

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9.+#]+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ''))
    .filter((w) => w && !STOP.has(w));

const expand = (tokens) => {
  const out = [];
  tokens.forEach((t) => {
    out.push(stem(t));
    (synonymOf.get(t) ?? []).forEach((s) => out.push(stem(s)));
  });
  return [...new Set(out)];
};

// Precompute document term frequencies once.
// The label (project or role name) counts three times so "tell me about Interdomain" finds Interdomain facts first.
const docs = facts.map((f) => {
  const terms = tokenize(`${f.label} ${f.label} ${f.label} ${f.text}`).map(stem);
  const tf = new Map();
  terms.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
  return { tf, length: terms.length };
});
const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / docs.length;
const docFreq = new Map();
docs.forEach((d) => d.tf.forEach((_, t) => docFreq.set(t, (docFreq.get(t) ?? 0) + 1)));

const K1 = 1.4;
const B = 0.75;

export const search = (query, limit = 6) => {
  const terms = expand(tokenize(query));
  if (terms.length === 0) return [];
  const scored = docs.map((d, i) => {
    let score = 0;
    terms.forEach((t) => {
      const f = d.tf.get(t);
      if (!f) return;
      const df = docFreq.get(t);
      const idf = Math.log(1 + (facts.length - df + 0.5) / (df + 0.5));
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / avgLength)));
    });
    // Overview facts lead when they match at all.
    return { fact: facts[i], score: score * (facts[i].overview ? 1.25 : 1) };
  });
  const ranked = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  // Drop weak matches that only share a stray word with the question.
  const floor = (ranked[0]?.score ?? 0) * 0.35;
  return ranked
    .filter((s) => s.score >= floor)
    .slice(0, limit)
    .map((s) => s.fact);
};

export const factCount = facts.length;
