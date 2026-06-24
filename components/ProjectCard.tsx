import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import type {Project} from '@/lib/projects';

type Props = {
  project: Project;
};

export default function ProjectCard({project}: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-accent"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-foreground/5">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
