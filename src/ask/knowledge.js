// The facts Ask Austin is allowed to use, built from the same data files the site renders.
// Every fact carries a cell-style reference so answers can cite where they came from.

import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import { skillGroups, getGroupEvidence } from '../data/skills';
import { profile } from '../data/profile';

const facts = [];
const add = (ref, label, text, overview = false) => facts.push({ ref, label, text, overview });
const trimDot = (t) => t.replace(/\.+$/, '');

// Profile and education
profile.facts.forEach((text, i) => add(`Summary!A${i + 1}`, 'Profile', text));

// Experience: one overview fact per role, then each highlight on its own for sharper retrieval.
experiences.forEach((exp, i) => {
  const row = i + 2;
  add(
    `Experience!A${row}`,
    exp.shortName,
    `${exp.shortName}: ${exp.role} at ${exp.company} (${exp.period}, ${exp.location}). ${trimDot(exp.description)}.`,
    true,
  );
  exp.highlights.forEach((h, j) => add(`Experience!C${row}.${j + 1}`, exp.shortName, `At ${exp.shortName}: ${h}`));
  add(`Experience!D${row}`, exp.shortName, `Skills Austin used at ${exp.shortName}: ${exp.skills.join(', ')}.`);
});

// Projects: overview, each case study part, lessons and stack.
projects.forEach((p) => {
  const ref = `Projects!${p.shortTitle.replace(/\W+/g, '_')}`;
  const status = p.status === 'wip' ? ' It is a work in progress.' : '';
  add(ref, p.shortTitle, `Project "${p.title}"${p.date ? ` (${p.date})` : ''}: ${trimDot(p.description)}.${status}${p.highlight ? ` Key result: ${trimDot(p.highlight)}.` : ''}`, true);
  add(ref, p.shortTitle, `${p.shortTitle} tools: ${p.tools.join(', ')}.`);
  if (p.team) add(ref, p.shortTitle, `${p.shortTitle} was a team project with ${p.team.length} people: ${p.team.join(', ')}.`);
  if (p.links?.github) add(ref, p.shortTitle, `${p.shortTitle} code is on GitHub at ${p.links.github}.`);
  if (p.links?.demo) add(ref, p.shortTitle, `${p.shortTitle} has a live demo at ${p.links.demo}.`);
  const cs = p.caseStudy;
  if (!cs) return;
  add(ref, p.shortTitle, `${p.shortTitle}, the problem: ${cs.problem}`);
  add(ref, p.shortTitle, `${p.shortTitle}, the approach: ${cs.approach}`);
  add(ref, p.shortTitle, `${p.shortTitle}, the results: ${cs.results}`);
  if (cs.improvements) add(ref, p.shortTitle, `${p.shortTitle}, next steps: ${cs.improvements}`);
  (cs.lessons ?? []).forEach((l) => add(ref, p.shortTitle, `Lesson from ${p.shortTitle}: ${l.title}. ${l.body}`));
  if (typeof cs.techStack === 'string') {
    add(ref, p.shortTitle, `${p.shortTitle} tech stack: ${cs.techStack}.`);
  } else if (cs.techStack) {
    Object.entries(cs.techStack).forEach(([group, items]) =>
      add(ref, p.shortTitle, `${p.shortTitle} tech stack, ${group}: ${items.join('; ')}.`),
    );
  }
});

// Skills
skillGroups.forEach(({ group, skills }, i) => {
  const used = getGroupEvidence(skills);
  add(
    `Skills!A${i + 2}`,
    'Skills',
    `Austin's ${group} skills: ${skills.join(', ')}.${used.length ? ` Used in: ${used.join(', ')}.` : ''}`,
  );
});

export default facts;
