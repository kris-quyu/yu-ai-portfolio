import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { siteContent } from '../../content/siteContent';
import { loadMediaManifest, type MediaManifest } from '../../lib/media';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { loadFrameSequence } from './frameLoader';
import { drawHeroFrame, getHeroFrame, getHeroTransform } from './heroMath';
import styles from './HeroScrollSequence.module.css';

gsap.registerPlugin(ScrollTrigger);

type SequenceKind = 'desktop' | 'mobile';
type HeroStyle = CSSProperties & { '--hero-progress': string };

const getSequenceKind = (): SequenceKind =>
  typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';

export function HeroScrollSequence() {
  const reducedMotion = useReducedMotion();
  const [manifest, setManifest] = useState<MediaManifest | null>(null);
  const [sequenceKind, setSequenceKind] = useState<SequenceKind>(getSequenceKind);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fallback, setFallback] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastFrame = useRef(-1);
  const raf = useRef(0);

  useEffect(() => {
    let current = true;

    void loadMediaManifest()
      .then((nextManifest) => {
        if (current) setManifest(nextManifest);
      })
      .catch(() => {
        if (current) setFallback(true);
      });

    return () => {
      current = false;
    };
  }, []);

  useEffect(() => {
    let resizeRaf = 0;
    const updateSequence = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => setSequenceKind(getSequenceKind()));
    };

    window.addEventListener('resize', updateSequence);
    return () => {
      window.removeEventListener('resize', updateSequence);
      cancelAnimationFrame(resizeRaf);
    };
  }, []);

  useEffect(() => {
    if (!manifest || reducedMotion || fallback) return;

    const controller = new AbortController();
    const sequence = manifest.portrait[sequenceKind];
    let current = true;

    setFrames([]);
    setLoadProgress(0);
    lastFrame.current = -1;

    void loadFrameSequence({
      posterUrl: manifest.portrait.poster,
      pattern: sequence.pattern,
      count: sequence.count,
      signal: controller.signal,
      onProgress: (loaded, total) => {
        if (current && total > 0) setLoadProgress(Math.round((loaded / total) * 100));
      },
    })
      .then((loadedFrames) => {
        if (current && !controller.signal.aborted) setFrames(loadedFrames);
      })
      .catch((error: unknown) => {
        if (
          current &&
          !controller.signal.aborted &&
          (!(error instanceof DOMException) || error.name !== 'AbortError')
        ) {
          setFallback(true);
        }
      });

    return () => {
      current = false;
      controller.abort();
    };
  }, [fallback, manifest, reducedMotion, sequenceKind]);

  useLayoutEffect(() => {
    if (reducedMotion || fallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        lastFrame.current = -1;
      }
    };

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    return () => window.removeEventListener('resize', sizeCanvas);
  }, [fallback, reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || fallback || frames.length === 0) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!section || !canvas || !context) {
      setFallback(true);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        targetProgress.current = progress;
        railRef.current?.style.setProperty('--hero-progress', String(progress));
      },
    });

    let running = true;
    const tick = () => {
      if (!running) return;

      currentProgress.current +=
        (targetProgress.current - currentProgress.current) * 0.12;
      const index = getHeroFrame(currentProgress.current, frames.length);

      if (index !== lastFrame.current) {
        drawHeroFrame(
          context,
          frames[index],
          getHeroTransform(currentProgress.current),
          canvas.width,
          canvas.height,
        );
        lastFrame.current = index;
        posterRef.current?.classList.add(styles.posterReady);
        posterRef.current?.setAttribute('aria-hidden', 'true');
        canvas.removeAttribute('aria-busy');
        canvas.removeAttribute('aria-hidden');
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      trigger.kill();
      cancelAnimationFrame(raf.current);
    };
  }, [fallback, frames, reducedMotion]);

  const staticPortrait = reducedMotion || fallback;
  const loadingLabel = fallback
    ? 'STATIC PORTRAIT'
    : frames.length > 0
      ? 'READY · SCROLL TO CONTROL'
      : `LOADING ${loadProgress}%`;

  return (
    <section
      ref={sectionRef}
      id="profile"
      aria-labelledby="hero-title"
      className={`${styles.hero} ${staticPortrait ? styles.staticHero : ''}`}
    >
      <div className={styles.stage}>
        <div className={styles.media} aria-label="人物动画画面">
          {manifest && (
            <img
              ref={posterRef}
              className={styles.poster}
              src={manifest.portrait.poster}
              alt="瞿先生动画人物"
            />
          )}
          {!staticPortrait && (
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label="滚动控制的动画人物"
              aria-busy={frames.length === 0 ? 'true' : undefined}
              aria-hidden="true"
            />
          )}
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>{siteContent.hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.title}>
            {siteContent.hero.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.summary}>{siteContent.hero.summary}</p>
        </div>

        <div
          ref={railRef}
          className={styles.progress}
          style={{ '--hero-progress': '0' } as HeroStyle}
        >
          <div className={styles.progressMeta}>
            <span>SCROLL / CONTROL</span>
            <span role="status" aria-live="polite">{loadingLabel}</span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
