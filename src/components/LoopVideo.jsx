import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useReducedMotion } from 'framer-motion';

// Silent looping preview that only plays while visible, never under reduced motion,
// and can be paused by the viewer.
const LoopVideo = ({ src, poster, label, to, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const shouldPlay = inView && !reduceMotion && !paused;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className={className}
      />
      {to && (
        <Link to={to} aria-label={label} className="absolute inset-0" />
      )}
      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play preview' : 'Pause preview'}
          className="absolute bottom-3 left-3 w-8 h-8 grid place-items-center bg-cream/90 text-charcoal border-2 border-charcoal hover:bg-sand transition-colors"
        >
          {paused ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current"><path d="M7 4.5v15l12-7.5-12-7.5Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
          )}
        </button>
      )}
    </div>
  );
};

export default LoopVideo;
