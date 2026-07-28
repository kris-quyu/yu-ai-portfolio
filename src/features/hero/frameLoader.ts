export interface FrameLoadOptions {
  pattern: string;
  count: number;
  concurrency?: number;
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}

const formatFrameUrl = (pattern: string, index: number) =>
  pattern.replace('%04d', String(index).padStart(4, '0'));

const abortError = () => new DOMException('Aborted', 'AbortError');

export async function loadFrameSequence({
  pattern,
  count,
  concurrency = 6,
  signal,
  onProgress,
}: FrameLoadOptions): Promise<HTMLImageElement[]> {
  const total = Math.max(0, Math.floor(count));
  if (total === 0) return [];
  if (signal?.aborted) throw abortError();

  const frames = new Array<HTMLImageElement>(total);
  const workerCount = Math.min(6, total, Math.max(1, Number.isFinite(concurrency) ? Math.floor(concurrency) : 6));
  let next = 0;
  let settled = 0;
  let failures = 0;

  const loadOne = (index: number) => new Promise<void>((resolve) => {
    const image = new Image();
    let complete = false;
    const finish = (failed: boolean, report = true) => {
      if (complete) return;
      complete = true;
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener('abort', onAbort);
      if (report) {
        if (failed) failures += 1;
        else frames[index] = image;
        settled += 1;
        onProgress?.(settled, total);
      }
      resolve();
    };
    const onAbort = () => finish(false, false);

    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }
    image.onload = () => finish(false);
    image.onerror = () => finish(true);
    image.src = formatFrameUrl(pattern, index + 1);
  });

  const worker = async () => {
    while (next < total) {
      if (signal?.aborted) throw abortError();
      const index = next++;
      await loadOne(index);
      if (signal?.aborted) throw abortError();
    }
  };

  await Promise.all(Array.from({ length: workerCount }, worker));
  if (failures / total > 0.05) throw new Error('Portrait frame loading failed');

  const fallback = frames.find((frame): frame is HTMLImageElement => Boolean(frame));
  if (!fallback) throw new Error('Portrait poster frame missing');
  for (let index = 0; index < frames.length; index += 1) {
    if (!frames[index]) frames[index] = frames[index - 1] ?? fallback;
  }
  return frames;
}
