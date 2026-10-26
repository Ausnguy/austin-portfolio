import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { search, factCount } from '../ask/retrieve';
import { groundAnswer } from '../ask/ground';
import { lookupExtra, lookupIntent, lookupSkill } from '../ask/lookup';
import { askHosted } from '../ask/hosted';
import { trackEvent } from '../lib/track';
import { MODEL_LABEL } from '../ask/constants';
import { profile } from '../data/profile';

export const SUGGESTIONS = [
  'What has Austin built?',
  'What is Austin’s tech stack?',
  'Tell me about Parvius',
  'Where does Austin go to school?',
  'Does Austin know Kafka?',
  'How do I contact Austin?',
];

const Ask = () => {
  useSheet('A1', '=ASK("anything about Austin")', 'Ask Austin');
  const [params, setParams] = useSearchParams();
  const [question, setQuestion] = useState('');
  const [entries, setEntries] = useState([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const askedFromUrl = useRef(false);

  const ask = async (q) => {
    const text = q.trim();
    if (!text || busy) return;
    setQuestion('');
    trackEvent('ask');
    // Skill questions ("Does Austin know X?") and the common ones (projects, experience, school,
    // contact) are answered exactly from the data, no model needed.
    const lookup = lookupSkill(text) ?? lookupExtra(text) ?? lookupIntent(text);
    if (lookup) {
      setEntries((prev) => [...prev, { id: Date.now(), q: text, facts: lookup.facts, mode: 'lookup', term: lookup.term, answer: lookup.answer, done: true }]);
      return;
    }
    const facts = search(text, 6);
    const id = Date.now();
    setEntries((prev) => [...prev, { id, q: text, facts, mode: facts.length ? 'ai' : 'facts', answer: '', done: !facts.length }]);
    if (!facts.length) return;

    setBusy(true);
    const update = (patch) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch(e) } : e)));
    try {
      const draft = await askHosted(text, facts);
      // Only sentences the facts support are shown; otherwise fall back to the facts themselves.
      const grounded = groundAnswer(draft, facts, { question: text });
      if (grounded.refused) {
        update(() => ({ mode: 'facts', done: true, note: 'The model couldn’t answer that from the workbook, so here is what it says directly.' }));
      } else if (!grounded.text) {
        update(() => ({ mode: 'facts', done: true, note: 'The model’s answer went beyond the workbook, so here are the facts instead.' }));
      } else {
        update(() => ({ answer: grounded.text, done: true }));
      }
    } catch {
      update(() => ({ mode: 'facts', done: true, note: 'The answer service didn’t respond, so here are the facts it would have used.' }));
    } finally {
      setBusy(false);
    }
  };

  // Questions typed on the Summary sheet arrive as ?q=
  useEffect(() => {
    const q = params.get('q');
    if (q && !askedFromUrl.current) {
      askedFromUrl.current = true;
      setParams({}, { replace: true });
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula='=ASK("anything about Austin")'>
          <h1 className="sheet-title">Ask Austin</h1>
          <p className="body-copy mt-2 max-w-2xl">
            Ask about Austin’s projects, skills, experience or education. Answers come only from the {factCount} facts in
            this workbook, and every answer is checked against them.
          </p>
          <p className="mt-3 text-[13px] text-muted max-w-2xl">
            Written answers come from {MODEL_LABEL} and are checked against the workbook before you see them. Your question is
            sent to that service to write the answer and isn’t stored by this site.
          </p>
        </Cell>
      </Row>

      <div aria-live="polite">
        {entries.map((entry, i) => (
          <Row key={entry.id}>
            <Cell id={`A${i + 2}`} span="col-span-12 lg:col-span-4" formula={`=ASK("${entry.q}")`}>
              <div className="cell-ref mb-1">Question</div>
              <p className="text-[16px] font-semibold text-ink">{entry.q}</p>
            </Cell>
            <Cell id={`B${i + 2}`} span="col-span-12 lg:col-span-8" formula={
                entry.mode === 'ai'
                  ? '=GENERATE(llama_3_1_8b, facts)'
                  : entry.mode === 'lookup'
                    ? `=XLOOKUP("${entry.term}", workbook)`
                    : '=LOOKUP(question, facts)'
              }>
              <div className="cell-ref mb-1">
                {entry.mode === 'ai' ? `Written by ${MODEL_LABEL}, checked against the workbook` : entry.mode === 'lookup' ? 'Looked up in the workbook' : 'Straight from the workbook'}
              </div>
              {entry.mode === 'lookup' ? (
                <>
                  <p className="body-copy text-ink">{entry.answer}</p>
                  {entry.facts.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {entry.facts.map((f) => (
                        <li key={f.ref + f.text} className="relative pl-4 body-copy">
                          <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" />
                          {f.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : entry.facts.length === 0 ? (
                <p className="body-copy">
                  Nothing in Austin’s workbook matches that. Try asking about projects, skills, experience or education, or
                  email <a className="link" href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              ) : entry.mode === 'ai' ? (
                entry.done ? (
                  <p className="body-copy text-ink">{entry.answer}</p>
                ) : (
                  <p className="body-copy text-muted">
                    Writing an answer and checking it against the workbook…
                    <span className="inline-block w-2 h-4 align-[-2px] ml-1 bg-accent animate-pulse" aria-hidden="true" />
                  </p>
                )
              ) : (
                <ul className="space-y-2">
                  {entry.facts.slice(0, 3).map((f) => (
                    <li key={f.ref + f.text} className="relative pl-4 body-copy">
                      <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              )}
              {entry.note && <p className="mt-2 text-sm text-muted">{entry.note}</p>}
            </Cell>
          </Row>
        ))}
      </div>

      <Row>
        <Cell id={`A${entries.length + 2}`} formula="=ASK(your_question)">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
            className="flex items-stretch gap-2"
          >
            <label className="flex-1 flex items-center h-11 rounded border border-grid bg-paper focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <span className="pl-3 pr-1 font-mono text-[14px] text-accent-ink select-none" aria-hidden="true">=ASK(</span>
              <input
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                name="question"
                autoComplete="off"
                placeholder="What has Austin built?"
                aria-label="Ask a question about Austin"
                className="min-w-0 flex-1 h-full bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
              />
              <span className="pr-3 font-mono text-[14px] text-accent-ink select-none" aria-hidden="true">)</span>
            </label>
            <button type="submit" disabled={busy || !question.trim()} className="btn btn-primary h-11 disabled:opacity-50">
              {busy ? 'Writing…' : 'Ask'}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} disabled={busy} className="chip hover:border-accent hover:text-accent-ink transition-colors disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default Ask;
