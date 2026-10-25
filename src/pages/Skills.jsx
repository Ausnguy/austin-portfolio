import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { skillGroups, getGroupEvidence } from '../data/skills';
import { profile } from '../data/profile';

const Skills = () => {
  useSheet('A1', '=STACK()');

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula="=STACK()">
          <h1 className="sheet-title">Skills &amp; Education</h1>
          <p className="body-copy mt-2 max-w-2xl">
            What I work with, and where I’ve actually used it. The “used in” column is worked out from my experience and
            project data, not typed by hand.
          </p>
        </Cell>
      </Row>

      {/* Column headers for the skills table */}
      <Row rowClassName="hidden lg:grid">
        <Cell id="A2" span="col-span-3" pad={false} formula="=HEADER()" className="px-6 py-2 bg-head/60 text-[13px] font-semibold text-muted">Group</Cell>
        <Cell id="D2" span="col-span-6" pad={false} formula="=HEADER()" className="px-6 py-2 bg-head/60 text-[13px] font-semibold text-muted">Skills</Cell>
        <Cell id="J2" span="col-span-3" pad={false} formula="=HEADER()" className="px-6 py-2 bg-head/60 text-[13px] font-semibold text-muted">Used in</Cell>
      </Row>
      {skillGroups.map(({ group, skills }, i) => {
        const used = getGroupEvidence(skills);
        const formula = `=XLOOKUP("${group}", experience, projects)`;
        return (
          <Row key={group}>
            <Cell id={`A${i + 3}`} span="col-span-12 lg:col-span-3" formula={formula} className="!pb-2 lg:!pb-6">
              <h2 className="font-sans text-base font-bold text-ink">{group}</h2>
            </Cell>
            <Cell id={`D${i + 3}`} span="col-span-12 lg:col-span-6" formula={formula} className="!py-2 lg:!py-6">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </Cell>
            <Cell id={`J${i + 3}`} span="col-span-12 lg:col-span-3" formula={formula} className="!pt-2 lg:!pt-6">
              <p className="text-[14px] leading-relaxed text-ink-soft">
                <span className="lg:hidden text-muted">Used in: </span>
                {used.length ? used.join(', ') : 'Coursework and personal study'}
              </p>
            </Cell>
          </Row>
        );
      })}

      {/* Education */}
      <Row>
        <Cell id="A10" span="col-span-12 lg:col-span-8" formula='=SCHOOL("University of Houston")' className="lg:!p-8">
          <div className="text-[13px] text-muted">Education</div>
          <h2 className="mt-1 font-sans text-2xl font-bold leading-snug text-ink">{profile.school}</h2>
          <p className="mt-1 text-[16px] text-ink-soft">{profile.degree}, {profile.graduation}</p>
          <div className="mt-6 grid grid-cols-2 gap-px bg-grid border border-grid max-w-lg">
            <div className="bg-paper p-4">
              <div className="text-[13px] text-muted">GPA</div>
              <div className="mt-0.5 text-3xl font-bold text-ink">{profile.gpa}</div>
            </div>
            <div className="bg-paper p-4">
              <div className="text-[13px] text-muted">Dean’s List</div>
              <div className="mt-1.5 text-[17px] font-semibold text-ink">{profile.deansList}</div>
            </div>
          </div>
          <div className="mt-6 text-[13px] text-muted">Relevant coursework</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.coursework.map((c) => <span key={c} className="chip">{c}</span>)}
          </div>
        </Cell>
        <Cell id="I10" span="col-span-12 lg:col-span-4" formula="=AWARDS()" className="lg:!p-8">
          <div className="text-[13px] text-muted">Scholarships</div>
          <ul className="mt-2 space-y-2 text-[15.5px] text-ink">
            {profile.scholarships.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="mt-6 text-[13px] text-muted">Selective programs</div>
          <ul className="mt-2 space-y-2 text-[15.5px] text-ink">
            <li>Bloomberg Decoded: Data, 1 of 35 from 500+ applicants</li>
            <li>Carnegie Mellon Tepper Business Analytics Summer Summit</li>
            <li>CaseQuest 2026, sponsored by ConocoPhillips</li>
          </ul>
        </Cell>
      </Row>
    </Sheet>
  );
};

export default Skills;
