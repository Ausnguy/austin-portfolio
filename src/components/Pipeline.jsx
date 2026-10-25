// A project's architecture as a flow of steps: left to right on wide screens, top to bottom on phones.
const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 text-accent rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const Pipeline = ({ steps }) => (
  <ol className="flex flex-col lg:flex-row items-stretch gap-2">
    {steps.map((step, i) => (
      <li key={step.name} className="contents">
        {i > 0 && (
          <span className="self-center">
            <Arrow />
          </span>
        )}
        <div className="flex-1 min-w-0 rounded-sm border border-grid bg-paper px-3 py-2.5">
          <div className="font-mono text-[11px] text-muted">Step {i + 1}</div>
          <div className="text-[14.5px] font-semibold text-ink leading-snug">{step.name}</div>
          <div className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{step.detail}</div>
        </div>
      </li>
    ))}
  </ol>
);

export default Pipeline;
