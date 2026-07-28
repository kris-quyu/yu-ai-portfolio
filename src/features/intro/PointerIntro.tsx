import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { siteContent } from '../../content/siteContent';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { getIntroTransform } from './introMath';
import styles from './PointerIntro.module.css';

const EASING_FACTOR = 0.12;
const MOBILE_BREAKPOINT = 720;
const MOBILE_DRIFT_X = 30;
const MOBILE_DRIFT_Y = 18;
const MOBILE_TILT = 10;

type Point = { x: number; y: number };
type IntroCustomProperties = CSSProperties & Record<`--intro-${string}`, string>;

const initialStyles: IntroCustomProperties = {
  '--intro-pointer-x': '50%',
  '--intro-pointer-y': '50%',
  '--intro-circle-x': '50%',
  '--intro-circle-y': '50%',
  '--intro-rotate-x': '0deg',
  '--intro-rotate-y': '0deg',
  '--intro-parallax-x': '0px',
  '--intro-parallax-y': '0px',
};

function formatNumber(value: number) {
  return Number(value.toFixed(4)).toString();
}

function getViewport(section: HTMLElement) {
  const bounds = section.getBoundingClientRect();
  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width || window.innerWidth || 1,
    height: bounds.height || window.innerHeight || 1,
  };
}

function setTargetVariables(section: HTMLElement, point: Point) {
  section.style.setProperty('--intro-pointer-x', `${formatNumber(point.x)}px`);
  section.style.setProperty('--intro-pointer-y', `${formatNumber(point.y)}px`);
}

export function PointerIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const renderedRef = useRef<Point>({ x: 0, y: 0 });
  const activePointerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      Object.entries(initialStyles).forEach(([property, value]) => {
        section.style.setProperty(property, value);
      });
      return;
    }

    const viewport = getViewport(section);
    const center = { x: viewport.width / 2, y: viewport.height / 2 };
    targetRef.current = center;
    renderedRef.current = center;
    setTargetVariables(section, center);
    section.style.setProperty('--intro-circle-x', `${formatNumber(center.x)}px`);
    section.style.setProperty('--intro-circle-y', `${formatNumber(center.y)}px`);

    const tick = (time: number) => {
      const currentViewport = getViewport(section);
      const isMobile = currentViewport.width <= MOBILE_BREAKPOINT;

      if (isMobile && activePointerRef.current === null) {
        targetRef.current = {
          x: currentViewport.width / 2 + Math.sin(time / 1800) * MOBILE_DRIFT_X,
          y: currentViewport.height / 2 + Math.cos(time / 2200) * MOBILE_DRIFT_Y,
        };
        setTargetVariables(section, targetRef.current);
      }

      renderedRef.current = {
        x: renderedRef.current.x + (targetRef.current.x - renderedRef.current.x) * EASING_FACTOR,
        y: renderedRef.current.y + (targetRef.current.y - renderedRef.current.y) * EASING_FACTOR,
      };

      const transform = getIntroTransform(
        renderedRef.current.x,
        renderedRef.current.y,
        currentViewport.width,
        currentViewport.height,
        isMobile ? MOBILE_TILT : 20,
      );

      section.style.setProperty(
        '--intro-circle-x',
        `${formatNumber(renderedRef.current.x)}px`,
      );
      section.style.setProperty(
        '--intro-circle-y',
        `${formatNumber(renderedRef.current.y)}px`,
      );
      section.style.setProperty('--intro-rotate-x', `${formatNumber(transform.rotateX)}deg`);
      section.style.setProperty('--intro-rotate-y', `${formatNumber(transform.rotateY)}deg`);
      section.style.setProperty(
        '--intro-parallax-x',
        `${formatNumber(transform.normalizedX * 12)}px`,
      );
      section.style.setProperty(
        '--intro-parallax-y',
        `${formatNumber(transform.normalizedY * 8)}px`,
      );

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  const updateTarget = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (
      event.pointerType !== 'mouse' &&
      activePointerRef.current !== null &&
      event.pointerId !== activePointerRef.current
    ) {
      return;
    }

    const section = event.currentTarget;
    const viewport = getViewport(section);
    const point = {
      x: event.clientX - viewport.left,
      y: event.clientY - viewport.top,
    };
    targetRef.current = point;
    setTargetVariables(section, point);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateTarget(event);
  };

  const releasePointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (activePointerRef.current !== event.pointerId) return;
    activePointerRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The browser may have already released capture after a cancelled gesture.
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className={styles.intro}
      style={initialStyles}
      onPointerDown={handlePointerDown}
      onPointerMove={updateTarget}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      aria-labelledby="intro-title"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true">
        <span className={styles.node} />
        <span className={styles.nodeSecondary} />
      </div>

      <div className={styles.content}>
        <p className={styles.kicker}>QX / CREATIVE SIGNAL 001</p>
        <div className={styles.titleStage}>
          <h1 id="intro-title" className={styles.title}>
            {siteContent.intro.title}
          </h1>
        </div>
        <div className={styles.meta}>
          <p>{siteContent.intro.subtitle}</p>
          <p className={styles.hint}>{siteContent.intro.hint}</p>
        </div>
      </div>

      <div className={styles.reveal} aria-label={siteContent.intro.reveal}>
        <span aria-hidden="true">{siteContent.intro.reveal}</span>
      </div>
    </section>
  );
}
