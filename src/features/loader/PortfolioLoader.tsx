import { useEffect, useId, useRef, useState } from 'react';
import { loadPortraitSequenceCached } from '../hero/portraitSequenceCache';
import { loadMediaManifest, type MediaManifest } from '../../lib/media';
import { loadPortfolio, type PortfolioLoadResult } from './loadPortfolio';
import styles from './PortfolioLoader.module.css';

type LoaderState = 'modal' | 'revealing';

export interface PortfolioLoaderProps {
  loadCritical?: (
    report: (loaded: number, total: number) => void,
    signal: AbortSignal,
  ) => Promise<void>;
  onSettled?: (result: PortfolioLoadResult) => void;
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

const isAbortSignal = (
  value: CriticalAssetLoaders | AbortSignal,
): value is AbortSignal =>
  typeof AbortSignal !== 'undefined' && value instanceof AbortSignal;

export async function loadCriticalAssets(
  report: (loaded: number, total: number) => void,
  loadersOrSignal: CriticalAssetLoaders | AbortSignal = createDefaultCriticalAssetLoaders(),
  explicitSignal?: AbortSignal,
) {
  const receivedSignal = isAbortSignal(loadersOrSignal);
  const loaders: CriticalAssetLoaders = receivedSignal
    ? createDefaultCriticalAssetLoaders()
    : loadersOrSignal;
  const signal: AbortSignal | undefined = receivedSignal
    ? loadersOrSignal
    : explicitSignal;
  const stopIfAborted = () => {
    if (signal?.aborted) throw new DOMException('Critical asset loading aborted', 'AbortError');
  };

  const manifest = await loaders.loadManifest();
  stopIfAborted();
  const sequence = window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;
  const indices = [
    1,
    Math.ceil(sequence.count * 0.34),
    Math.ceil(sequence.count * 0.67),
    sequence.count,
  ];

  report(1, 4);
  await loaders.waitForFonts();
  stopIfAborted();
  report(2, 4);
  await loaders.preloadImages([manifest.portrait.poster]);
  stopIfAborted();
  report(3, 4);
  await loaders.loadKeyFrames(sequence.pattern, indices);
  stopIfAborted();
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (!reducedMotion) {
    try {
      void loaders.warmSequence().catch(() => undefined);
    } catch {
      // Background warming is best-effort and must never block first-screen readiness.
    }
  }
  report(4, 4);
}

export function PortfolioLoader({
  loadCritical = loadCriticalAssets,
  onSettled,
}: PortfolioLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [topic, setTopic] = useState(0);
  const [state, setState] = useState<LoaderState>('modal');
  const [visible, setVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!visible || state !== 'modal') return;
    const interval = window.setInterval(() => {
      setTopic((current) => (current + 1) % loadingTopics.length);
    }, 900);
    return () => window.clearInterval(interval);
  }, [state, visible]);

  useEffect(() => {
    let current = true;
    let revealTimeout: number | undefined;
    setPercent(0);
    void loadPortfolio({
      minimumMs: 1200,
      maximumMs: 6000,
      onProgress: setPercent,
      loadCritical,
    }).then((result) => {
      if (!current) return;
      onSettled?.(result);
      setState('revealing');
      revealTimeout = window.setTimeout(() => {
        if (current) setVisible(false);
      }, 700);
    });

    return () => {
      current = false;
      if (revealTimeout !== undefined) window.clearTimeout(revealTimeout);
    };
  }, [loadCritical, onSettled]);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const loader = loaderRef.current;
    if (!loader) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const siblings = [...(loader.parentElement?.children ?? [])]
      .filter((element): element is HTMLElement =>
        element instanceof HTMLElement && element !== loader,
      )
      .map((element) => ({ element, wasInert: element.hasAttribute('inert') }));
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      loader.focus();
    };

    siblings.forEach(({ element }) => element.setAttribute('inert', ''));
    loader.addEventListener('keydown', keepFocusInside);
    loader.focus();

    return () => {
      loader.removeEventListener('keydown', keepFocusInside);
      siblings.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      className={styles.loader}
      data-testid="portfolio-loader"
      data-state={state}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className={styles.orb} aria-hidden="true" />
      <div
        className={styles.copy}
        role="status"
        aria-live="polite"
        aria-busy={state === 'modal'}
      >
        <p id={titleId}>LOADING CREATIVE SYSTEM</p>
        <strong>{percent}%</strong>
        <span>{loadingTopics[topic]}</span>
      </div>
    </div>
  );
}
