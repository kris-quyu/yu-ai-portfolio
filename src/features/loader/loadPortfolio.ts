export type PortfolioLoadResult = 'ready' | 'degraded';

export interface LoadPortfolioOptions {
  minimumMs: number;
  maximumMs: number;
  onProgress: (percent: number) => void;
  loadCritical: (report: (loaded: number, total: number) => void) => Promise<void>;
}

const delay = (milliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(resolve, Math.max(0, milliseconds));
});

export async function loadPortfolio({
  minimumMs,
  maximumMs,
  onProgress,
  loadCritical,
}: LoadPortfolioOptions): Promise<PortfolioLoadResult> {
  const report = (loaded: number, total: number) => {
    const percent = total > 0 ? (loaded / total) * 100 : 0;
    onProgress(Math.round(Math.min(100, Math.max(0, percent))));
  };

  const critical = Promise.resolve()
    .then(() => loadCritical(report))
    .then(() => {
      onProgress(100);
      return 'ready' as const;
    })
    .catch(() => 'degraded' as const);
  const minimum = delay(minimumMs);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const maximum = new Promise<PortfolioLoadResult>((resolve) => {
    timeoutId = setTimeout(() => resolve('degraded'), Math.max(0, maximumMs));
  });

  try {
    return await Promise.race([
      Promise.all([critical, minimum]).then(([result]) => result),
      maximum,
    ]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}
