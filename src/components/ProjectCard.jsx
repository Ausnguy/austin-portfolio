import { useRef } from 'react';
import { Link } from 'react-router-dom';

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const StatusBadge = ({ status }) =>
  status === 'wip' ? (
    <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-sm bg-[#FFF4CE] text-[#7A5B00] dark:bg-[#3A3214] dark:text-[#F2D27A] text-[12px] font-semibold">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      Work in progress
    </span>
  ) : null;

// A project as it sits inside a sheet cell: thumbnail, category, title, result, tools.
const ProjectCard = ({ project, compact = false }) => {
  const videoRef = useRef(null);
  const baseUrl = import.meta.env.BASE_URL;

  // Video projects preview their loop on hover instead of a still.
  const playPreview = () => {
    if (videoRef.current && canHover()) videoRef.current.play().catch(() => {});
  };
  const stopPreview = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <Link
      to={`/projects/${project.slug}`}
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
      className="group flex h-full flex-col"
    >
      <div className="media-frame aspect-video">
        {project.videoLoop ? (
          <video
            ref={videoRef}
            src={`${baseUrl}${project.videoLoop}`}
            poster={`${baseUrl}${project.videoLoopPoster}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <img
            src={project.image}
            alt=""
            width="1280"
            height="720"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="pt-3.5 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] text-muted">
          <span className="font-semibold text-accent-ink">{project.category}</span>
          {project.date && <span>{project.date}</span>}
          <StatusBadge status={project.status} />
        </div>
        <h3 className={`mt-1.5 font-sans font-bold leading-snug text-ink decoration-accent decoration-2 underline-offset-4 group-hover:underline ${compact ? 'text-[17px]' : 'text-xl'}`}>
          {project.title}
        </h3>
        {project.highlight && <p className="mt-2 text-[14.5px] font-semibold leading-snug text-ink">{project.highlight}</p>}
        {!compact && <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{project.description}</p>}
        <p className="mt-auto pt-3 font-mono text-[12.5px] text-muted">{project.tools.join(', ')}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
