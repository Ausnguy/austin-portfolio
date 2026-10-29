import iconPaths from '../data/iconPaths';
import { metaFor } from '../data/toolIcons';
import { isDark } from './ToolIcon';

// A project's architecture as a real diagram: boxes for each part, grouped into zones, joined by arrows for what flows between them.
// Two layouts of the same data: wide (zones side by side) from large screens up, and tall (zones stacked) on phones.
const LINE = 17;
const TOOL_ROW = 34;
const nodeHeight = (n) => 50 + n.lines.length * LINE + 8 + (n.tools?.length ? TOOL_ROW : 0) + 12;

// Brand logo, or a lettered tile when the tool has no logo, drawn inside the diagram's SVG.
const Glyph = ({ name, x, y, size }) => {
  const meta = metaFor(name);
  const icon = meta.slug && iconPaths[meta.slug];
  if (icon) {
    const dark = isDark(icon.hex);
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d={icon.path} fill={dark ? 'currentColor' : icon.hex} className={dark ? 'text-ink' : undefined} />
      </svg>
    );
  }
  return (
    <g aria-hidden="true">
      <rect x={x} y={y} width={size} height={size} rx={size * 0.2} fill={meta.color ?? '#107C41'} />
      <text x={x + size / 2} y={y + size / 2 + size * 0.14} textAnchor="middle" fontSize={size * 0.42} fontWeight="700" fill={meta.ink ?? '#fff'}>
        {meta.mono}
      </text>
    </g>
  );
};

const layoutWide = ({ zones, nodes, edges }) => {
  const placed = {};
  let bottom = 0;
  zones.forEach((zone, i) => {
    let y = 70;
    zone.rect = { x: 10 + i * 345, y: 10, w: 290 };
    zone.nodes.forEach((id) => {
      const n = nodes[id];
      const h = nodeHeight(n);
      const top = n.wideY ?? y;
      placed[id] = { x: zone.rect.x + 16, y: top, w: 258, h, zone: i };
      y = top + h + 40;
      bottom = Math.max(bottom, top + h);
    });
  });
  const height = bottom + 30;
  zones.forEach((z) => {
    z.rect.h = height - 20;
  });
  const paths = edges.map((e) => {
    const a = placed[e.from];
    const b = placed[e.to];
    if (a.zone === b.zone) {
      const cx = a.x + a.w / 2;
      return { ...e, points: [[cx, a.y + a.h], [cx, b.y]] };
    }
    const x1 = a.x + a.w;
    const y1 = a.y + a.h * (e.fromAt ?? 0.5);
    const x2 = b.x;
    const y2 = b.y + b.h * (e.toAt ?? 0.5);
    const mid = (x1 + x2) / 2;
    return { ...e, points: [[x1, y1], [mid, y1], [mid, y2], [x2, y2]] };
  });
  return { width: 1000, height, placed, paths };
};

const layoutTall = ({ zones, nodes, edges }) => {
  const placed = {};
  let y = 0;
  zones.forEach((zone, i) => {
    const top = y;
    let ny = top + 58;
    zone.nodes.forEach((id) => {
      const n = nodes[id];
      const h = nodeHeight(n);
      placed[id] = { x: 26, y: ny, w: 308, h, zone: i };
      ny += h + 40;
    });
    zone.rect = { x: 1, y: top, w: 358, h: ny - 40 + 18 - top };
    y = zone.rect.y + zone.rect.h + 44;
  });
  const height = y - 44 + 2;
  const paths = edges.map((e) => {
    const a = placed[e.from];
    const b = placed[e.to];
    if (e.lane === undefined) {
      const cx = a.x + a.w / 2;
      return { ...e, points: [[cx, a.y + a.h], [cx, b.y]] };
    }
    const lane = 6 + e.lane * 9;
    const y1 = a.y + 26 + e.lane * 22;
    const y2 = b.y + 26;
    return { ...e, points: [[a.x, y1], [lane, y1], [lane, y2], [b.x, y2]] };
  });
  return { width: 360, height, placed, paths };
};

// Where an edge's label goes: beside the middle of its longest segment.
const labelSpot = (points, tall, center) => {
  let best = null;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.abs(x2 - x1) + Math.abs(y2 - y1);
    if (!best || len > best.len) best = { len, x: (x1 + x2) / 2, y: (y1 + y2) / 2, vertical: x1 === x2 };
  }
  if (center) return { x: best.x, y: best.y - 2, anchor: 'middle', stacked: true };
  if (!best.vertical) return { x: best.x, y: best.y - 7, anchor: 'middle' };
  return { x: best.x + (tall ? 10 : 9), y: best.y + 4, anchor: 'start' };
};

const Diagram = ({ spec, mode, label }) => {
  const tall = mode === 'tall';
  const model = { zones: spec.zones.map((z) => ({ ...z })), nodes: spec.nodes, edges: spec.edges };
  const { width, height, placed, paths } = tall ? layoutTall(model) : layoutWide(model);
  const id = `arch-${mode}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="w-full h-auto">
      <defs>
        <marker id={`${id}-end`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1.5L8.5 5L1 8.5z" style={{ fill: 'rgb(var(--accent))' }} />
        </marker>
        <marker id={`${id}-start`} viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M9 1.5L1.5 5L9 8.5z" style={{ fill: 'rgb(var(--accent))' }} />
        </marker>
      </defs>

      {model.zones.map((zone) => (
        <g key={zone.title}>
          {zone.hub && (
            <rect x={zone.rect.x - 3} y={zone.rect.y - 3} width={zone.rect.w + 6} height={zone.rect.h + 6} rx="12" fill="none" style={{ stroke: 'rgb(var(--accent) / 0.22)', strokeWidth: 4 }} />
          )}
          <rect
            x={zone.rect.x}
            y={zone.rect.y}
            width={zone.rect.w}
            height={zone.rect.h}
            rx="10"
            style={zone.hub ? { fill: 'rgb(var(--accent-wash) / 0.55)', stroke: 'rgb(var(--accent))', strokeWidth: 1.5 } : { fill: 'rgb(var(--head) / 0.55)', stroke: 'rgb(var(--grid))', strokeWidth: 1.2 }}
          />
          <text x={zone.rect.x + 16} y={zone.rect.y + 30} fontSize="16" fontWeight="700" className="fill-ink">{zone.title}</text>
          {zone.subtitle && <text x={zone.rect.x + 16} y={zone.rect.y + 48} fontSize="12.5" className="fill-muted">{zone.subtitle}</text>}
        </g>
      ))}

      {paths.map((e) => {
        const d = e.points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
        return (
          <g key={`${e.from}-${e.to}`}>
            <path d={d} fill="none" strokeWidth="2" strokeLinejoin="round" style={{ stroke: 'rgb(var(--accent))' }} markerEnd={`url(#${id}-end)`} markerStart={e.both ? `url(#${id}-start)` : undefined} />
          </g>
        );
      })}

      {Object.entries(placed).map(([key, p]) => {
        const n = spec.nodes[key];
        let tx = p.x + 14;
        return (
          <g key={key}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="8" style={{ fill: 'rgb(var(--paper))', stroke: 'rgb(var(--grid))', strokeWidth: 1.4 }} />
            <text x={p.x + 14} y={p.y + 30} fontSize="16" fontWeight="700" className="fill-ink">{n.name}</text>
            {n.lines.map((line, i) => (
              <text key={line} x={p.x + 14} y={p.y + 54 + i * LINE} fontSize="13" className="fill-ink-soft">{line}</text>
            ))}
            {n.tools?.map((tool) => {
              const x = tx;
              const name = metaFor(tool).label;
              tx += 28 + name.length * 6.6 + 12;
              const y = p.y + p.h - 12 - 22;
              return (
                <g key={tool}>
                  <Glyph name={tool} x={x} y={y} size={22} />
                  <text x={x + 28} y={y + 15.5} fontSize="12.5" fontWeight="500" className="fill-ink-soft">{name}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {paths.map((e) => {
        if (!e.label) return null;
        const spot = labelSpot(e.points, tall, e.labelCenter);
        const words = spot.stacked ? e.label.split(' ') : [e.label];
        return (
          <text key={`label-${e.from}-${e.to}`} x={spot.x} y={spot.y - (words.length - 1) * 7} textAnchor={spot.anchor} fontSize="12" fontWeight="600" className="fill-accent-ink" style={{ paintOrder: 'stroke', stroke: 'rgb(var(--paper))', strokeWidth: 4, strokeLinejoin: 'round' }}>
            {words.map((w, i) => (
              <tspan key={w} x={spot.x} dy={i ? 14 : 0}>{w}</tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
};

const Architecture = ({ spec, caption, label }) => (
  <figure>
    <div className="hidden lg:block"><Diagram spec={spec} mode="wide" label={label} /></div>
    <div className="lg:hidden mx-auto max-w-[420px]"><Diagram spec={spec} mode="tall" label={label} /></div>
    {caption && <figcaption className="mt-3 text-[13px] text-muted">{caption}</figcaption>}
  </figure>
);

export default Architecture;
