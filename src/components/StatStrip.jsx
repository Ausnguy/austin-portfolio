import { useCountUp } from '../lib/motion';

const Stat = ({ metric }) => {
  const [ref, value] = useCountUp(metric.value, { decimals: metric.decimals ?? 0 });

  return (
    <div className="border-t-2 border-charcoal pt-4">
      <div ref={ref} className="font-sans text-3xl md:text-4xl font-bold tabular-nums whitespace-nowrap">
        {value}
        {metric.suffix && <span className="text-rust">{metric.suffix}</span>}
      </div>
      <p className="font-serif text-base leading-snug mt-2 text-slate">{metric.label}</p>
    </div>
  );
};

const StatStrip = ({ metrics, className = '' }) => (
  <div className={`grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 ${className}`}>
    {metrics.map((metric) => (
      <Stat key={metric.label} metric={metric} />
    ))}
  </div>
);

export default StatStrip;
