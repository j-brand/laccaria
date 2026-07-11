import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import type {CSSProperties} from 'react';
import Mark from '@/components/ui/Mark';
import {ArrowRight} from '@/components/ui/icons';
import {DEFAULT_GRADIENT} from '@/lib/gradients';
import type {Project} from '@/lib/projects';

type Props = {
  project: Project;
  viewProjectLabel: string;
};

const badgeChamfer = {'--c': '7px'} as CSSProperties;

export default function ProjectCard({project, viewProjectLabel}: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="jb-proj cut-frame chamfer-lg lift block h-full transition-transform hover:-translate-y-1"
    >
      <div className="cut-inner chamfer-lg flex h-full flex-col overflow-hidden">
        {/* banner — hero image when present, otherwise the gradient */}
        <div
          className="relative h-[180px] overflow-hidden"
          style={{background: project.gradient ?? DEFAULT_GRADIENT}}
        >
          {project.hero && (
            <Image
              src={project.hero}
              alt=""
              fill
              quality={90}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
            />
          )}
          <span
            className="cut-frame absolute left-3 top-3 inline-block"
            style={{...badgeChamfer, '--bd': 'color-mix(in oklab, var(--line) 55%, transparent)'} as CSSProperties}
          >
            <span className="cut-inner grid size-[38px] place-items-center" style={badgeChamfer}>
              <Mark width={24} aria-hidden />
            </span>
          </span>
          <span
            className="chamfer-tr absolute right-3.5 top-3.5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
            style={{'--c': '6px', background: 'color-mix(in oklab, #0B130E 66%, transparent)'} as CSSProperties}
          >
            {project.year}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          {project.kind && (
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-text">
              {project.kind}
            </p>
          )}
          <h3 className="mb-2 font-display text-xl font-semibold text-fg">
            {project.title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-fg-muted">
            {project.summary}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
            {viewProjectLabel}
            <span className="arrow transition-transform">
              <ArrowRight size={15} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
