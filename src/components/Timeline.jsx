import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../lib/motion';

// 'YYYY-MM' -> months since year 0, so ranges can be placed on one linear axis.
const toMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const TODAY = new Date();
const todayMonth = TODAY.getFullYear() * 12 + TODAY.getMonth() + TODAY.getDate() / 31;

// Gantt-style chart of roles on a shared time axis. Each row's hit target is the full row.
const Timeline = ({ rows }) => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(null);

  const sorted = [...rows].sort((a, b) => toMonth(a.start) - toMonth(b.start));
  const domainStart = Math.min(...sorted.map((r) => toMonth(r.start))) - 1;
  const domainEnd = Math.ceil(todayMonth) + 1;
  const span = domainEnd - domainStart;
  const pct = (m) => `${((m - domainStart) / span) * 100}%`;

  const years = [];
  for (let y = Math.ceil(domainStart / 12); y * 12 <= domainEnd; y += 1) years.push(y);

  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] sm:grid-cols-[11rem_minmax(0,1fr)]">
      {/* Row labels */}
      <div>
        {sorted.map((row, i) => (
          <div
            key={row.label}
            className={`h-10 flex items-center pr-3 text-xs sm:text-sm leading-tight transition-colors ${
              active === i ? 'text-ink font-semibold' : 'text-ink-soft'
            }`}
          >
            {row.label}
          </div>
        ))}
        <div className="h-8" />
      </div>

      {/* Plot */}
      <div className="relative">
        {years.map((y) => (
          <div key={y} className="absolute top-0 bottom-0" style={{ left: pct(y * 12) }}>
            <div className="absolute top-0 bottom-8 w-px bg-grid" />
            <div className="absolute bottom-0 h-8 flex items-end -translate-x-1/2 text-xs text-muted tabular-nums">
              {y}
            </div>
          </div>
        ))}

        <div className="absolute top-0 bottom-0" style={{ left: pct(todayMonth) }}>
          <div className="absolute top-0 bottom-8 border-l border-dashed border-ink-soft/50" />
          <div className="absolute bottom-0 h-8 flex items-end -translate-x-1/2 text-xs font-semibold text-ink">
            Today
          </div>
        </div>

        {sorted.map((row, i) => {
          const start = toMonth(row.start);
          const end = row.end ? Math.min(toMonth(row.end) + 1, todayMonth) : todayMonth;
          const isActive = active === i;
          return (
            <div
              key={row.label}
              tabIndex={0}
              role="img"
              aria-label={`${row.label}: ${row.detail}, ${row.period}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="relative h-10 outline-offset-0"
            >
              <motion.div
                className="absolute top-1/2 -mt-[7px] h-3.5 min-w-[10px] rounded-[4px] bg-accent"
                style={{ left: pct(start), width: `${((end - start) / span) * 100}%`, transformOrigin: 'left center' }}
                initial={reduceMotion ? { opacity: 0 } : { transform: 'scaleX(0)' }}
                whileInView={reduceMotion ? { opacity: 1 } : { transform: 'scaleX(1)' }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE_OUT }}
              />
              {isActive && (
                <div
                  className={`absolute ${i < 2 ? 'top-[calc(50%+12px)]' : 'bottom-[calc(50%+12px)]'} z-10 w-max max-w-[min(16rem,100%)] rounded border border-grid bg-paper px-3 py-2 shadow-lg text-left pointer-events-none`}
                  style={
                    start - domainStart > span / 2
                      ? { right: `calc(100% - ${pct(end)})` }
                      : { left: `min(${pct(start)}, calc(100% - min(16rem, 100%)))` }
                  }
                >
                  <div className="text-sm font-semibold text-ink leading-snug">{row.detail}</div>
                  <div className="text-xs text-muted mt-0.5">{row.period}</div>
                </div>
              )}
            </div>
          );
        })}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default Timeline;
