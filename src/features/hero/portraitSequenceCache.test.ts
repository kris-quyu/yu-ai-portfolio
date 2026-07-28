import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadFrameSequence } from './frameLoader';
import { loadPortraitSequenceCached } from './portraitSequenceCache';

vi.mock('./frameLoader', () => ({
  loadFrameSequence: vi.fn(),
}));

describe('loadPortraitSequenceCached', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shares one in-flight frame request between loader and hero consumers', async () => {
    const pending = Promise.resolve([{ width: 1600, height: 900 } as HTMLImageElement]);
    vi.mocked(loadFrameSequence).mockReturnValue(pending);
    const options = {
      posterUrl: '/poster.webp',
      pattern: '/frame-%04d.webp',
      count: 120,
    };

    const first = loadPortraitSequenceCached(options);
    const second = loadPortraitSequenceCached(options);

    expect(loadFrameSequence).toHaveBeenCalledTimes(1);
    await expect(first).resolves.toHaveLength(1);
    await expect(second).resolves.toHaveLength(1);
  });

  it('replays current progress to a late consumer and retries after a failed request', async () => {
    let report: ((loaded: number, total: number) => void) | undefined;
    vi.mocked(loadFrameSequence).mockImplementation(({ onProgress }) => {
      report = onProgress;
      return Promise.reject(new Error('network failed'));
    });
    const firstProgress = vi.fn();
    const secondProgress = vi.fn();
    const options = {
      posterUrl: '/poster.webp',
      pattern: '/retry-frame-%04d.webp',
      count: 120,
    };

    const first = loadPortraitSequenceCached({ ...options, onProgress: firstProgress });
    report?.(12, 120);
    const second = loadPortraitSequenceCached({ ...options, onProgress: secondProgress });

    expect(secondProgress).toHaveBeenLastCalledWith(12, 120);
    await expect(first).rejects.toThrow('network failed');
    await expect(second).rejects.toThrow('network failed');

    vi.mocked(loadFrameSequence).mockResolvedValue([
      { width: 1600, height: 900 } as HTMLImageElement,
    ]);
    await expect(loadPortraitSequenceCached(options)).resolves.toHaveLength(1);
    expect(loadFrameSequence).toHaveBeenCalledTimes(2);
  });
});
