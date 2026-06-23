import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { Project } from "../data/projects";
import ProjectCoverPreview from "./ProjectCoverPreview";

type ProjectGalleryProps = {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function ProjectGallery({ projects, activeIndex, onSelect }: ProjectGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".gallery-card", {
        xPercent: -activeIndex * 18,
        duration: 0.82,
        ease: "power3.out",
        stagger: 0.025,
      });
    },
    { scope: trackRef, dependencies: [activeIndex] },
  );

  return (
    <div className="showcase-gallery" ref={trackRef}>
      {projects.map((project, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            className={`gallery-card${isActive ? " is-active" : ""}`}
            key={project.id}
            onClick={() => onSelect(index)}
            type="button"
            aria-label={`切换到 ${project.title}`}
          >
            <ProjectCoverPreview project={project} />
          </button>
        );
      })}
    </div>
  );
}
