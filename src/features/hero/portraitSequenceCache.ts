import { loadFrameSequence, type FrameLoadOptions } from './frameLoader';

export interface PortraitSequenceCacheOptions extends FrameLoadOptions {}

interface CacheEntry {
  promise: Promise<HTMLImageElement[]>;
  loaded: number;
  total: number;
  listeners: Set<(loaded: number, total: number) => void>;
}

const cache = new Map<string, CacheEntry>();

const cacheKey = ({ pattern, count }: PortraitSequenceCacheOptions) => `${pattern}:${count}`;

export function loadPortraitSequenceCached({
  posterUrl,
  pattern,
  count,
  concurrency,
  signal,
  onProgress,
}: PortraitSequenceCacheOptions): Promise<HTMLImageElement[]> {
  const key = cacheKey({ posterUrl, pattern, count });
  let entry = cache.get(key);

  if (!entry) {
    const listeners = new Set<(loaded: number, total: number) => void>();
    const next: CacheEntry = {
      loaded: 0,
      total: 0,
      listeners,
      promise: Promise.resolve([]),
    };
    next.promise = loadFrameSequence({
      posterUrl,
      pattern,
      count,
      concurrency,
      signal,
      onProgress: (loaded, total) => {
        next.loaded = loaded;
        next.total = total;
        next.listeners.forEach((listener) => listener(loaded, total));
      },
    }).catch((error: unknown) => {
      if (cache.get(key) === next) cache.delete(key);
      throw error;
    });
    entry = next;
    cache.set(key, entry);
  }

  if (onProgress) {
    entry.listeners.add(onProgress);
    if (entry.total > 0) onProgress(entry.loaded, entry.total);
  }

  return entry.promise;
}
