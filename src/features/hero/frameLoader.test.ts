import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadFrameSequence } from './frameLoader';

class ControlledImage {
  static instances: ControlledImage[] = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    ControlledImage.instances.push(this);
  }

  static reset() {
    ControlledImage.instances = [];
  }
}

const settleLoads = () => {
  for (const image of [...ControlledImage.instances]) image.onload?.();
};

describe('loadFrameSequence', () => {
  afterEach(() => {
    ControlledImage.reset();
    vi.unstubAllGlobals();
  });

  it('formats frame numbers with four digits', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({
      posterUrl: 'media/poster.webp',
      pattern: 'media/frame-%04d.webp',
      count: 3,
      concurrency: 3,
    });

    expect(ControlledImage.instances.map((image) => image.src)).toEqual(['media/poster.webp']);
    ControlledImage.instances[0].onload?.();
    await Promise.resolve();
    expect(ControlledImage.instances.map((image) => image.src)).toEqual([
      'media/poster.webp',
      'media/frame-0001.webp',
      'media/frame-0002.webp',
      'media/frame-0003.webp',
    ]);
    settleLoads();
    await expect(loading).resolves.toHaveLength(3);
  });

  it('preserves frame order when images settle out of order', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ posterUrl: 'poster.webp', pattern: 'frame-%04d.webp', count: 3, concurrency: 3 });
    ControlledImage.instances[0].onload?.();
    await Promise.resolve();
    const [, first, second, third] = ControlledImage.instances;

    third.onload?.();
    second.onload?.();
    first.onload?.();

    await expect(loading).resolves.toEqual([first, second, third]);
  });

  it('reports progress after each settled image', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const onProgress = vi.fn();
    const loading = loadFrameSequence({ posterUrl: 'poster.webp', pattern: 'frame-%04d.webp', count: 3, concurrency: 3, onProgress });

    ControlledImage.instances[0].onload?.();
    await Promise.resolve();
    ControlledImage.instances[2].onload?.();
    ControlledImage.instances[3].onload?.();
    ControlledImage.instances[1].onload?.();
    await loading;

    expect(onProgress.mock.calls).toEqual([[1, 3], [2, 3], [3, 3]]);
  });

  it('stops with an AbortError when its signal is aborted during loading', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const controller = new AbortController();
    const loading = loadFrameSequence({
      posterUrl: 'poster.webp',
      pattern: 'frame-%04d.webp',
      count: 3,
      concurrency: 1,
      signal: controller.signal,
    });

    ControlledImage.instances[0].onload?.();
    await Promise.resolve();
    controller.abort();

    await expect(loading).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects when failures exceed five percent of the sequence', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ posterUrl: 'poster.webp', pattern: 'frame-%04d.webp', count: 20, concurrency: 20 });

    ControlledImage.instances[0].onload?.();
    await Promise.resolve();

    let settled = 1;
    while (settled <= 20) {
      const batch = ControlledImage.instances.slice(settled);
      batch.forEach((image, index) => {
        if (settled === 1 && index < 2) image.onerror?.();
        else image.onload?.();
      });
      settled += batch.length;
      await Promise.resolve();
    }

    await expect(loading).rejects.toThrow('Portrait frame loading failed');
  });

  it('validates the poster before starting the frame queue', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ posterUrl: 'media/portrait/poster.webp', pattern: 'frame-%04d.webp', count: 1 });

    expect(ControlledImage.instances.map((image) => image.src)).toEqual(['media/portrait/poster.webp']);
    ControlledImage.instances[0].onload?.();
    await Promise.resolve();
    expect(ControlledImage.instances.map((image) => image.src)).toEqual([
      'media/portrait/poster.webp',
      'frame-0001.webp',
    ]);
    ControlledImage.instances[1].onload?.();
    await expect(loading).resolves.toHaveLength(1);
  });

  it('rejects when poster validation fails', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ posterUrl: 'media/portrait/poster.webp', pattern: 'frame-%04d.webp', count: 1 });

    ControlledImage.instances[0].onerror?.();

    await expect(loading).rejects.toThrow('Portrait poster loading failed');
    expect(ControlledImage.instances).toHaveLength(1);
  });
});
