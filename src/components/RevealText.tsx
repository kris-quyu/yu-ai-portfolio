import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ElementType } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type RevealTextProps = {
  lines: string[];
  as?: ElementType;
  className?: string;
  active?: boolean;
  scrollTrigger?: boolean;
  stagger?: number;
  duration?: number;
};

export default function RevealText({
  lines,
  as: Component = "h2",
  className = "",
  active = true,
  scrollTrigger = false,
  stagger = 0.08,
  duration = 0.85,
}: RevealTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const textKey = lines.join("|");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !active) return;

      const spans = root.querySelectorAll(".reveal-text__line > span");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(spans, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        spans,
        { yPercent: 112, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration,
          stagger,
          ease: "power3.out",
          ...(scrollTrigger
            ? {
                scrollTrigger: {
                  trigger: root,
                  start: "top 82%",
                  once: true,
                },
              }
            : {}),
        },
      );
    },
    { scope: rootRef, dependencies: [active, duration, scrollTrigger, stagger, textKey] },
  );

  return (
    <Component
      className={`reveal-text ${className}`.trim()}
      ref={rootRef}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, index) => (
        <span className="reveal-text__line" key={`${line}-${index}`}>
          <span>{line}</span>
        </span>
      ))}
    </Component>
  );
}
