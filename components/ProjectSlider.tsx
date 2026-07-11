'use client';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, A11y, Keyboard} from 'swiper/modules';
import type {A11yOptions} from 'swiper/types';
import ProjectCard from '@/components/ProjectCard';
import type {Project} from '@/lib/projects';
// Swiper CSS is imported in app/globals.css (layered) so the brand overrides
// there reliably win the cascade.

type Props = {
  projects: Project[];
  viewProjectLabel: string;
  /** Localized Swiper screen-reader announcements. */
  a11y: A11yOptions;
};

export default function ProjectSlider({
  projects,
  viewProjectLabel,
  a11y
}: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y, Keyboard]}
      navigation
      pagination={{clickable: true}}
      keyboard={{enabled: true}}
      a11y={a11y}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: {slidesPerView: 2},
        1024: {slidesPerView: 3}
      }}
      className="pb-12! pt-2!"
    >
      {projects.map((project) => (
        <SwiperSlide key={project.slug} className="h-auto self-stretch flex!">
          <ProjectCard project={project} viewProjectLabel={viewProjectLabel} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
