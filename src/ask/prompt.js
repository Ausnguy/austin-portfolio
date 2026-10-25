import { profile } from '../data/profile';

const factBlock = (facts) => facts.map((f, i) => `[${i + 1}] ${f.text}`).join('\n');

// Grounded prompt: the facts sit right next to the question, and one worked example shows the
// shape of a good answer. The example is about a made-up project, so if the model copies it,
// the grounding filter throws it away.
export const buildMessages = (question, facts) => [
  {
    role: 'system',
    content: `You answer questions about Austin Nguyen using only the numbered facts you are given. Restate the facts closely and copy names and numbers exactly. Do not combine details from different facts into one sentence. Say "Austin", never he or she. Write at most 3 short sentences. If the facts do not answer the question, reply exactly: I don't have that in Austin's workbook.`,
  },
  {
    role: 'user',
    content: `Facts:
[1] Project "Lighthouse" (2020): A tool that counts boats in harbor photos. Key result: 93% accuracy.
[2] Lighthouse tech stack: Python, OpenCV.

Question: What is Lighthouse?`,
  },
  {
    role: 'assistant',
    content: 'Lighthouse is a tool that counts boats in harbor photos. It reached 93% accuracy. It was built with Python and OpenCV.',
  },
  { role: 'user', content: `Facts:\n${factBlock(facts)}\n\nQuestion: ${question}` },
];

export const REFUSAL = `I don't have that in Austin's workbook. Try emailing ${profile.email}.`;
