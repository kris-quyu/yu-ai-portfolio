import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PortfolioLoader,
  loadCriticalAssets,
  type CriticalAssetLoaders,
} from './PortfolioLoader';
import type { MediaManifest } from '../../lib/media';

const manifest: MediaManifest = {
  portrait: {
    poster: '/yu-ai-portfolio/media/portrait/poster.webp',
    desktop: {
      pattern: '/yu-ai-portfolio/media/portrait/desktop/frame-%04d.webp',
      count: 120,
    },
    mobile: {
      pattern: '/yu-ai-portfolio/media/portrait/mobile/frame-%04d.webp',
      count: 96,
    },
  },
  film: {
    src: '/yu-ai-portfolio/media/film/ai-product-film.mp4',
    poster: '/yu-ai-portfolio/media/film/poster.webp',
  },
  workflow: { src: '/yu-ai-portfolio/media/projects/project-02/workflow.webp' },
  projects: {
    project02: {
      workflow: { src: '/workflow.webp', alt: 'workflow' },
      sceneDevelopment: { src: '/scene.webp', alt: 'scene' },
      continuityGeneration: { src: '/continuity.webp', alt: 'continuity' },
    },
  },
};

describe('PortfolioLoader', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows the approved loading copy and percentage on every mount', () => {
    render(<PortfolioLoader loadCritical={() => new Promise(() => undefined)} />);
    expect(screen.getByText('LOADING CREATIVE SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('AI 内容')).toBeInTheDocument();
  });

  it('owns focus and makes sibling application content inert while the modal is visible', async () => {
    const previous = document.createElement('button');
    previous.textContent = 'before loader';
    document.body.append(previous);
    previous.focus();
    const host = document.createElement('div');
    document.body.append(host);

    const { unmount } = render(
      <>
        <PortfolioLoader loadCritical={() => new Promise(() => undefined)} />
        <button type="button">underlying action</button>
      </>,
      { container: host },
    );

    const dialog = screen.getByRole('dialog', { name: 'LOADING CREATIVE SYSTEM' });
    const underlying = screen.getByRole('button', { name: 'underlying action' });
    await waitFor(() => expect(dialog).toHaveFocus());
    expect(underlying).toHaveAttribute('inert');
    expect(withinStatus(dialog)).toHaveAttribute('aria-live', 'polite');

    unmount();

    expect(underlying).not.toHaveAttribute('inert');
    expect(previous).toHaveFocus();
    host.remove();
    previous.remove();
  });

  it.each([
    ['ready', () => Promise.resolve()],
    ['degraded', () => Promise.reject(new Error('critical asset failed'))],
  ])('restores focus and inert state after the %s reveal finishes', async (_result, loadCritical) => {
    vi.useFakeTimers();
    const previous = document.createElement('button');
    previous.textContent = `return focus ${_result}`;
    document.body.append(previous);
    previous.focus();

    render(
      <>
        <PortfolioLoader loadCritical={loadCritical} />
        <button type="button">application action {_result}</button>
      </>,
    );
    const appAction = screen.getByRole('button', { name: `application action ${_result}` });
    expect(appAction).toHaveAttribute('inert');

    await act(() => vi.advanceTimersByTimeAsync(1900));

    expect(screen.queryByRole('dialog', { name: 'LOADING CREATIVE SYSTEM' }))
      .not.toBeInTheDocument();
    expect(appAction).not.toHaveAttribute('inert');
    expect(previous).toHaveFocus();
    previous.remove();
  });

  it('cycles through the approved Chinese topics on the existing interval', async () => {
    vi.useFakeTimers();
    render(<PortfolioLoader loadCritical={() => new Promise(() => undefined)} />);

    expect(screen.getByText('AI 内容')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('视频工作流')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('电商转化')).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(screen.getByText('AI 内容')).toBeInTheDocument();
  });

  it('becomes non-modal after loading and then unmounts the overlay', async () => {
    vi.useFakeTimers();
    render(<PortfolioLoader loadCritical={() => Promise.resolve()} />);
    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.getByTestId('portfolio-loader')).toHaveAttribute('data-state', 'revealing');
    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(screen.queryByTestId('portfolio-loader')).not.toBeInTheDocument();
  });

  it('locks body scrolling until the visible overlay has finished revealing', async () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    render(<PortfolioLoader loadCritical={() => Promise.resolve()} />);

    expect(document.body.style.overflow).toBe('hidden');
    await vi.advanceTimersByTimeAsync(1200);
    await vi.advanceTimersByTimeAsync(0);
    expect(document.body.style.overflow).toBe('hidden');
    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(document.body.style.overflow).toBe('auto');
  });

  it('enters after critical assets without waiting for the full portrait sequence', async () => {
    const report = vi.fn();
    const warmSequence = vi.fn(() => new Promise<unknown>(() => undefined));
    const loaders: CriticalAssetLoaders = {
      loadManifest: vi.fn().mockResolvedValue(manifest),
      waitForFonts: vi.fn().mockResolvedValue(undefined),
      preloadImages: vi.fn().mockResolvedValue(undefined),
      loadKeyFrames: vi.fn().mockResolvedValue(undefined),
      warmSequence,
    };

    await expect(loadCriticalAssets(report, loaders)).resolves.toBeUndefined();

    expect(warmSequence).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenLastCalledWith(4, 4);
  });

  it('loads the poster and four desktop key frames before starting background warming', async () => {
    vi.stubGlobal('innerWidth', 1440);
    const loadKeyFrames = vi.fn().mockResolvedValue(undefined);
    const preloadImages = vi.fn().mockResolvedValue(undefined);
    const loaders: CriticalAssetLoaders = {
      loadManifest: vi.fn().mockResolvedValue(manifest),
      waitForFonts: vi.fn().mockResolvedValue(undefined),
      preloadImages,
      loadKeyFrames,
      warmSequence: vi.fn().mockResolvedValue(undefined),
    };

    await loadCriticalAssets(vi.fn(), loaders);

    expect(preloadImages).toHaveBeenCalledWith([manifest.portrait.poster]);
    expect(loadKeyFrames).toHaveBeenCalledWith(
      manifest.portrait.desktop.pattern,
      [1, 41, 81, 120],
    );
  });

  it('contains a rejected background warm-up after critical readiness', async () => {
    const warmSequence = vi.fn().mockRejectedValue(new Error('background frame failed'));
    const loaders: CriticalAssetLoaders = {
      loadManifest: vi.fn().mockResolvedValue(manifest),
      waitForFonts: vi.fn().mockResolvedValue(undefined),
      preloadImages: vi.fn().mockResolvedValue(undefined),
      loadKeyFrames: vi.fn().mockResolvedValue(undefined),
      warmSequence,
    };

    await expect(loadCriticalAssets(vi.fn(), loaders)).resolves.toBeUndefined();
    await Promise.resolve();

    expect(warmSequence).toHaveBeenCalledTimes(1);
  });

  it('does not warm the full portrait sequence when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const warmSequence = vi.fn().mockResolvedValue(undefined);
    const loaders: CriticalAssetLoaders = {
      loadManifest: vi.fn().mockResolvedValue(manifest),
      waitForFonts: vi.fn().mockResolvedValue(undefined),
      preloadImages: vi.fn().mockResolvedValue(undefined),
      loadKeyFrames: vi.fn().mockResolvedValue(undefined),
      warmSequence,
    };

    await loadCriticalAssets(vi.fn(), loaders);

    expect(warmSequence).not.toHaveBeenCalled();
  });
});

const withinStatus = (dialog: HTMLElement) => {
  const status = dialog.querySelector<HTMLElement>('[role="status"]');
  if (!status) throw new Error('Expected a nested live status');
  return status;
};
