import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { site } from "../data/site";
import AmbientField from "./AmbientField";
import PointerLens from "./PointerLens";
import RevealText from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) return;

      gsap.fromTo(
        ".manifesto-copy > *",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".manifesto-copy",
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.to(".manifesto-title", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="manifesto" id="identity" ref={sectionRef}>
      <AmbientField className="manifesto-ambient" />
      <PointerLens containerRef={sectionRef} className="manifesto-pointer-lens" />

      <div className="manifesto-inner page-shell">
        <p className="manifesto-label">{site.manifesto.label}</p>

        <RevealText
          as="h2"
          className="manifesto-title"
          lines={site.manifesto.titleLines}
          scrollTrigger
          duration={0.9}
        />

        <div className="manifesto-copy">
          <p>{site.manifesto.description}</p>
          <div>
            <span>METHOD / 01</span>
            <p>{site.manifesto.method}</p>
          </div>
        </div>
      </div>

      <div className="manifesto-scan-layer" data-lens-scan aria-hidden="true">
        <div className="manifesto-inner manifesto-inner--scan page-shell">
          <p className="manifesto-label manifesto-scan-spacer">{site.manifesto.label}</p>
          <h2 className="manifesto-title manifesto-title--scan">
            {site.manifesto.titleLines.map((line, index) => (
              <span className="reveal-text__line" key={`${line}-${index}`}>
                <span>{line}</span>
              </span>
            ))}
          </h2>
          <div className="manifesto-copy manifesto-scan-spacer">
            <p>{site.manifesto.description}</p>
            <div>
              <span>METHOD / 01</span>
              <p>{site.manifesto.method}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
