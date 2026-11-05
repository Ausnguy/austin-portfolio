import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Cell } from './workbook';
import { checkFit } from '../ask/jobfit';
import { trackEvent } from '../lib/track';

// Paste a job description, see which of its skills Austin's work on this site shows. Runs in the browser only.
const STATUS = {
  shown: { mark: '✓', label: 'Shown', className: 'text-accent-ink bg-accent-wash' },
  resume: { mark: '~', label: 'On resume', className: 'text-[#8A5A00] bg-[#FCF4E3] dark:text-[#F2C14E] dark:bg-[#2A2417]' },
  missing: { mark: '–', label: 'Not shown', className: 'text-muted bg-head' },
};

// `row` is the sheet row this section starts on, so its cell names continue the Ask sheet's.
const JobFit = ({ row: first }) => {
  const [posting, setPosting] = useState('');
  const [result, setResult] = useState(null);

  const run = (e) => {
    e.preventDefault();
    if (!posting.trim()) return;
    trackEvent('jobfit');
    setResult(checkFit(posting));
  };

  return (
    <>
      <Row>
        <Cell id={`A${first}`} formula="=MATCH(job_description, workbook)">
          <h2 id="fit" className="scroll-mt-32 font-sans text-xl font-bold text-ink">Check a job against Austin’s work</h2>
          <p className="body-copy mt-1 max-w-2xl">
            Paste a job description. Each skill it asks for is matched to where Austin used it, from the Skills sheet. It runs in your
            browser: the posting isn’t sent anywhere or stored.
          </p>
          <form onSubmit={run} className="mt-4">
            <label htmlFor="posting" className="sr-only">Job description</label>
            <textarea
              id="posting"
              value={posting}
              onChange={(e) => setPosting(e.target.value)}
              rows={6}
              maxLength={20000}
              placeholder="Paste the job description here…"
              className="w-full rounded border border-grid bg-paper p-3 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={!posting.trim()} className="btn btn-primary h-11 disabled:opacity-50">Check fit</button>
              {result && (
                <button type="button" onClick={() => { setPosting(''); setResult(null); }} className="btn btn-secondary h-11">Clear</button>
              )}
            </div>
          </form>
        </Cell>
      </Row>

      {result && (
        <div aria-live="polite">
          <Row>
            <Cell id={`A${first + 1}`} formula={`=COUNTIF(fit, "shown") / ${result.rows.length}`}>
              {result.rows.length ? (
                <p className="text-[17px] font-semibold text-ink">
                  This site shows evidence for {result.shown} of the {result.rows.length} skills the posting mentions.
                </p>
              ) : (
                <p className="body-copy">
                  No skills from the checklist turned up in that text. Try pasting the requirements section, or ask a question above.
                </p>
              )}
            </Cell>
          </Row>
          {result.rows.map((row, i) => {
            const s = STATUS[row.status];
            return (
              <Row key={row.label}>
                <Cell id={`A${first + 2 + i}`} span="col-span-12 sm:col-span-4" formula={`=XLOOKUP("${row.label}", skills)`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-sm px-1.5 text-[13px] font-bold ${s.className}`} aria-hidden="true">
                      {s.mark}
                    </span>
                    <span className="text-[15.5px] font-semibold text-ink">{row.label}</span>
                  </div>
                  <span className="mt-1 block text-[13px] text-muted">{s.label}</span>
                </Cell>
                <Cell id={`E${first + 2 + i}`} span="col-span-12 sm:col-span-8" formula={`=EVIDENCE("${row.label}")`}>
                  {row.status === 'shown' ? (
                    <ul className="space-y-1.5">
                      {row.evidence.map((ev) => (
                        <li key={ev.label + ev.did} className="text-[15px] leading-snug text-ink-soft">
                          <Link to={ev.to} className="link font-semibold">{ev.label}</Link>
                          {ev.team && <span className="text-muted"> (team)</span>}: {ev.did}
                        </li>
                      ))}
                    </ul>
                  ) : row.status === 'resume' ? (
                    <p className="text-[15px] text-ink-soft">Listed on Austin’s resume, but no project on this site shows it yet.</p>
                  ) : (
                    <p className="text-[15px] text-ink-soft">Not shown on this site.</p>
                  )}
                </Cell>
              </Row>
            );
          })}
        </div>
      )}
    </>
  );
};

export default JobFit;
