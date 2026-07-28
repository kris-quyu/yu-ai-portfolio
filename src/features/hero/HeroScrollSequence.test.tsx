import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest, resolveMediaUrl } from '../../lib/media';
import { loadPortraitSequenceCached } from './portraitSequenceCache';
import { HeroScrollSequence } from './HeroScrollSequence';
import heroCss from './HeroScrollSequence.module.css?raw';

const scrollTrigger = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: { registerPlugin: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: scrollTrigger,
}));

vi.mock('../../lib/media', async (importOriginal) => {
  const media = await importOriginal<typeof import('../../lib/media')>();
  return { ...media, loadMediaManifest: vi.fn() };
});

vi.mock('./portraitSequenceCache', () => ({
  loadPortraitSequenceCached: vi.fn(),
}));

const manifest = {
  portrait: {
    poster: '/portfolio/media/portrait/poster.webp',
    desktop: {
      pattern: '/portfolio/media/portrait/desktop/frame-%04d.webp',
      count: 120,
    },
    mobile: {
      pattern: '/portfolio/media/portrait/mobile/frame-%04d.webp',
      count: 96,
    },
  },
  film: {
    src: '/portfolio/media/film/ai-product-film.mp4',
    poster: '/portfolio/media/film/poster.webp',
  },
  workflow: {
    src: '/portfolio/media/workflow/comfyui-workflow.webp',
  },
};

const initialPosterUrl = resolveMediaUrl('media/portrait/poster.webp');

const createMediaQuery = (matches = false) => {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  const mediaQuery = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((_type: string, next: (event: MediaQueryListEvent) => void) => {
      listener = next;
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  return {
    mediaQuery,
    update(next: boolean) {
      Object.defineProperty(mediaQuery, 'matches', { configurable: true, value: next });
      listener?.({ matches: next } as MediaQueryListEvent);
    },
  };
};

const getScrollUpdate = () => {
  const config = (scrollTrigger.create.mock.calls[0] as unknown[] | undefined)?.[0] as
    | { onUpdate: (self: { progress: number }) => void }
    | undefined;

  if (!config) throw new Error('ScrollTrigger configuration was not captured');
  return config.onUpdate;
};

describe('HeroScrollSequence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.mocked(loadPortraitSequenceCached).mockImplementation(() => new Promise(() => undefined));
    vi.stubGlobal('innerWidth', 1440);
    vi.stubGlobal('devicePixelRatio', 1);
    vi.stubGlobal('matchMedia', vi.fn(() => createMediaQuery().mediaQuery));
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 41));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 720,
      height: 450,
      x: 0,
      y: 0,
      top: 0,
      right: 720,
      bottom: 450,
      left: 0,
      toJSON: () => undefined,
    });
    scrollTrigger.create.mockReturnValue({ kill: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the first approved stage, canvas, and base-safe poster while frames load', async () => {
    render(<HeroScrollSequence />);

    expect(screen.getByRole('heading', { name: 'THINK WITH AI.', hidden: true })).toBeInTheDocument();
    expect(screen.getByText('鐞嗚В宸ュ叿')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('01 / 04')).toBeInTheDocument();
    expect(document.querySelector('#profile')).toHaveAttribute('aria-labelledby', 'hero-title');
    expect(screen.getByLabelText('滚动控制的动画人物')).toBeInTheDocument();
    expect(await screen.findByAltText('瞿先生动画人物')).toHaveAttribute(
      'src',
      manifest.portrait.poster,
    );
    expect(screen.getByRole('status')).toHaveTextContent('LOADING 0%');
  });

  it('renders a base-safe poster before the manifest resolves', () => {
    vi.mocked(loadMediaManifest).mockImplementation(() => new Promise(() => undefined));

    render(<HeroScrollSequence />);

    expect(screen.getByAltText('瞿先生动画人物')).toHaveAttribute('src', initialPosterUrl);
    expect(screen.getByAltText('瞿先生动画人物')).not.toHaveAttribute('aria-hidden');
  });

  it('keeps the initial poster accessible when the manifest request fails', async () => {
    vi.mocked(loadMediaManifest).mockRejectedValue(new Error('Media manifest failed: 500'));

    render(<HeroScrollSequence />);

    const poster = screen.getByAltText('瞿先生动画人物');
    expect(poster).toHaveAttribute('src', initialPosterUrl);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('STATIC PORTRAIT'));
    expect(poster).not.toHaveAttribute('aria-hidden');
  });

  it('loads the desktop sequence with the manifest poster URL', async () => {
    render(<HeroScrollSequence />);

    await waitFor(() => {
      expect(loadPortraitSequenceCached).toHaveBeenCalledWith(
        expect.objectContaining({
          posterUrl: manifest.portrait.poster,
          pattern: manifest.portrait.desktop.pattern,
          count: 120,
        }),
      );
    });
  });

  it('synchronizes capability copy and stage count with forward scroll phases', async () => {
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);
    render(<HeroScrollSequence />);
    await waitFor(() => expect(scrollTrigger.create).toHaveBeenCalled());
    const onUpdate = getScrollUpdate();

    act(() => onUpdate({ progress: 0.56 }));
    expect(
      screen.getByRole('heading', { name: 'BUILD THE WORKFLOW.', hidden: true }),
    ).toBeInTheDocument();
    expect(screen.getByText('涓茶仈娴佺▼')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('03 / 04')).toBeInTheDocument();

    act(() => onUpdate({ progress: 0.9 }));
    expect(
      screen.getByRole('heading', { name: 'DELIVER THE RESULT.', hidden: true }),
    ).toBeInTheDocument();
    expect(screen.getByText('鏈嶅姟杞寲')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('04 / 04')).toBeInTheDocument();
  });

  it('returns capability copy to the matching earlier phase when scroll reverses', async () => {
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);
    render(<HeroScrollSequence />);
    await waitFor(() => expect(scrollTrigger.create).toHaveBeenCalled());
    const onUpdate = getScrollUpdate();

    act(() => onUpdate({ progress: 0.9 }));
    act(() => onUpdate({ progress: 0.3 }));

    expect(
      screen.getByRole('heading', { name: 'SHAPE THE STORY.', hidden: true }),
    ).toBeInTheDocument();
    expect(screen.getByText('02 / 04')).toBeInTheDocument();
  });

  it('loads the composed mobile sequence below 768px', async () => {
    vi.stubGlobal('innerWidth', 390);

    render(<HeroScrollSequence />);

    await waitFor(() => {
      expect(loadPortraitSequenceCached).toHaveBeenCalledWith(
        expect.objectContaining({
          posterUrl: manifest.portrait.poster,
          pattern: manifest.portrait.mobile.pattern,
          count: 96,
        }),
      );
    });
  });

  it('uses only the static poster for reduced motion and removes its listener', async () => {
    const reduced = createMediaQuery(true);
    vi.stubGlobal('matchMedia', vi.fn(() => reduced.mediaQuery));

    const { unmount } = render(<HeroScrollSequence />);

    expect(await screen.findByAltText('瞿先生动画人物')).toHaveAttribute(
      'src',
      manifest.portrait.poster,
    );
    expect(screen.queryByLabelText('滚动控制的动画人物')).not.toBeInTheDocument();
    expect(loadPortraitSequenceCached).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'DELIVER THE RESULT.', hidden: true }),
    ).toBeInTheDocument();
    expect(screen.getByText('04 / 04')).toBeInTheDocument();

    const stageList = screen.getByRole('list', { name: '能力阶段概览', hidden: true });
    expect(within(stageList).getAllByRole('listitem', { hidden: true })).toHaveLength(4);
    expect(stageList).toHaveTextContent('THINK WITH AI.');
    expect(stageList).toHaveTextContent('SHAPE THE STORY.');
    expect(stageList).toHaveTextContent('BUILD THE WORKFLOW.');
    expect(stageList).toHaveTextContent('DELIVER THE RESULT.');

    unmount();
    expect(reduced.mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('falls back to the poster when the frame failure threshold is exceeded', async () => {
    vi.mocked(loadPortraitSequenceCached).mockRejectedValue(new Error('Portrait frame loading failed'));

    render(<HeroScrollSequence />);

    expect(await screen.findByAltText('瞿先生动画人物')).toHaveAttribute(
      'src',
      manifest.portrait.poster,
    );
    await waitFor(() => {
      expect(screen.queryByLabelText('滚动控制的动画人物')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveTextContent('STATIC PORTRAIT');
  });

  it('aborts loading on unmount and ignores stale asynchronous work', async () => {
    let signal: AbortSignal | undefined;
    let settle: ((frames: HTMLImageElement[]) => void) | undefined;
    vi.mocked(loadPortraitSequenceCached).mockImplementation((options) => {
      signal = options.signal;
      return new Promise((resolve) => {
        settle = resolve;
      });
    });

    const { unmount } = render(<HeroScrollSequence />);
    await waitFor(() => expect(loadPortraitSequenceCached).toHaveBeenCalled());

    unmount();
    expect(signal?.aborted).toBe(true);
    await act(async () => settle?.([{ width: 1600, height: 900 } as HTMLImageElement]));
    expect(scrollTrigger.create).not.toHaveBeenCalled();
  });

  it('sizes the canvas for DPR and cleans up ScrollTrigger and RAF', async () => {
    const kill = vi.fn();
    scrollTrigger.create.mockReturnValue({ kill });
    vi.stubGlobal('devicePixelRatio', 2);
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);

    const { unmount } = render(<HeroScrollSequence />);
    const canvas = await screen.findByLabelText('滚动控制的动画人物');

    await waitFor(() => expect(scrollTrigger.create).toHaveBeenCalled());
    expect(canvas).toHaveAttribute('width', '1440');
    expect(canvas).toHaveAttribute('height', '900');

    unmount();
    expect(kill).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalledWith(41);
  });

  it('exposes the poster until the first Canvas frame has been drawn', async () => {
    let nextFrame: FrameRequestCallback | undefined;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        nextFrame = callback;
        return 41;
      }),
    );
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);

    render(<HeroScrollSequence />);
    const poster = await screen.findByAltText('瞿先生动画人物');
    const canvas = screen.getByLabelText('滚动控制的动画人物');

    await waitFor(() => expect(scrollTrigger.create).toHaveBeenCalled());
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(poster).not.toHaveAttribute('aria-hidden');

    act(() => nextFrame?.(16));
    expect(canvas).not.toHaveAttribute('aria-hidden');
    expect(poster).toHaveAttribute('aria-hidden', 'true');
  });

  it('restores the poster when reduced motion turns on after a Canvas frame', async () => {
    const reduced = createMediaQuery(false);
    let nextFrame: FrameRequestCallback | undefined;
    vi.stubGlobal('matchMedia', vi.fn(() => reduced.mediaQuery));
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        nextFrame = callback;
        return 41;
      }),
    );
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);

    render(<HeroScrollSequence />);
    const poster = await screen.findByAltText('瞿先生动画人物');
    await waitFor(() => expect(scrollTrigger.create).toHaveBeenCalled());

    act(() => nextFrame?.(16));
    expect(poster).toHaveAttribute('aria-hidden', 'true');

    act(() => reduced.update(true));
    expect(poster).not.toHaveAttribute('aria-hidden');
    expect(screen.queryByLabelText('滚动控制的动画人物')).not.toBeInTheDocument();
  });

  it('switches to the poster when Canvas is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.mocked(loadPortraitSequenceCached).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);

    render(<HeroScrollSequence />);

    expect(await screen.findByAltText('瞿先生动画人物')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByLabelText('滚动控制的动画人物')).not.toBeInTheDocument();
    });
  });

  it('keeps identical 250vh scroll geometry and a 100svh sticky stage at every width', () => {
    expect(heroCss).toMatch(/\.hero\s*{[^}]*height:\s*250vh;/s);
    expect(heroCss).not.toContain('250svh');
    expect(heroCss).not.toContain('260svh');
    expect(heroCss).toMatch(/\.stage\s*{[^}]*height:\s*100svh;/s);
  });
});
