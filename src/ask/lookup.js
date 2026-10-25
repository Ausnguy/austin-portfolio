// Exact answers for "does Austin know / use X?" questions: search the facts for X instead of asking
// the model, so the answer is right by construction.
import facts from './knowledge';
import { projects } from '../data/projects';
import { experiences } from '../data/experience';
import { profile } from '../data/profile';

const ASKS_ABOUT_SKILL =
  /\b(?:know|knows|use|uses|used|using|code in|program in|work(?:ed)? with|familiar with|experience (?:with|in)|skilled in|good at)\s+(.+?)\s*\??$/i;

// "What experience does Austin have with Kafka?" puts words between the verb and the skill.
const ASKS_ABOUT_SKILL_LOOSE = /\b(?:experience|familiar|comfortable)\b.*?\b(?:with|in)\s+(.+?)\s*\??$/i;

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Returns { term, answer, facts } for a skill question, or null if the question isn't one.
export const lookupSkill = (question) => {
  const match = question.trim().match(ASKS_ABOUT_SKILL) ?? question.trim().match(ASKS_ABOUT_SKILL_LOOSE);
  if (!match) return null;
  const raw = match[1].replace(/^(?:the|a|an|any)\s+/i, '').replace(/[.!]+$/, '').trim();
  // Short names like R are written in capitals; normalize so "r" finds the skill, not a stray letter.
  const term = raw.length <= 2 ? raw.toUpperCase() : raw;
  if (!term || term.length > 30 || term.split(/\s+/).length > 4) return null;

  // Short terms like "R" match case-sensitively so they can't hit a stray letter (e.g. "r ≈ −0.995").
  const pattern = new RegExp(`(^|[^\\w])${escape(term)}([^\\w]|$)`, term.length <= 2 ? '' : 'i');
  // Stack facts say what the tool did in each place, so they lead.
  const hits = facts.filter((f) => pattern.test(f.text)).sort((a, b) => b.ref.startsWith('Stack!') - a.ref.startsWith('Stack!'));
  if (hits.length === 0) {
    return { term, facts: [], answer: `Not that the workbook shows: “${term}” doesn’t appear anywhere in Austin’s projects, experience or skills.` };
  }

  // Where the stack has evidence for the tool, name only those places; otherwise any project or role mentioning it.
  const stackHits = hits.filter((f) => f.ref.startsWith('Stack!') && f.label !== 'Resume');
  const named = stackHits.length ? stackHits : hits;
  const places = [...new Set(named.map((f) => (['Resume', 'Profile'].includes(f.label) ? null : f.label)).filter(Boolean))];
  const listed = places.length > 3 ? `${places.slice(0, 3).join(', ')} and ${places.length - 3} more` : places.join(', ').replace(/, ([^,]*)$/, ' and $1');
  return {
    term,
    facts: hits.slice(0, 3),
    answer: places.length
      ? `Yes. ${term} shows up in ${listed}.`
      : `${term} is on Austin’s resume, but no project on this site shows it yet.`,
  };
};

// Exact answers for the questions people ask most, built straight from the data files.

const NAMED_PROJECT = /\b(parvius|casequest|interdomain|mnist|bny|bp|toolandmore|amazon)\b/i;
const ref = (sheet, name) => `${sheet}!${name.replace(/\W+/g, '_')}`;

export const lookupIntent = (question) => {
  const q = question.trim();

  if (/\b(what|which)\b.*\b(built|build|made|make|shipped|projects?|worked on)\b/i.test(q) && !NAMED_PROJECT.test(q)) {
    return {
      term: 'projects',
      answer: `Austin has ${projects.length} projects in the workbook:`,
      facts: projects.map((p) => ({
        ref: ref('Projects', p.shortTitle),
        text: `${p.title}${p.date ? ` (${p.date})` : ''}${p.status === 'wip' ? ', in progress' : ''}: ${p.highlight}.`,
      })),
    };
  }

  if (/\b(where|which|what)\b.*\b(work|worked|intern|interned|internships?|jobs?|companies|experience)\b/i.test(q) && !NAMED_PROJECT.test(q)) {
    return {
      term: 'experience',
      answer: `Austin’s experience, newest first:`,
      facts: [...experiences].sort((a, b) => b.start.localeCompare(a.start)).map((e) => ({ ref: ref('Experience', e.shortName), text: `${e.role} at ${e.company} (${e.period}). ${e.summary}` })),
    };
  }

  if (/\b(school|college|university|study|studies|studying|major|degree|gpa|graduat\w*|education)\b/i.test(q)) {
    return {
      term: 'education',
      answer: `${profile.degree} at the ${profile.school}, graduating ${profile.graduation}, with a ${profile.gpa} GPA.`,
      facts: profile.facts.slice(0, 4).map((text, i) => ({ ref: `Summary!A${i + 1}`, text })),
    };
  }

  if (/\b(contact|reach|email|hire|get in touch|linkedin)\b/i.test(q)) {
    return {
      term: 'contact',
      answer: `Email ${profile.email}, or find Austin on LinkedIn and GitHub.`,
      facts: profile.facts.filter((f) => f.startsWith('To contact')).map((text) => ({ ref: 'Summary!Contact', text })),
    };
  }

  return null;
};

// "Tell me about Parvius" and "what's your best project?": answered from the project data, never opinion.
const PROJECT_KEYS = [
  [/\b(parvius|casequest|case quest)\b/i, 'casequest-2026'],
  [/\binterdomain\b/i, 'interdomain'],
  [/\b(mnist|digit)\b/i, 'mnist-digit-recognition'],
  [/\b(bny|efficiency)\b/i, 'ai-efficiency-modeling'],
  [/\b(toolandmore|amazon)\b/i, 'sales-analytics-dashboard'],
  [/\b(bp|fed|oil)\b/i, 'fed-oil-price-analysis'],
];
const ABOUT = /\b(tell me about|what is|what's|whats|explain|describe|about|overview of)\b/i;
const SUPERLATIVE = /\b(most impressive|best|favou?rite|proudest|greatest|top|standout|strongest)\b.*\b(project|thing|work|built|build|made)\b/i;

export const lookupExtra = (question) => {
  const q = question.trim();

  if (SUPERLATIVE.test(q)) {
    const lead = projects.find((p) => p.spotlight);
    const other = projects.find((p) => p.status === 'wip');
    return {
      term: 'featured',
      answer: `The workbook doesn’t rank Austin’s projects, but it leads with ${lead.shortTitle}: ${lead.highlight}.`,
      facts: [lead, other].filter(Boolean).map((p) => ({
        ref: `Projects!${p.shortTitle.replace(/\W+/g, '_')}`,
        label: p.shortTitle,
        text: `${p.title}: ${p.highlight}.`,
      })),
    };
  }

  if (/\b(certif\w*|credentials?|certs?)\b/i.test(q)) {
    return {
      term: 'certifications',
      answer: `Austin holds ${profile.certifications.length} certifications: ${profile.certifications.map((c) => `${c.name} (${c.issuer})`).join(', ')}.`,
      facts: profile.facts.filter((f) => f.includes('certifications')).map((text) => ({ ref: 'Summary!Certifications', text })),
    };
  }

  if (ABOUT.test(q)) {
    const hit = PROJECT_KEYS.find(([re]) => re.test(q));
    const project = hit && projects.find((p) => p.slug === hit[1]);
    if (project) {
      return {
        term: project.shortTitle,
        answer: `${project.title}${project.date ? `, ${project.date}` : ''}: ${project.description.replace(/\.+$/, '')}.`,
        facts: (project.tldr ?? [project.highlight]).map((text) => ({
          ref: `Projects!${project.shortTitle.replace(/\W+/g, '_')}`,
          label: project.shortTitle,
          text,
        })),
      };
    }
  }

  return null;
};
