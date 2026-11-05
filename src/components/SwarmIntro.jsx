import { useEffect } from 'react';
import { useWorkbook } from './workbook';

// First load of a session: co-author cursors fly in, Excel-style, and build the visible cells.
// Each load is different: curved paths, shuffled order and timing, and a mix of Excel moves:
//   drag   click a corner and drag the selection across
//   copy   marching ants (copy), then the paste lands
//   type   the cursor turns into an I-beam and the formula types out
//   fill   one cursor drags the fill handle along a whole row (autofill); each cell shows its formula, then its value
// The working cursors are named after the tools on the Skills sheet, a few more buzz past, and at the end they all fly off.
// The Name Box and formula bar follow along, and the status bar counts up like a recalc.
// index.html adds `swarm` to <html> before first paint (and removes it after 4s regardless), which starts cells faint.
// Plain DOM and WAAPI so nothing re-renders per frame. Any click, key or scroll finishes it at once.
const COLORS = ['#107C41', '#2B7CD3', '#7A4FC4', '#0F8B8D', '#C27C0E', '#5B6CF0'];
const MAX_CELLS = 9;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const HOLD = 260;
const EXIT = 420;
// Tools from the Skills sheet, used as the co-authors' names.
const NAMES = ['Python', 'SQL', 'pandas', 'Spark', 'Kafka', 'Power BI', 'Excel', 'PyTorch', 'Tableau'];
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchmove'];

// Excel's fat cross, outlined in the co-author's color (center is the hotspot), and the text I-beam.
const CROSS =
  '<svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><path d="M7 1.5h6v5.5h5.5v6H13v5.5H7V13H1.5V7H7z" fill="#fff" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
const BEAM =
  '<svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true"><path d="M7 2.5h6M7 17.5h6M10 2.5v15" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/><path d="M7 2.5h6M7 17.5h6M10 2.5v15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

const rand = (min, max) => min + Math.random() * (max - min);
const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const inView = (el) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

const el = (tag, className, parent) => {
  const node = document.createElement(tag);
  node.className = className;
  parent.appendChild(node);
  return node;
};

const at = ([x, y]) => ({ transform: `translate(${x}px, ${y}px)` });

// A point just off-screen in a random direction.
const offscreen = () => {
  const angle = Math.random() * Math.PI * 2;
  const reach = Math.max(window.innerWidth, window.innerHeight) * 0.75;
  return [window.innerWidth / 2 + Math.cos(angle) * reach, window.innerHeight / 2 + Math.sin(angle) * reach];
};

// Points along a gentle curve from a to b, bowed to one side by a random amount.
const arc = (a, b) => {
  const bend = rand(-0.35, 0.35);
  const c = [(a[0] + b[0]) / 2 - (b[1] - a[1]) * bend, (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend];
  return [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => {
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
  });
};

// Rows of cells (same top edge); one row of three or more becomes the autofill, everything else gets a single move.
const plan = (cells) => {
  const rows = [];
  cells.forEach((cell) => {
    const top = Math.round(cell.getBoundingClientRect().top);
    const row = rows.find((r) => Math.abs(r.top - top) < 4);
    if (row) row.cells.push(cell);
    else rows.push({ top, cells: [cell] });
  });
  const fillRow = rows.find((r) => r.cells.length >= 3);
  const moves = shuffle(['drag', 'copy', 'type']);
  const singles = cells.filter((c) => !fillRow?.cells.includes(c)).map((c, i) => ({ kind: moves[i % moves.length], cells: [c] }));
  // The first cell (the hero) always goes first; the rest arrive in a new order every load.
  const [first, ...rest] = singles;
  return [first, ...shuffle([...rest, ...(fillRow ? [{ kind: 'fill', cells: fillRow.cells }] : [])])].filter(Boolean);
};

const SwarmIntro = ({ onStatus }) => {
  const { setPeek } = useWorkbook();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('swarm')) return undefined;
    try {
      sessionStorage.setItem('built', '1');
    } catch {
      // Storage blocked: the intro may replay next load, which is harmless.
    }

    const layer = el('div', 'swarm-layer', document.body);
    layer.setAttribute('aria-hidden', 'true');
    // Phones have no formula bar or status bar, so they get a small one of their own for the intro.
    const fx = el('div', 'swarm-fx', layer);
    const fxRef = el('b', '', fx);
    el('i', '', fx).textContent = 'fx';
    const fxFormula = el('span', '', fx);
    const fxPct = el('em', '', fx);

    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      SKIP_EVENTS.forEach((e) => window.removeEventListener(e, finish));
      root.classList.remove('swarm');
      layer.remove();
      setPeek(null);
      onStatus('Ready');
    };
    SKIP_EVENTS.forEach((e) => window.addEventListener(e, finish, { passive: true }));

    const run = (cells) => {
      let built = 0;
      const total = cells.length;
      const show = (ref, formula) => {
        setPeek({ ref, formula });
        fxRef.textContent = ref;
        fxFormula.textContent = formula;
      };
      const reveal = (cell) => {
        cell.classList.add('is-built');
        built += 1;
        const pct = `${Math.round((built / total) * 100)}%`;
        onStatus(`Calculating (${total} cells): ${pct}`);
        fxPct.textContent = pct;
      };
      const boxOver = (r, color, ref) => {
        const box = el('div', 'swarm-box', layer);
        box.style.setProperty('--c', color);
        Object.assign(box.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
        box.innerHTML = `<span>${ref}</span>`;
        return box;
      };
      // Show Formulas, then the value: the formula sits over the cell for a moment, then gives way to what it computes.
      const flashFormula = (cell, color) => {
        const cr = cell.getBoundingClientRect();
        const label = el('div', 'swarm-formula', layer);
        label.style.setProperty('--c', color);
        Object.assign(label.style, { left: `${cr.left + 2}px`, top: `${cr.top + 2}px`, width: `${cr.width - 4}px`, height: `${cr.height - 4}px` });
        label.textContent = cell.dataset.formula ?? '';
        label.animate([{ opacity: 1 }, { opacity: 1, offset: 0.78 }, { opacity: 0 }], { duration: 560, fill: 'forwards' });
      };
      const click = (agent) => agent.firstChild.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.78)' }, { transform: 'scale(1)' }], { duration: 170 });

      // Extra cursors that just buzz across the sheet, for the swarm.
      const extras = window.innerWidth < 768 ? 5 : 12;
      for (let n = 0; n < extras; n++) {
        const bee = el('div', 'swarm-agent is-bee', layer);
        bee.style.setProperty('--c', COLORS[n % COLORS.length]);
        bee.innerHTML = CROSS;
        const via = [rand(0.1, 0.9) * window.innerWidth, rand(0.15, 0.85) * window.innerHeight];
        bee.animate([...arc(offscreen(), via), ...arc(via, offscreen()).slice(1)].map(at), {
          duration: rand(1100, 1700),
          delay: rand(0, 500),
          easing: 'ease-in-out',
          fill: 'both',
        });
      }

      const workers = [];
      const names = shuffle(NAMES);
      let start = 0;
      let end = 0;
      plan(cells).forEach((task, i) => {
        const [cell] = task.cells;
        const r = cell.getBoundingClientRect();
        const color = COLORS[i % COLORS.length];
        const corner = [r.left + 8, r.top + 8];
        const flight = rand(460, 640);
        const arrive = start + flight;

        const agent = el('div', 'swarm-agent', layer);
        agent.style.setProperty('--c', color);
        agent.innerHTML = `${CROSS}<span>${names[i % names.length]}</span>`;
        agent.animate(arc(offscreen(), corner).map(at), { duration: flight, delay: start, easing: EASE_OUT, fill: 'both' });
        const worker = { agent, pos: corner };
        workers.push(worker);
        start += rand(70, 135);

        if (task.kind === 'drag') {
          // The drag ends at the cell's far corner, or the bottom of the screen if the cell runs past it.
          const far = [r.right - 8, Math.min(r.bottom, window.innerHeight - 24) - 8];
          later(() => {
            click(agent);
            const box = boxOver(r, color, cell.dataset.cell);
            box.animate(
              [{ clipPath: 'inset(-20px calc(100% - 24px) calc(100% - 24px) -6px)' }, { clipPath: 'inset(-20px -6px -6px -6px)' }],
              { duration: 280, easing: EASE_IN_OUT, fill: 'both' },
            );
            agent.animate([at(corner), at(far)], { duration: 280, easing: EASE_IN_OUT, fill: 'forwards' });
            worker.pos = far;
            show(cell.dataset.cell, cell.dataset.formula ?? '');
            reveal(cell);
          }, arrive);
          end = Math.max(end, arrive + 280);
        }

        if (task.kind === 'copy') {
          // Marching ants while it "copies", then the paste lands and the border goes solid.
          later(() => {
            click(agent);
            const box = boxOver(r, color, cell.dataset.cell);
            box.classList.add('is-ants');
            show(cell.dataset.cell, cell.dataset.formula ?? '');
            later(() => {
              click(agent);
              box.classList.remove('is-ants');
              reveal(cell);
            }, 340);
          }, arrive);
          end = Math.max(end, arrive + 340);
        }

        if (task.kind === 'type') {
          // The cursor becomes an I-beam, the formula types out, and the cell fills in left to right.
          const formula = cell.dataset.formula ?? '';
          const typing = 320;
          later(() => {
            agent.firstChild.outerHTML = BEAM;
            boxOver(r, color, cell.dataset.cell);
            for (let n = 1; n <= formula.length; n++) later(() => show(cell.dataset.cell, formula.slice(0, n)), (typing * n) / formula.length);
            [...cell.children].forEach((child) =>
              child.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: typing, easing: 'linear' }),
            );
            reveal(cell);
          }, arrive);
          end = Math.max(end, arrive + typing);
        }

        if (task.kind === 'fill') {
          // Select the first cell, grab the fill handle, and drag it along the row; each cell fills as it's passed.
          const last = task.cells[task.cells.length - 1].getBoundingClientRect();
          const span = { left: r.left, top: r.top, width: last.right - r.left, height: r.height };
          const handle = [r.right - 1, r.bottom - 1];
          const sweep = 480;
          later(() => {
            click(agent);
            const box = boxOver(span, color, cell.dataset.cell);
            const firstPart = `${100 - (r.width / span.width) * 100}%`;
            box.animate([{ clipPath: `inset(-20px ${firstPart} -6px -6px)` }, { clipPath: `inset(-20px ${firstPart} -6px -6px)` }], { duration: 170, fill: 'both' });
            show(cell.dataset.cell, cell.dataset.formula ?? '');
            reveal(cell);
            agent.animate([at(corner), at(handle)], { duration: 170, easing: EASE_IN_OUT, fill: 'forwards' });
            worker.pos = [last.right - 1, handle[1]];
            flashFormula(cell, color);
            later(() => {
              box.classList.add('is-ants');
              box.animate([{ clipPath: `inset(-20px ${firstPart} -6px -6px)` }, { clipPath: 'inset(-20px -6px -6px -6px)' }], { duration: sweep, easing: 'ease-in-out', fill: 'both' });
              agent.animate([at(handle), at([last.right - 1, handle[1]])], { duration: sweep, easing: 'ease-in-out', fill: 'forwards' });
              task.cells.slice(1).forEach((c) => {
                const cr = c.getBoundingClientRect();
                later(() => {
                  show(c.dataset.cell, c.dataset.formula ?? '');
                  flashFormula(c, color);
                  reveal(c);
                }, ((cr.left + cr.width / 2 - r.right) / (last.right - r.right)) * sweep);
              });
              later(() => box.classList.remove('is-ants'), sweep);
            }, 200);
          }, arrive);
          end = Math.max(end, arrive + 200 + 480);
        }
      });

      // Everyone leaves the way they came: cursors fly off, selections and the phone formula bar fade.
      later(() => {
        workers.forEach(({ agent, pos }) =>
          agent.animate(arc(pos, offscreen()).map(at), { duration: EXIT, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' }),
        );
        layer.querySelectorAll('.swarm-box, .swarm-fx').forEach((node) =>
          node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: EXIT * 0.7, easing: 'ease-out', fill: 'forwards' }),
        );
      }, end + HOLD);
      later(finish, end + HOLD + EXIT);
    };

    // Route chunks load lazily, so wait (up to 3s) for the first cells to exist.
    let tries = 0;
    const begin = () => {
      if (done) return;
      const cells = [...document.querySelectorAll('[data-cell]')].filter(inView).slice(0, MAX_CELLS);
      if (cells.length) run(cells);
      else if (++tries < 60) later(begin, 50);
      else finish();
    };
    later(begin, 0);
    return finish;
  }, [onStatus, setPeek]);

  return null;
};

export default SwarmIntro;
