import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { search, factCount } from '../ask/retrieve';
import { buildMessages } from '../ask/prompt';
import { groundAnswer } from '../ask/ground';
import { lookupSkill } from '../ask/lookup';
import { useLocalModel, MODEL_NAME, MODEL_DOWNLOAD_MB } from '../ask/model';
import { profile } from '../data/profile';

export const SUGGESTIONS = [
  'What has Austin built?',
  'What is Austin’s tech stack?',
  'Tell me about Parvius',
  'Where does Austin go to school?',
  'Does Austin know Kafka?',
  'How do I contact Austin?',
];

const Sources = ({ facts }) => (
  <div className="mt-3 flex flex-wrap items-center gap-1.5">
    <span className="text-[12.5px] text-muted mr-1">Sources</span>
    {[...new Map(facts.map((f) => [f.ref, f])).values()].map((f) => (
      <span key={f.ref} title={f.text} className="font-mono text-[12px] px-1.5 py-0.5 rounded-sm bg-head border border-grid text-ink-soft">
        {f.ref}
      </span>
    ))}
  </div>
);

const onPhone = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const ModelStatus = ({ model }) => {
  if (model.status === 'ready') {
    return (
      <p className="text-sm text-ink-soft">
        <span className="inline-block h-2 w-2 rounded-full bg-accent mr-2 align-middle" />
        AI answers are on, running {MODEL_NAME} on {model.device === 'webgpu' ? 'your GPU' : 'your CPU'}. Nothing you type
        leaves this page.
      </p>
    );
  }
  if (model.status === 'loading') {
    const pct = Math.round(model.progress * 100);
    return (
      <div className="max-w-md">
        <p className="text-sm text-ink-soft">Downloading the model to your browser… {pct}%</p>
        <div className="mt-2 h-2 rounded-sm bg-head border border-grid overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Model download">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button type="button" onClick={model.load} className="btn btn-primary">
        {model.status === 'error' ? 'Try loading the AI again' : 'Turn on AI answers'}
      </button>
      <p className="text-sm text-muted max-w-xl">
        {model.status === 'error'
          ? `The model couldn’t load here (${model.error}). Answers straight from the workbook still work.`
          : `Downloads ${MODEL_NAME} once (about ${MODEL_DOWNLOAD_MB} MB) and runs it on your device. Nothing you type leaves this page.${
              onPhone ? ' On a phone it can be slow or run out of memory; answers straight from the workbook always work.' : ''
            }`}
      </p>
    </div>
  );
};

const Ask = () => {
  useSheet('A1', '=ASK("anything about Austin")');
  const model = useLocalModel();
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
    // "Does Austin know X?" is answered exactly from the data, no model needed.
    const lookup = lookupSkill(text);
    if (lookup) {
      setEntries((prev) => [...prev, { id: Date.now(), q: text, facts: lookup.facts, mode: 'lookup', term: lookup.term, answer: lookup.answer, done: true }]);
      return;
    }
    const facts = search(text, 6);
    const useModel = model.status === 'ready' && facts.length > 0;
    const id = Date.now();
    setEntries((prev) => [...prev, { id, q: text, facts, mode: useModel ? 'ai' : 'facts', answer: '', done: !useModel }]);
    if (!useModel) return;

    setBusy(true);
    const update = (patch) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch(e) } : e)));
    try {
      let draft = '';
      await model.generate(buildMessages(text, facts), (token) => {
        draft += token;
      });
      // Only sentences the facts support are shown; otherwise fall back to the facts themselves.
      const grounded = groundAnswer(draft, facts, { question: text });
      if (grounded.refused) {
        update(() => ({ mode: 'facts', done: true, note: 'The model couldn’t answer that from the workbook, so here is what it says directly.' }));
      } else if (!grounded.text) {
        update(() => ({ mode: 'facts', done: true, note: 'The model’s answer went beyond the workbook, so here are the facts instead.' }));
      } else {
        update(() => ({ answer: grounded.text, done: true }));
      }
    } catch (err) {
      update(() => ({ mode: 'facts', done: true, error: err.message }));
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
            this workbook, and every answer shows the cells it used.
          </p>
          <div className="mt-5">
            <ModelStatus model={model} />
          </div>
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
                  ? `=GENERATE(${MODEL_NAME.replaceAll(' ', '_')}, facts)`
                  : entry.mode === 'lookup'
                    ? `=XLOOKUP("${entry.term}", workbook)`
                    : '=LOOKUP(question, facts)'
              }>
              <div className="cell-ref mb-1">
                {entry.mode === 'ai' ? 'Answer, written by the local model' : entry.mode === 'lookup' ? 'Looked up in the workbook' : 'Straight from the workbook'}
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
              {entry.error && <p className="mt-2 text-sm text-muted">The model stopped early ({entry.error}), so these are the matching facts instead.</p>}
              {entry.facts.length > 0 && <Sources facts={entry.facts.slice(0, entry.mode === 'ai' ? 4 : 3)} />}
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
