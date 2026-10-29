import ToolIcon from './ToolIcon';
import { metaFor } from '../data/toolIcons';

// A project's architecture as labelled zones with the real tools in each box, and arrows for what flows between zones.
// Left to right on wide screens, top to bottom on phones. The middle zone is the highlighted hub.
const Arrow = ({ label, both }) => (
  <div className="flex lg:flex-col items-center justify-center gap-1.5 py-1 lg:py-0 text-center" aria-hidden="true">
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-accent rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2">
      {both ? <path d="M3 12h18M8 7l-5 5 5 5M16 7l5 5-5 5" /> : <path d="M4 12h15M14 6l6 6-6 6" />}
    </svg>
    {label && <span className="max-w-[9rem] text-[11.5px] leading-tight text-muted">{label}</span>}
  </div>
);

const Node = ({ node }) => (
  <li className="rounded-sm border border-grid bg-paper p-3">
    <h4 className="font-sans text-[14.5px] font-bold leading-snug text-ink">{node.name}</h4>
    <p className="mt-1 text-[13px] leading-snug text-ink-soft">{node.detail}</p>
    {node.tools?.length > 0 && (
      <ul className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-2">
        {node.tools.map((tool) => (
          <li key={tool} className="flex items-center gap-1.5">
            <ToolIcon name={tool} size={22} />
            <span className="text-[12.5px] font-medium text-ink-soft">{metaFor(tool).label}</span>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const Zone = ({ zone }) => (
  <section
    className={`rounded-sm border p-3.5 ${zone.hub ? 'border-accent bg-accent-wash/50 shadow-[0_0_0_3px_rgb(var(--accent)/0.12)]' : 'border-grid bg-head/50'}`}
    aria-label={zone.title}
  >
    <h3 className="font-sans text-[15px] font-bold text-ink">{zone.title}</h3>
    {zone.subtitle && <p className="text-[12.5px] text-muted">{zone.subtitle}</p>}
    <ul className="mt-3 flex flex-col gap-2.5">
      {zone.nodes.map((node) => (
        <Node key={node.name} node={node} />
      ))}
    </ul>
  </section>
);

const Architecture = ({ zones, links = [] }) => (
  <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 lg:gap-3 lg:items-stretch">
    {zones.map((zone, i) => (
      <div key={zone.title} className="contents">
        {i > 0 && <Arrow label={links[i - 1]?.label} both={links[i - 1]?.both} />}
        <Zone zone={zone} />
      </div>
    ))}
  </div>
);

export default Architecture;
