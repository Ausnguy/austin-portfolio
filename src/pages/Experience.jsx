import Timeline from '../components/Timeline';
import { Sheet, Row, Cell, useSheet } from '../components/workbook';
import { experiences } from '../data/experience';
import { getSpotlightProject } from '../data/projects';

const Experience = () => {
  useSheet('A1', '=SORT(roles, start_date, -1)');
  const spotlight = getSpotlightProject();

  const timelineRows = [
    ...experiences.map((exp) => ({
      label: exp.shortName,
      detail: `${exp.role}, ${exp.company}`,
      period: exp.period,
      start: exp.start,
      end: exp.end,
    })),
    {
      label: 'CaseQuest 2026',
      detail: `${spotlight.shortTitle}, built with a team of ${spotlight.team.length} for a ConocoPhillips-sponsored case competition`,
      period: 'October 23–24, 2026',
      start: '2026-10',
      end: '2026-10',
    },
  ];

  return (
    <Sheet>
      <Row>
        <Cell id="A1" formula="=SORT(roles, start_date, -1)">
          <h1 className="sheet-title">Experience</h1>
          <p className="body-copy mt-2 max-w-2xl">
            Internships, selective programs and the business I ran. Hover or tap the chart for dates.
          </p>
        </Cell>
      </Row>
      <Row>
        <Cell id="A2" formula="=CHART(roles, GANTT)">
          <figure>
            <figcaption className="mb-4 text-sm text-muted">
              <strong className="text-ink font-semibold">Chart 1.</strong> Where I’ve worked and competed, 2023 to today.
            </figcaption>
            <Timeline rows={timelineRows} />
          </figure>
        </Cell>
      </Row>
      {experiences.map((exp, i) => (
        <Row key={exp.id}>
          <Cell id={`A${i + 3}`} span="col-span-12 lg:col-span-3" formula={`=ROLE("${exp.shortName}")`} className="!pb-1 lg:!pb-6">
            <div className="font-mono text-[13px] text-ink-soft">{exp.period}</div>
            <div className="mt-1 text-[13px] text-muted">{exp.location}</div>
            <div className="mt-2 inline-flex chip">{exp.type}</div>
          </Cell>
          <Cell id={`D${i + 3}`} span="col-span-12 lg:col-span-9" formula={`=ROLE("${exp.shortName}")`} className="!pt-2 lg:!pt-6">
            <h2 className="font-sans text-xl font-bold leading-snug text-ink">{exp.company}</h2>
            <p className="mt-0.5 text-[15px] font-medium text-accent-ink">{exp.role}</p>
            <ul className="mt-3 space-y-2 max-w-3xl">
              {exp.highlights.map((h) => (
                <li key={h} className="relative pl-4 body-copy">
                  <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {exp.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Cell>
        </Row>
      ))}
    </Sheet>
  );
};

export default Experience;
