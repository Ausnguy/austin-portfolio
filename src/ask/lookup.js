// Exact answers for "does Austin know / use X?" questions: search the facts for X instead of asking
// the model, so the answer is right by construction.
import facts from './knowledge';

const ASKS_ABOUT_SKILL =
  /\b(?:know|knows|use|uses|used|using|code in|program in|work(?:ed)? with|familiar with|experience (?:with|in)|skilled in|good at)\s+(.+?)\s*\??$/i;

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Returns { term, answer, facts } for a skill question, or null if the question isn't one.
export const lookupSkill = (question) => {
  const match = question.trim().match(ASKS_ABOUT_SKILL);
  if (!match) return null;
  const raw = match[1].replace(/^(?:the|a|an|any)\s+/i, '').replace(/[.!]+$/, '').trim();
  // Short names like R are written in capitals; normalize so "r" finds the skill, not a stray letter.
  const term = raw.length <= 2 ? raw.toUpperCase() : raw;
  if (!term || term.length > 30 || term.split(/\s+/).length > 4) return null;

  // Short terms like "R" match case-sensitively so they can't hit a stray letter (e.g. "r ≈ −0.995").
  const pattern = new RegExp(`(^|[^\\w])${escape(term)}([^\\w]|$)`, term.length <= 2 ? '' : 'i');
  const hits = facts.filter((f) => pattern.test(f.text));
  if (hits.length === 0) {
    return { term, facts: [], answer: `Not that the workbook shows: “${term}” doesn’t appear anywhere in Austin’s projects, experience or skills.` };
  }

  const places = [...new Set(hits.map((f) => (f.label === 'Skills' || f.label === 'Profile' ? null : f.label)).filter(Boolean))];
  const listed = places.length > 3 ? `${places.slice(0, 3).join(', ')} and ${places.length - 3} more` : places.join(', ').replace(/, ([^,]*)$/, ' and $1');
  return {
    term,
    facts: hits.slice(0, 3),
    answer: places.length
      ? `Yes. ${term} shows up in ${listed}.`
      : `Yes. ${term} is on Austin’s skills list.`,
  };
};
