import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest } from '../../lib/media';
import { loadFrameSequence } from './frameLoader';
import { HeroScrollSequence } from './HeroScrollSequence';

const scrollTrigger = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: { registerPlugin: vi.fn() },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: scrollTrigger,
}));

vi.mock('../../lib/media', () => ({
  loadMediaManifest: vi.fn(),
}));

vi.mock('./frameLoader', () => ({
  loadFrameSequence: vi.fn(),
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

describe('HeroScrollSequence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.mocked(loadFrameSequence).mockImplementation(() => new Promise(() => undefined));
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

  it('renders the approved copy, canvas, and base-safe poster while frames load', async () => {
    const { container } = render(<HeroScrollSequence />);

    const heading = container.querySelector<HTMLHeadingElement>('#hero-title');
    expect(heading).toHaveTextContent('BUILDINGCREATIVEWORKFLOWS.');
    expect(container.querySelector('#profile')).toHaveAttribute('aria-labelledby', 'hero-title');
    expect(screen.getByLabelText('滚动控制的动画人物')).toBeInTheDocument();
    expect(await screen.findByAltText('瞿先生动画人物')).toHaveAttribute(
      'src',
      manifest.portrait.poster,
    );
    expect(screen.getByRole('status')).toHaveTextContent('LOADING 0%');
  });

  it('loads the desktop sequence with the manifest poster URL', async () => {
    render(<HeroScrollSequence />);

    await waitFor(() => {
      expect(loadFrameSequence).toHaveBeenCalledWith(
        expect.objectContaining({
          posterUrl: manifest.portrait.poster,
          pattern: manifest.portrait.desktop.pattern,
          count: 120,
        }),
      );
    });
  });

  it('loads the composed mobile sequence below 768px', async () => {
    vi.stubGlobal('innerWidth', 390);

    render(<HeroScrollSequence />);

    await waitFor(() => {
      expect(loadFrameSequence).toHaveBeenCalledWith(
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
    expect(loadFrameSequence).not.toHaveBeenCalled();

    unmount();
    expect(reduced.mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('falls back to the poster when the frame failure threshold is exceeded', async () => {
    vi.mocked(loadFrameSequence).mockRejectedValue(new Error('Portrait frame loading failed'));

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
    vi.mocked(loadFrameSequence).mockImplementation((options) => {
      signal = options.signal;
      return new Promise((resolve) => {
        settle = resolve;
      });
    });

    const { unmount } = render(<HeroScrollSequence />);
    await waitFor(() => expect(loadFrameSequence).toHaveBeenCalled());

    unmount();
    expect(signal?.aborted).toBe(true);
    await act(async () => settle?.([{ width: 1600, height: 900 } as HTMLImageElement]));
    expect(scrollTrigger.create).not.toHaveBeenCalled();
  });

  it('sizes the canvas for DPR and cleans up ScrollTrigger and RAF', async () => {
    const kill = vi.fn();
    scrollTrigger.create.mockReturnValue({ kill });
    vi.stubGlobal('devicePixelRatio', 2);
    vi.mocked(loadFrameSequence).mockResolvedValue([
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
    vi.mocked(loadFrameSequence).mockResolvedValue([
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

  it('switches to the poster when Canvas is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.mocked(loadFrameSequence).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);

    render(<HeroScrollSequence />);

    expect(await screen.findByAltText('瞿先生动画人物')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByLabelText('滚动控制的动画人物')).not.toBeInTheDocument();
    });
  });
});
