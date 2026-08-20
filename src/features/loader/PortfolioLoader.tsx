import { useEffect, useState } from 'react';
import { loadPortraitSequenceCached } from '../hero/portraitSequenceCache';
import { loadMediaManifest, type MediaManifest } from '../../lib/media';
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

export interface CriticalAssetLoaders {
  loadManifest: typeof loadMediaManifest;
  waitForFonts: () => Promise<void>;
  preloadImages: (sources: readonly string[]) => Promise<void>;
  loadKeyFrames: (pattern: string, indices: readonly number[]) => Promise<void>;
  warmSequence: () => Promise<unknown>;
}

const frameUrl = (pattern: string, index: number) =>
  pattern.replace('%04d', String(index).padStart(4, '0'));

const selectSequence = (manifest: MediaManifest) =>
  window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;

const createDefaultCriticalAssetLoaders = (): CriticalAssetLoaders => {
  const manifestPromise = loadMediaManifest();

  return {
    loadManifest: () => manifestPromise,
    waitForFonts: () =>
      ((document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve())
        .then(() => undefined),
    preloadImages: (sources) =>
      Promise.all(sources.map((source) => preloadImage(source))).then(() => undefined),
    loadKeyFrames: (pattern, indices) =>
      Promise.all(indices.map((index) => preloadImage(frameUrl(pattern, index)))).then(
        () => undefined,
      ),
    warmSequence: async () => {
      const manifest = await manifestPromise;
      const sequence = selectSequence(manifest);
      return loadPortraitSequenceCached({
        posterUrl: manifest.portrait.poster,
        pattern: sequence.pattern,
        count: sequence.count,
      });
    },
  };
};

export async function loadCriticalAssets(
  report: (loaded: number, total: number) => void,
  loaders: CriticalAssetLoaders = createDefaultCriticalAssetLoaders(),
) {
  const manifest = await loaders.loadManifest();
  const sequence = window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;
  const indices = [
    1,
    Math.ceil(sequence.count * 0.34),
    Math.ceil(sequence.count * 0.67),
    sequence.count,
  ];

  report(1, 4);
  await loaders.waitForFonts();
  report(2, 4);
  await loaders.preloadImages([manifest.portrait.poster]);
  report(3, 4);
  await loaders.loadKeyFrames(sequence.pattern, indices);
  try {
    void loaders.warmSequence().catch(() => undefined);
  } catch {
    // Background warming is best-effort and must never block first-screen readiness.
  }
  report(4, 4);
}

export function PortfolioLoader({ loadCritical = loadCriticalAssets }: PortfolioLoaderProps) {
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
