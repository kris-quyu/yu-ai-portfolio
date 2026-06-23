import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import ProjectShowcase from "./components/ProjectShowcase";
import ProjectCoverPreview from "./components/ProjectCoverPreview";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import { advantages } from "./data/advantages";
import { projects } from "./data/projects";
import { site } from "./data/site";
import { timeline } from "./data/timeline";
import { toolkit } from "./data/toolkit";
import { assetPath } from "./utils/assetPath";

gsap.registerPlugin(ScrollTrigger);

function AdvantageSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(".advantage-title-line, .advantage-card", { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        ".advantage-title-line",
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".advantage-heading",
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".advantage-card",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".advantage-grid",
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section className="section advantage page-shell" id="advantage" ref={sectionRef}>
      <div className="section-index">01</div>
      <div className="section__head">
        <div className="section__label">AI ADVANTAGE</div>
        <h2 className="advantage-heading" aria-label="不是单纯会用 AI 工具，而是把 AI 组合成能跑的业务工作流。">
          <span className="advantage-title-line">不是单纯会用 AI 工具，</span>
          <span className="advantage-title-line">而是把 AI 组合成能跑的业务工作流。</span>
        </h2>
      </div>
      <div className="advantage-grid">
        {advantages.map((item, index) => (
          <article className="advantage-card" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div>
              {item.tags.map((tag) => (
                <b key={tag}>{tag}</b>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section id="profile" className="section profile page-shell">
      <div className="section-index">02</div>
      <div className="about__grid">
        <div className="portrait-frame">
          <img
            src={assetPath(site.portrait)}
            alt="黑金杂志风个人肖像"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.nextElementSibling?.removeAttribute("hidden");
            }}
          />
          <div className="portrait-fallback" hidden>
            <span>YU</span>
          </div>
          <div className="portrait-caption">
            <span>THE PERSONA</span>
            <p>Quiet power. Refined presence. System builder.</p>
          </div>
        </div>
        <div className="about__body">
          <p className="eyebrow">PROFILE</p>
          <h2>{site.name}</h2>
          <p className="about__intro">{site.profile}</p>
          <div className="contact-strip">
            <span>{site.email}</span>
            <span>{site.city}</span>
          </div>
          <div className="stats">
            {site.stats.map((item) => (
              <div className="stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="timeline-list">
            {timeline.map((item) => (
              <article key={item.title}>
                <span>{item.time}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Works() {
  return (
    <section id="works" className="section works page-shell">
      <div className="section-index">03</div>
      <div className="section__head">
        <div className="section__label">SELECTED WORKS</div>
        <h2>从内容生产到系统原型，项目都围绕“能运行、能复用、能交付”。</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-card__cover">
              <img
                src={assetPath(project.cover)}
                alt={project.title}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling?.removeAttribute("hidden");
                }}
              />
              <div className="project-card__fallback" hidden>
                <ProjectCoverPreview project={project} compact />
              </div>
            </div>
            <div className="project-card__body">
              <span className="project-card__num">{project.id}</span>
              <h3>{project.title}</h3>
              <p className="project-card__en">{project.englishTitle}</p>
              <p>{project.description}</p>
              <div className="project-meta">
                <dl>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </dl>
                <dl>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </dl>
                <dl>
                  <dt>Stack</dt>
                  <dd>{project.stack.join(" / ")}</dd>
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section id="toolkit" className="section toolkit page-shell">
      <div className="section-index">04</div>
      <div className="section__head section__head--split">
        <div className="section__label">TOOLKIT</div>
        <h2>能力不是标签，是能被组合成结果的工具箱。</h2>
      </div>
      <div className="strength-grid">
        {toolkit.map((item, index) => (
          <article className="strength-card" key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="page-shell contact__inner">
        <span className="section-index">05</span>
        <p>CONTACT</p>
        <h2>{site.contactTitle}</h2>
        <div className="contact__actions">
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <ProjectShowcase />
      <AdvantageSection />
      <Profile />
      <Works />
      <Toolkit />
      <Contact />
    </SmoothScrollProvider>
  );
}
