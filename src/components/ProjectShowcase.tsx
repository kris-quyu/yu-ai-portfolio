import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "../data/projects";
import { site } from "../data/site";
import AmbientField from "./AmbientField";
import IntroSequence from "./IntroSequence";
import PointerLens from "./PointerLens";
import ProjectCoverPreview from "./ProjectCoverPreview";
import RevealText from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const glowPositions = ["72% 26%", "54% 22%", "70% 58%", "46% 42%"];
const SHOWREEL_INTERVAL = 2600;

export default function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const titleLensRef = useRef<HTMLDivElement>(null);
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

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(".showcase-nav", { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo(
          ".editorial-hero-support > *",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.07 },
          "-=0.48",
        )
        .fromTo(
          ".showreel-stack, .opening-status",
          { autoAlpha: 0, x: 34 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.08,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.58",
        );

      gsap.to(".editorial-title", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".opening-visual", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
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

  const handleCardPointerMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (
      window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--card-x", `${x * 12}px`);
    event.currentTarget.style.setProperty("--card-y", `${y * 9}px`);
  };

  const resetCardPointer = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--card-x", "0px");
    event.currentTarget.style.setProperty("--card-y", "0px");
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
      <AmbientField className="hero-ambient" />

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

      <div className="opening-grid editorial-hero-grid page-shell">
        <div className="opening-copy editorial-hero-copy">
          <p className="showcase-kicker">{site.position}</p>
          <div className="hero-title-lens" ref={titleLensRef}>
            <PointerLens containerRef={titleLensRef} className="hero-pointer-lens" />
            <RevealText
              as="h1"
              active={introDone}
              className="editorial-title"
              lines={site.hero.titleLines}
              duration={0.88}
              stagger={0.09}
            />
            <div className="hero-title-scan-layer" data-lens-scan aria-hidden="true">
              <h1 className="editorial-title editorial-title--scan">
                {site.hero.titleLines.map((line, index) => (
                  <span className="reveal-text__line" key={`${line}-${index}`}>
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
            </div>
          </div>

          <div className="editorial-hero-support">
            <h2>{site.headline}</h2>
            <p>{site.hero.description}</p>
            <div className="showcase-actions">
              <a href="#works">{site.hero.primaryAction}</a>
              <a href={`mailto:${site.email}`}>{site.hero.secondaryAction}</a>
            </div>
          </div>
        </div>

        <div className="opening-visual" ref={visualRef}>
          <div className="showreel-stack">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const isNext = index === (activeIndex + 1) % projects.length;
              const isPrevious =
                index === (activeIndex - 1 + projects.length) % projects.length;
              const position = isActive
                ? "active"
                : isNext
                  ? "next"
                  : isPrevious
                    ? "previous"
                    : "hidden";

              return (
                <button
                  className={`showreel-card${isActive ? " is-active" : ""}`}
                  data-position={position}
                  key={project.id}
                  onClick={() => setActiveIndex(index)}
                  onMouseLeave={resetCardPointer}
                  onMouseMove={handleCardPointerMove}
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
            <RevealText
              as="strong"
              className="showreel-active-title"
              key={activeProject.id}
              lines={[activeProject.englishTitle]}
              duration={0.48}
            />
            <em>{activeProject.category}</em>
          </div>
        </div>

        <div className="editorial-scroll-note">
          <span>00 / INTRO</span>
          <p>{site.hero.scrollLabel}</p>
        </div>
      </div>
    </section>
  );
}
