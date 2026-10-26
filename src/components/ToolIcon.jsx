import iconPaths from '../data/iconPaths';
import { metaFor } from '../data/toolIcons';

// Brand colors too dark to read on the dark theme fall back to the page's ink color.
const isDark = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum < 0.28;
};

// A tool's logo, or a lettered tile for tools that have no brand mark.
const ToolIcon = ({ name, size = 40 }) => {
  const meta = metaFor(name);
  const icon = meta.slug && iconPaths[meta.slug];
  if (icon) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={meta.label} className={isDark(icon.hex) ? 'text-ink' : ''}>
        <path d={icon.path} fill={isDark(icon.hex) ? 'currentColor' : icon.hex} />
      </svg>
    );
  }
  return (
    <span
      role="img"
      aria-label={meta.label}
      className="grid place-items-center rounded-md font-sans font-bold leading-none"
      style={{ width: size, height: size, background: meta.color ?? '#107C41', color: meta.ink ?? '#fff', fontSize: size * 0.36 }}
    >
      {meta.mono}
    </span>
  );
};

export default ToolIcon;
