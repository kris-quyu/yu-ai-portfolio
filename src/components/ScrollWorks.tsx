import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties, MouseEvent } from "react";
import { useRef, useState } from "react";
import { projects } from "../data/projects";
import { site } from "../data/site";
import { assetPath } from "../utils/assetPath";
import ProjectCoverPreview from "./ProjectCoverPreview";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeProject = projects[activeIndex];

  const handleVisualPointer = (event: MouseEvent<HTMLDivElement>) => {
    if (
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--card-x", `${x * 14}px`);
    event.currentTarget.style.setProperty("--card-y", `${y * 10}px`);
  };

  const resetVisualPointer = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--card-x", "0px");
    event.currentTarget.style.setProperty("--card-y", "0px");
  };

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion || window.matchMedia("(max-width: 900px)").matches) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const nextIndex = Math.min(
            projects.length - 1,
            Math.floor(self.progress * projects.length),
          );
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
        },
      });

      return () => trigger.kill();
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const targets = [visualRef.current, contentRef.current].filter(Boolean);
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "opacity,visibility,transform",
        },
      );
    },
    { scope: sectionRef, dependencies: [activeIndex] },
  );

  return (
    <section className="scroll-works" id="works" ref={sectionRef}>
      <div className="scroll-works-sticky">
        <div className="scroll-works-inner page-shell">
          <header className="scroll-works-header">
            <div>
              <p>{site.works.label}</p>
              <h2>{site.works.title}</h2>
            </div>
            <p>{site.works.description}</p>
          </header>

          <div className="scroll-works-stage">
            <div
              className="scroll-works-visual"
              ref={visualRef}
              style={{ "--project-accent": activeProject.accentColor } as CSSProperties}
              onMouseMove={handleVisualPointer}
              onMouseLeave={resetVisualPointer}
            >
              <img
                src={assetPath(activeProject.cover)}
                alt=""
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling?.removeAttribute("hidden");
                }}
              />
              <div className="scroll-works-fallback" hidden>
                <ProjectCoverPreview project={activeProject} compact />
              </div>
              <span className="scroll-works-visual-label">{activeProject.category}</span>
            </div>

            <article className="scroll-works-content" ref={contentRef}>
              <div className="scroll-works-counter">
                <strong>{activeProject.id}</strong>
                <span>/ {String(projects.length).padStart(2, "0")}</span>
              </div>
              <p className="scroll-works-category">{activeProject.category}</p>
              <h3>{activeProject.englishTitle}</h3>
              <h4>{activeProject.title}</h4>
              <p className="scroll-works-description">{activeProject.description}</p>

              <dl className="scroll-works-meta">
                <div>
                  <dt>Role</dt>
                  <dd>{activeProject.role}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{activeProject.status}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd className="scroll-works-tags">
                    {activeProject.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="scroll-works-progress" aria-hidden="true">
            {projects.map((project, index) => (
              <span className={index <= activeIndex ? "is-active" : ""} key={project.id} />
            ))}
          </div>

          <div className="scroll-works-mobile">
            {projects.map((project) => (
              <article className="scroll-works-mobile-card" key={project.id}>
                <div
                  className="scroll-works-mobile-visual"
                  style={{ "--project-accent": project.accentColor } as CSSProperties}
                >
                  <img
                    src={assetPath(project.cover)}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                      event.currentTarget.nextElementSibling?.removeAttribute("hidden");
                    }}
                  />
                  <div className="scroll-works-fallback" hidden>
                    <ProjectCoverPreview project={project} compact />
                  </div>
                </div>
                <div className="scroll-works-mobile-copy">
                  <span>
                    {project.id} / {String(projects.length).padStart(2, "0")}
                  </span>
                  <h3>{project.englishTitle}</h3>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
