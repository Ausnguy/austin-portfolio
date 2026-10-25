import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

// Same curve as --ease-out in index.css.
export const EASE_OUT = [0.23, 1, 0.32, 1];

// Counts from 0 to `target` once the element scrolls into view.
export const useCountUp = (target, { decimals = 0, duration = 900 } = {}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, target, duration]);

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return [ref, formatted];
};
