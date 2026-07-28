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
    const loading = loadFrameSequence({ pattern: 'media/frame-%04d.webp', count: 3, concurrency: 3 });

    expect(ControlledImage.instances.map((image) => image.src)).toEqual([
      'media/frame-0001.webp',
      'media/frame-0002.webp',
      'media/frame-0003.webp',
    ]);
    settleLoads();
    await expect(loading).resolves.toHaveLength(3);
  });

  it('preserves frame order when images settle out of order', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ pattern: 'frame-%04d.webp', count: 3, concurrency: 3 });
    const [first, second, third] = ControlledImage.instances;

    third.onload?.();
    second.onload?.();
    first.onload?.();

    await expect(loading).resolves.toEqual([first, second, third]);
  });

  it('reports progress after each settled image', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const onProgress = vi.fn();
    const loading = loadFrameSequence({ pattern: 'frame-%04d.webp', count: 3, concurrency: 3, onProgress });

    ControlledImage.instances[1].onload?.();
    ControlledImage.instances[2].onload?.();
    ControlledImage.instances[0].onload?.();
    await loading;

    expect(onProgress.mock.calls).toEqual([[1, 3], [2, 3], [3, 3]]);
  });

  it('stops with an AbortError when its signal is aborted during loading', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const controller = new AbortController();
    const loading = loadFrameSequence({ pattern: 'frame-%04d.webp', count: 3, concurrency: 1, signal: controller.signal });

    controller.abort();
    ControlledImage.instances[0].onload?.();

    await expect(loading).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects when failures exceed five percent of the sequence', async () => {
    vi.stubGlobal('Image', ControlledImage);
    const loading = loadFrameSequence({ pattern: 'frame-%04d.webp', count: 20, concurrency: 20 });

    let settled = 0;
    while (settled < 20) {
      const batch = ControlledImage.instances.slice(settled);
      batch.forEach((image, index) => {
        if (settled === 0 && index < 2) image.onerror?.();
        else image.onload?.();
      });
      settled += batch.length;
      await Promise.resolve();
    }

    await expect(loading).rejects.toThrow('Portrait frame loading failed');
  });
});
