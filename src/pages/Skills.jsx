import { Link } from 'react-router-dom';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { stack, resumeOnly, resolveWhere } from '../data/stack';
import { profile } from '../data/profile';

const Skills = () => {
  useSheet('A1', '=STACK()', 'Skills & Education');

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula="=STACK()">
          <h1 className="sheet-title">Skills &amp; Education</h1>
          <p className="body-copy mt-2 max-w-2xl">
            Every tool here is tied to a project or role that used it, and what it did there. Team work is marked.
          </p>
        </Cell>
      </Row>

      <Row>
        <Cell id="A2" formula="=TABLE(stack)" pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-head text-[12.5px] text-muted">
                  {['Tool', 'Where', 'What it did'].map((h) => (
                    <th key={h} scope="col" className="border-b border-r last:border-r-0 border-grid px-4 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              {stack.map(({ discipline, tools }) => (
                <tbody key={discipline}>
                  <tr>
                    <th colSpan={3} scope="colgroup" className="bg-accent-wash/50 border-b border-grid px-4 py-2 text-[13px] font-semibold text-accent-ink">
                      {discipline}
                    </th>
                  </tr>
                  {tools.flatMap((tool) =>
                    tool.uses.map((use, i) => {
                      const where = resolveWhere(use.where);
                      return (
                        <tr key={`${tool.name}-${use.where}`} className="align-top">
                          <td className="border-b border-r border-grid px-4 py-2.5 font-semibold text-ink">{i === 0 ? tool.name : ''}</td>
                          <td className="border-b border-r border-grid px-4 py-2.5 whitespace-nowrap">
                            <Link to={where.to} className="link font-medium">{where.label}</Link>
                            {use.team && <span className="ml-1.5 text-[12px] text-muted">team</span>}
                          </td>
                          <td className="border-b border-grid px-4 py-2.5 text-ink-soft">{use.did}</td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              ))}
            </table>
          </div>
          <p className="px-4 py-3 text-[13.5px] text-muted">
            <span className="font-semibold text-ink-soft">Also on my resume, not shown in a project here yet: </span>
            {resumeOnly.join(', ')}
          </p>
        </Cell>
      </Row>

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
