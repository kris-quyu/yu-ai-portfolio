export type PortfolioLoadResult = 'ready' | 'degraded';

export interface LoadPortfolioOptions {
  signal?: AbortSignal;
  minimumMs: number;
  maximumMs: number;
  onProgress: (percent: number) => void;
  loadCritical: (
    report: (loaded: number, total: number) => void,
    signal: AbortSignal,
  ) => Promise<void>;
}

const delay = (milliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(resolve, Math.max(0, milliseconds));
});

export async function loadPortfolio({
  signal,
  minimumMs,
  maximumMs,
  onProgress,
  loadCritical,
}: LoadPortfolioOptions): Promise<PortfolioLoadResult> {
  const controller = new AbortController();
  let finished = false;
  const report = (loaded: number, total: number) => {
    if (finished) return;
    const percent = total > 0 ? (loaded / total) * 100 : 0;
    onProgress(Math.round(Math.min(100, Math.max(0, percent))));
  };

  const critical = Promise.resolve()
    .then(() => {
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      return loadCritical(report, controller.signal);
    })
    .then(() => {
      if (!finished) onProgress(100);
      return 'ready' as const;
    })
    .catch(() => 'degraded' as const);
  const minimum = delay(minimumMs);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const maximum = new Promise<PortfolioLoadResult>((resolve) => {
    timeoutId = setTimeout(() => resolve('degraded'), Math.max(0, maximumMs));
  });
  let cancel: (() => void) | undefined;
  const cancelled = new Promise<PortfolioLoadResult>((resolve) => {
    cancel = () => {
      controller.abort();
      resolve('degraded');
    };
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
  });

  try {
    const result = await Promise.race([
      Promise.all([critical, minimum]).then(([result]) => result),
      maximum,
      cancelled,
    ]);
    finished = true;
    if (result === 'degraded') controller.abort();
    return result;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (cancel) signal?.removeEventListener('abort', cancel);
  }
}
