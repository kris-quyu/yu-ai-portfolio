import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest, resolveMediaUrl } from '../../lib/media';
import { FeaturedFilm } from './FeaturedFilm';

vi.mock('../../lib/media', async (importOriginal) => {
  const media = await importOriginal<typeof import('../../lib/media')>();
  return { ...media, loadMediaManifest: vi.fn() };
});

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    IntersectionObserverStub.instances.push(this);
  }

  emit(entry: Partial<IntersectionObserverEntry>) {
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

const manifest = {
  portrait: {
    poster: '/portfolio/media/portrait/poster.webp',
    desktop: { pattern: '/portfolio/media/portrait/desktop/frame-%04d.webp', count: 120 },
    mobile: { pattern: '/portfolio/media/portrait/mobile/frame-%04d.webp', count: 96 },
  },
  film: {
    src: '/portfolio/media/film/ai-product-film.mp4',
    poster: '/portfolio/media/film/poster.webp',
  },
  workflow: { src: '/portfolio/media/workflow/comfyui-workflow.webp' },
};

describe('FeaturedFilm', () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();

  beforeEach(() => {
    IntersectionObserverStub.instances = [];
    vi.clearAllMocks();
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.mocked(loadMediaManifest).mockResolvedValue(manifest);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause);
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the one approved film with manifest-resolved media', async () => {
    render(<FeaturedFilm />);

    expect(screen.getAllByRole('heading', { name: 'AI PRODUCT FILM' })).toHaveLength(1);
    const preview = await screen.findByLabelText('AI 产品视频预览');
    expect(preview).toHaveAttribute('src', manifest.film.src);
    expect(preview).toHaveAttribute('poster', manifest.film.poster);
    expect(preview).toHaveProperty('muted', true);
    expect(preview).toHaveAttribute('loop');
    expect(preview).toHaveAttribute('playsinline');
  });

  it('opens a named player dialog from the film control', async () => {
    const user = userEvent.setup();
    render(<FeaturedFilm />);

    await user.click(screen.getByRole('button', { name: '播放 AI 产品视频' }));

    expect(screen.getByRole('dialog', { name: 'AI PRODUCT FILM' })).toBeInTheDocument();
    expect(screen.getByLabelText('AI 产品视频播放器')).toHaveAttribute('src', manifest.film.src);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
  });

  it.each([
    ['the close button', async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: '关闭视频播放器' }));
    }],
    ['Escape', async (user: ReturnType<typeof userEvent.setup>) => {
      await user.keyboard('{Escape}');
    }],
    ['the overlay', async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByTestId('film-overlay'));
    }],
  ])('closes the dialog with %s and restores focus', async (_path, close) => {
    const user = userEvent.setup();
    render(<FeaturedFilm />);
    const trigger = screen.getByRole('button', { name: '播放 AI 产品视频' });
    await user.click(trigger);

    await close(user);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('pauses and resets the dialog video when closing', async () => {
    const user = userEvent.setup();
    render(<FeaturedFilm />);
    await user.click(screen.getByRole('button', { name: '播放 AI 产品视频' }));
    const dialogVideo = screen.getByLabelText('AI 产品视频播放器') as HTMLVideoElement;
    Object.defineProperty(dialogVideo, 'currentTime', { configurable: true, value: 12, writable: true });

    await user.click(screen.getByRole('button', { name: '关闭视频播放器' }));

    expect(pause).toHaveBeenCalled();
    expect(dialogVideo.currentTime).toBe(0);
  });

  it('plays the muted preview only at the 55 percent viewport threshold', async () => {
    render(<FeaturedFilm />);
    const preview = await screen.findByLabelText('AI 产品视频预览');
    const observer = IntersectionObserverStub.instances[0];

    expect(observer.options).toEqual({ threshold: 0.55 });
    act(() => observer.emit({ isIntersecting: true, intersectionRatio: 0.55, target: preview }));
    await waitFor(() => expect(play).toHaveBeenCalled());
    act(() => observer.emit({ isIntersecting: false, intersectionRatio: 0, target: preview }));
    expect(pause).toHaveBeenCalled();
  });

  it('keeps a base-safe poster and play control when the manifest cannot load', async () => {
    vi.mocked(loadMediaManifest).mockRejectedValue(new Error('Media manifest failed'));
    render(<FeaturedFilm />);

    const preview = screen.getByLabelText('AI 产品视频预览');
    expect(preview).toHaveAttribute('src', resolveMediaUrl('media/film/ai-product-film.mp4'));
    expect(preview).toHaveAttribute('poster', resolveMediaUrl('media/film/poster.webp'));
    expect(screen.getByRole('button', { name: '播放 AI 产品视频' })).toBeInTheDocument();
  });
});
