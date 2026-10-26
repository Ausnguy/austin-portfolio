import { useState } from 'react';
import { Link } from 'react-router-dom';
import ToolIcon from '../components/ToolIcon';
import { metaFor } from '../data/toolIcons';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { stack, resumeOnly, resolveWhere } from '../data/stack';
import { profile } from '../data/profile';

// What a tool did, shown under its grid when you pick it.
const ToolDetail = ({ tool }) => (
  <div className="mt-3 rounded-sm border border-grid bg-head/60 p-4" aria-live="polite">
    <h3 className="font-sans text-[15.5px] font-bold text-ink">{tool.name}</h3>
    <ul className="mt-1.5 space-y-2">
      {tool.uses.map((use) => {
        const where = resolveWhere(use.where);
        return (
          <li key={use.where} className="text-[14px] leading-snug text-ink-soft">
            <Link to={where.to} className="link text-[13.5px]">{where.label}</Link>
            {use.team && <span className="ml-1.5 text-[11.5px] font-medium text-muted">(team)</span>}
            <span className="text-muted"> · </span>
            {use.did}
          </li>
        );
      })}
    </ul>
  </div>
);

const ToolGrid = ({ tools }) => {
  const [picked, setPicked] = useState(tools[0].name);
  const current = tools.find((t) => t.name === picked) ?? tools[0];
  return (
    <>
      <div className="mt-3 sm:mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 border-l border-t border-grid">
        {tools.map((tool) => {
          const active = tool.name === current.name;
          return (
            <button
              key={tool.name}
              type="button"
              onClick={() => setPicked(tool.name)}
              aria-pressed={active}
              className={`flex flex-col items-center justify-center gap-2.5 border-b border-r border-grid px-2 py-5 sm:py-6 text-center transition-colors duration-150 ${
                active ? 'bg-accent-wash/60 shadow-[inset_0_0_0_2px_rgb(var(--accent))]' : 'bg-paper hover:bg-head/70'
              }`}
            >
              <ToolIcon name={tool.name} />
              <span className="text-[13px] leading-tight text-ink-soft">{metaFor(tool.name).label}</span>
            </button>
          );
        })}
      </div>
      <ToolDetail tool={current} />
    </>
  );
};

const Skills = () => {
  useSheet('A1', '=STACK()', 'Skills & Education');

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula="=STACK()">
          <h1 className="sheet-title">Skills &amp; Education</h1>
          <p className="body-copy mt-2 max-w-2xl">
            Pick a tool to see what I used it for, and where. Team work is marked.
          </p>
        </Cell>
      </Row>

      {stack.map(({ discipline, tools }, i) => (
        <Row key={discipline}>
          <Cell id={`A${i + 2}`} formula={`=STACK("${discipline}")`}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-sans text-xl font-bold text-ink">{discipline}</h2>
              <span className="text-[13px] text-muted">{tools.length} tools</span>
            </div>
            <ToolGrid tools={tools} />
          </Cell>
        </Row>
      ))}

      <Row>
        <Cell id="A8" formula="=RESUME_ONLY()">
          <h2 className="font-sans text-[16px] font-bold text-ink">Also on my resume</h2>
          <p className="mt-1 text-[14px] text-muted">Skills I list that aren’t shown in a project on this site yet.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {resumeOnly.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </Cell>
      </Row>

      {/* Education */}
      <Row>
        <Cell id="A9" formula='=SCHOOL("University of Houston")'>
          <div className="text-[13px] font-semibold text-accent-ink">Education</div>
          <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-bold leading-tight text-ink">{profile.school}</h2>
          <p className="mt-1.5 text-[16px] text-ink-soft">{profile.degree}</p>

          <dl className="mt-5 grid grid-cols-3 gap-px bg-grid border border-grid rounded-sm overflow-hidden">
            {[
              ['GPA', profile.gpa],
              ['Graduating', profile.graduation],
              ['Dean’s List', profile.deansList],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper p-3 sm:p-4">
                <dt className="text-[12.5px] text-muted">{k}</dt>
                <dd className="mt-1 text-[17px] sm:text-xl font-bold leading-tight text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 font-sans text-[15px] font-bold text-ink">Relevant coursework</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.coursework.map((c) => <span key={c} className="chip">{c}</span>)}
          </div>

          <h3 className="mt-6 font-sans text-[15px] font-bold text-ink">Certifications</h3>
          <ul className="mt-2 divide-y divide-grid border-y border-grid">
            {profile.certifications.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-3 py-2.5 text-[15px]">
                <span className="font-medium text-ink">{c.name}</span>
                <span className="text-[13px] text-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </Cell>
      </Row>

      <Row>
        <Cell id="A10" span="col-span-12 md:col-span-6" formula="=AWARDS()">
          <h3 className="font-sans text-[16px] font-bold text-ink">Scholarships</h3>
          <ul className="mt-3 divide-y divide-grid border-y border-grid">
            {profile.scholarships.map((s) => <li key={s} className="py-2.5 text-[15px] text-ink">{s}</li>)}
          </ul>
        </Cell>
        <Cell id="G10" span="col-span-12 md:col-span-6" formula="=PROGRAMS()">
          <h3 className="font-sans text-[16px] font-bold text-ink">Selective programs</h3>
          <ul className="mt-3 divide-y divide-grid border-y border-grid">
            {[
              'Bloomberg Decoded: Data, 1 of 35 from 500+ applicants',
              'Carnegie Mellon Tepper Business Analytics Summer Summit',
              'CaseQuest 2026, sponsored by ConocoPhillips',
            ].map((s) => <li key={s} className="py-2.5 text-[15px] text-ink">{s}</li>)}
          </ul>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default Skills;
