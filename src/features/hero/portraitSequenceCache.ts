import { loadFrameSequence, type FrameLoadOptions } from './frameLoader';

export interface PortraitSequenceCacheOptions extends FrameLoadOptions {}

interface Consumer {
  onProgress?: (loaded: number, total: number) => void;
}

interface CacheEntry {
  controller: AbortController;
  promise: Promise<HTMLImageElement[]>;
  loaded: number;
  total: number;
  consumers: Set<Consumer>;
  completed: boolean;
  failed: boolean;
}

const cache = new Map<string, CacheEntry>();

const cacheKey = ({ pattern, count }: PortraitSequenceCacheOptions) => `${pattern}:${count}`;
const abortError = () => new DOMException('Aborted', 'AbortError');

function createEntry({ posterUrl, pattern, count, concurrency }: PortraitSequenceCacheOptions) {
  const controller = new AbortController();
  const entry: CacheEntry = {
    controller,
    loaded: 0,
    total: 0,
    consumers: new Set(),
    completed: false,
    failed: false,
    promise: Promise.resolve([]),
  };
  const key = cacheKey({ posterUrl, pattern, count });

  entry.promise = loadFrameSequence({
    posterUrl,
    pattern,
    count,
    concurrency,
    signal: controller.signal,
    onProgress: (loaded, total) => {
      entry.loaded = loaded;
      entry.total = total;
      entry.consumers.forEach((consumer) => consumer.onProgress?.(loaded, total));
    },
  }).then(
    (frames) => {
      entry.completed = true;
      return frames;
    },
    (error: unknown) => {
      entry.failed = true;
      if (cache.get(key) === entry) cache.delete(key);
      throw error;
    },
  );
  cache.set(key, entry);
  return entry;
}

function consume(
  entry: CacheEntry,
  key: string,
  signal: AbortSignal | undefined,
  onProgress: ((loaded: number, total: number) => void) | undefined,
) {
  return new Promise<HTMLImageElement[]>((resolve, reject) => {
    const consumer: Consumer = { onProgress };
    let settled = false;

    const release = () => {
      entry.consumers.delete(consumer);
      signal?.removeEventListener('abort', abort);
      if (!entry.completed && !entry.failed && entry.consumers.size === 0) {
        if (cache.get(key) === entry) cache.delete(key);
        entry.controller.abort();
      }
    };
    const finish = (error?: unknown, frames?: HTMLImageElement[]) => {
      if (settled) return;
      settled = true;
      release();
      if (error) reject(error);
      else resolve(frames ?? []);
    };
    const abort = () => finish(abortError());

    entry.consumers.add(consumer);
    if (entry.total > 0) onProgress?.(entry.loaded, entry.total);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) {
      abort();
      return;
    }

    entry.promise.then(
      (frames) => finish(undefined, frames),
      (error: unknown) => finish(error),
    );
  });
}

export function loadPortraitSequenceCached({
  posterUrl,
  pattern,
  count,
  concurrency,
  signal,
  onProgress,
}: PortraitSequenceCacheOptions): Promise<HTMLImageElement[]> {
  if (signal?.aborted) return Promise.reject(abortError());

  const key = cacheKey({ posterUrl, pattern, count });
  const entry = cache.get(key) ?? createEntry({ posterUrl, pattern, count, concurrency });
  return consume(entry, key, signal, onProgress);
}
