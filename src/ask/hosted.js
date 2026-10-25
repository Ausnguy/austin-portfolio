import { FACTS_VERSION } from './knowledge';
import { ASK_ENDPOINT } from './constants';

// Sends the question and the ids of the retrieved facts to the hosted model; returns its raw answer.
// Throws on timeout or any non-200, and the Ask page falls back to showing the facts.
export const askHosted = async (question, facts) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(ASK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, ids: facts.map((f) => f.id), version: FACTS_VERSION }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Ask service returned ${res.status}`);
    const { answer } = await res.json();
    return answer ?? '';
  } finally {
    clearTimeout(timer);
  }
};
