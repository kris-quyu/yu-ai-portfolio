import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import { site } from "../data/site";

type IntroSequenceProps = {
  onComplete: () => void;
};

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const fallback = window.setTimeout(finish, 4600);
    return () => window.clearTimeout(fallback);
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(introRef.current, { autoAlpha: 0 });
        finish();
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });
      const overlay = introRef.current;

      timeline
        .fromTo(".intro-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.65, stagger: 0.08 }, "-=0.2")
        .to(".intro-keyword", { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.16 }, "-=0.12")
        .to(".intro-keyword", { autoAlpha: 0, y: -10, duration: 0.22, stagger: 0.06 }, "+=0.15")
        .fromTo(".intro-title span", { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 })
        .fromTo(".intro-subtitle", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.52 }, "-=0.2")
        .to(overlay, { autoAlpha: 0, duration: 0.58, ease: "power2.inOut" }, "+=0.45");
    },
    { scope: introRef },
  );

  return (
    <div className="intro-overlay" ref={introRef}>
      <button className="intro-skip" type="button" onClick={finish}>
        SKIP
      </button>
      <div className="intro-noise" />
      <div className="intro-line intro-line--left" />
      <div className="intro-line intro-line--right" />
      <div className="intro-center">
        <p className="intro-kicker">{site.hero.introLabel}</p>
        <div className="intro-keywords" aria-hidden="true">
          {site.hero.keywords.map((keyword) => (
            <span className="intro-keyword" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
        <h1 className="intro-title">
          <span>Yu AI</span>
          <span>Creative Lab</span>
        </h1>
        <p className="intro-subtitle">
          {projects.map((project) => project.category).join(" / ")}
        </p>
      </div>
    </div>
  );
}
