'use client';

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, A11y} from 'swiper/modules';
import ProjectCard from '@/components/ProjectCard';
import type {Project} from '@/lib/projects';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
  projects: Project[];
};

export default function ProjectSlider({projects}: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      navigation
      pagination={{clickable: true}}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: {slidesPerView: 2},
        1024: {slidesPerView: 3}
      }}
      className="!pb-12"
    >
      {projects.map((project) => (
        <SwiperSlide key={project.slug} className="h-auto self-stretch !flex">
          <ProjectCard project={project} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
