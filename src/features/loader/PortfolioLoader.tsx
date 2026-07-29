import { useEffect, useState } from 'react';
import { loadPortraitSequenceCached } from '../hero/portraitSequenceCache';
import { loadMediaManifest } from '../../lib/media';
import { loadPortfolio } from './loadPortfolio';
import styles from './PortfolioLoader.module.css';

type LoaderState = 'modal' | 'revealing';

export interface PortfolioLoaderProps {
  loadCritical?: (report: (loaded: number, total: number) => void) => Promise<void>;
}

const loadingTopics = ['AI 内容', '视频工作流', '电商转化'];

const preloadImage = (src: string) => new Promise<void>((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve();
  image.onerror = () => reject(new Error(`Asset failed to load: ${src}`));
  image.src = src;
});

const warmFilmMetadata = (src: string) => new Promise<void>((resolve) => {
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.onloadedmetadata = () => resolve();
  video.onerror = () => resolve();
  video.src = src;
  video.load();
});

const loadDefaultCritical = async (report: (loaded: number, total: number) => void) => {
  const manifest = await loadMediaManifest();
  const sequence = window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;
  const total = sequence.count + 4;
  const filmReady = warmFilmMetadata(manifest.film.src);

  report(1, total);
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  await (fonts?.ready ?? Promise.resolve());
  report(2, total);
  await preloadImage(manifest.portrait.poster);
  report(3, total);
  await loadPortraitSequenceCached({
    posterUrl: manifest.portrait.poster,
    pattern: sequence.pattern,
    count: sequence.count,
    onProgress: (loaded) => report(3 + loaded, total),
  });
  await filmReady;
  report(total, total);
};

export function PortfolioLoader({ loadCritical = loadDefaultCritical }: PortfolioLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [topic, setTopic] = useState(0);
  const [state, setState] = useState<LoaderState>('modal');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTopic((current) => (current + 1) % loadingTopics.length);
    }, 900);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let current = true;
    setPercent(0);
    void loadPortfolio({
      minimumMs: 1200,
      maximumMs: 6000,
      onProgress: setPercent,
      loadCritical,
    }).then(() => {
      if (!current) return;
      setState('revealing');
      window.setTimeout(() => {
        if (current) setVisible(false);
      }, 700);
    });

    return () => {
      current = false;
    };
  }, [loadCritical]);

  useEffect(() => {
    if (state !== 'modal') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [state]);

  if (!visible) return null;

  return (
    <div
      className={styles.loader}
      data-testid="portfolio-loader"
      data-state={state}
      role="status"
      aria-live="polite"
      aria-busy={state === 'modal'}
      aria-modal={state === 'modal' ? 'true' : undefined}
    >
      <div className={styles.orb} aria-hidden="true" />
      <div className={styles.copy}>
        <p>LOADING CREATIVE SYSTEM</p>
        <strong>{percent}%</strong>
        <span>{loadingTopics[topic]}</span>
      </div>
    </div>
  );
}
