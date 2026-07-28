import { describe, expect, it, vi } from 'vitest';
import { loadPortfolio } from './loadPortfolio';

describe('loadPortfolio', () => {
  it('reports real critical progress and respects the minimum duration', async () => {
    vi.useFakeTimers();
    const onProgress = vi.fn();
    const result = loadPortfolio({
      minimumMs: 1200,
      maximumMs: 6000,
      onProgress,
      loadCritical: (report) => {
        report(1, 3);
        report(2, 3);
        report(3, 3);
        return Promise.resolve();
      },
    });
    await vi.advanceTimersByTimeAsync(1199);
    expect(onProgress).toHaveBeenLastCalledWith(100);
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBe('ready');
  });

  it('returns degraded after the maximum duration instead of blocking forever', async () => {
    vi.useFakeTimers();
    const result = loadPortfolio({
      minimumMs: 1200,
      maximumMs: 6000,
      onProgress: vi.fn(),
      loadCritical: () => new Promise(() => undefined),
    });
    await vi.advanceTimersByTimeAsync(6000);
    await expect(result).resolves.toBe('degraded');
  });
});
