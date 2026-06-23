import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "../data/projects";
import { site } from "../data/site";
import IntroSequence from "./IntroSequence";
import ProjectCoverPreview from "./ProjectCoverPreview";

const glowPositions = ["72% 26%", "54% 22%", "70% 58%", "46% 42%"];
const SHOWREEL_INTERVAL = 2600;

export default function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const activeProject = projects[activeIndex];

  const glowPosition = useMemo(
    () => glowPositions[activeIndex % glowPositions.length],
    [activeIndex],
  );

  useEffect(() => {
    if (!introDone) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % projects.length);
    }, SHOWREEL_INTERVAL);

    return () => window.clearInterval(timer);
  }, [introDone]);

  useGSAP(
    () => {
      if (!introDone) return;

      gsap.fromTo(
        ".opening-copy > *, .showreel-card, .opening-status",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "opacity,visibility,transform",
        },
      );
    },
    { scope: rootRef, dependencies: [introDone] },
  );

  useGSAP(
    () => {
      gsap.to(rootRef.current, {
        "--glow-x": glowPosition.split(" ")[0],
        "--glow-y": glowPosition.split(" ")[1],
        duration: 1,
        ease: "power2.out",
      });

      gsap.fromTo(
        ".showreel-active-title",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );
    },
    { scope: rootRef, dependencies: [activeIndex, glowPosition] },
  );

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(max-width: 720px)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(visualRef.current, {
      x: x * 16,
      y: y * 12,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <section
      className="showcase opening-showcase"
      id="showcase"
      ref={rootRef}
      onMouseMove={handlePointerMove}
      style={
        {
          "--glow-x": glowPosition.split(" ")[0],
          "--glow-y": glowPosition.split(" ")[1],
        } as CSSProperties
      }
    >
      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}

      <header className="showcase-nav page-shell">
        <a className="showcase-brand" href="#showcase">
          Q / YU
        </a>
        <nav aria-label="主导航">
          {site.nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="showcase-contact" href={`mailto:${site.email}`}>
          联系合作
        </a>
      </header>

      <div className="opening-grid page-shell">
        <div className="opening-copy">
          <p className="showcase-kicker">AI Creator & Automation Builder</p>
          <h1>
            <span>Yu AI</span>
            <span>Creative Lab</span>
          </h1>
          <h2>AI 内容自动化 / GEO 优化 / 视频工作流 / 智能系统</h2>
          <p>我把 AI、自动化工作流和前端交互，做成可以真正运行的内容、营销和创意系统。</p>
          <div className="showcase-actions">
            <a href="#works">进入作品</a>
            <a href={`mailto:${site.email}`}>联系合作</a>
          </div>
        </div>

        <div className="opening-visual" ref={visualRef}>
          <div className="showreel-stack">
            {projects.map((project, index) => {
              const offset = (index - activeIndex + projects.length) % projects.length;
              const isActive = index === activeIndex;

              return (
                <button
                  className={`showreel-card${isActive ? " is-active" : ""}`}
                  data-offset={offset}
                  key={project.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                  aria-label={`切换到 ${project.title}`}
                >
                  <ProjectCoverPreview project={project} />
                </button>
              );
            })}
          </div>
          <div className="opening-status">
            <span>
              {activeProject.id} / {String(projects.length).padStart(2, "0")}
            </span>
            <strong className="showreel-active-title">{activeProject.englishTitle}</strong>
            <em>{activeProject.category}</em>
          </div>
        </div>
      </div>
    </section>
  );
}
