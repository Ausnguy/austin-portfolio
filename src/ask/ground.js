// Keeps only what the facts support. Small models pad answers with confident filler and
// sometimes splice two facts into one wrong sentence, so every sentence must be backed by a
// single fact: most of its words, and every name, number and achievement word in it, must come
// from that fact. Sentences must also be on topic for the question.

const STOP = new Set(
  'a an and are as at be been but by can could did do does for from had has have in into is it its of on or that the their them then there these they this to was were which while who will with would also very more most many such than through about over just only both each every other yes'.split(' '),
);

// Capitalized words that can start or join any sentence without being a claim.
const COMMON_CAPS = new Set(['Austin', 'Austin’s', "Austin's", 'Nguyen', 'The', 'It', 'Its', 'This', 'That', 'These', 'In', 'At', 'On', 'For', 'With', 'As', 'A', 'An', 'Yes', 'No', 'He', 'She', 'His', 'Her', 'They', 'Their', 'Both', 'And', 'But', 'From', 'To', 'By']);

// Achievement and leadership words are claims in themselves; they must appear in the fact.
const CLAIMS = /\b(led|leads?|leader|leadership|founded|founder|co-?founded|won|wins?|winner|awarded|award|first|best|top|managed|manager|head|chief|ceo|cto|senior|expert|champion|placed|ranked|sole|only|invented|pioneered|impressive|most|greatest|great|excellent|amazing|leading|strongest|favou?rite|renowned|expert|skilled|passionate)\b/gi;

// Filler that sounds like detail but says nothing; a sentence containing it is dropped.
const VAGUE = /\b(and (?:other|more) (?:technologies|tools|things|features)|etc\b|and so on|a variety of|various (?:technologies|tools))/i;

const stem = (w) => w.replace(/(ing|ed|es|s)$/, '');
const words = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9.%+#]+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ''))
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);

const numbers = (text) => text.match(/\d[\d,.]*%?/g)?.map((n) => n.replace(/[.,]$/, '')) ?? [];
const names = (text) =>
  (text.match(/\b[A-Z][\w’'.+-]*/g) ?? []).map((w) => w.replace(/[.,;:!?]+$/, '')).filter((w) => w && !COMMON_CAPS.has(w));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (text, word) => new RegExp(`\\b${escape(word)}\\b`, 'i').test(text);

// "a dispatch API is a dispatch API serverless": the same word three or more times means the model is looping.
const loops = (ws) => ws.some((w) => ws.filter((x) => x === w).length >= 3);

// The model is told to say "Austin", but tidy up any pronouns that slip through.
const dePronoun = (s) =>
  s
    .replace(/^They\b/, 'Austin')
    .replace(/\b(He|She)\b/g, 'Austin')
    .replace(/\b(His|Her)\b(?=\s)/g, 'Austin’s')
    .replace(/\b(he|she)\b/g, 'Austin')
    .replace(/\bhis\b/g, 'Austin’s');

const supportedBy = (sentence, fact) => {
  const ws = words(sentence);
  if (ws.length === 0 || loops(ws) || VAGUE.test(sentence)) return false;
  const factText = `${fact.label} ${fact.text}`;
  const factWords = new Set(words(factText));
  const overlap = ws.filter((w) => factWords.has(w)).length / ws.length;
  return (
    overlap >= 0.7 &&
    numbers(sentence).every((n) => numbers(factText).includes(n)) &&
    names(sentence).every((n) => hasWord(factText, n.replace(/[’'].*$/, ''))) &&
    (sentence.match(CLAIMS) ?? []).every((c) => hasWord(factText, c))
  );
};

const REFUSAL = /don.t have that in Austin.s workbook/i;

export const groundAnswer = (answer, facts, { question = '', maxSentences = 3 } = {}) => {
  const asked = new Set(words(question).filter((w) => w !== 'austin'));
  // On topic: shares a word with the question, or is backed by the best-matching fact.
  const onTopic = (s) => words(s).some((w) => asked.has(w)) || supportedBy(s, facts[0]);

  const cleaned = answer
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/\[\d+\]\s*/g, '') // fact citations like [2]
    .replace(/^\s*[-*•]\s+/gm, '') // bullet markers
    .trim();

  const sentences = cleaned
    .split(/\n+|(?<!\b[A-Z]\.)(?<=[.!?])\s+(?=[A-Z])/) // never split inside initials like "C. T."
    .map((s) => dePronoun(s.trim()))
    .filter(Boolean);
  const claims = sentences.filter((s) => !REFUSAL.test(s));
  const kept = [...new Set(claims)].filter((s) => facts.some((f) => supportedBy(s, f)) && onTopic(s));

  // A refusal only counts when the model said nothing else the facts support.
  const refused = kept.length === 0 && sentences.some((s) => REFUSAL.test(s));
  return { text: kept.slice(0, maxSentences).join(' '), refused, dropped: claims.length - kept.length };
};
