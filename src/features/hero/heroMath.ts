export type HeroPhase = 'push-in' | 'pull-back' | 'turn' | 'hold';

export interface HeroTransform {
  scale: number;
  focusX: number;
  focusY: number;
  phase: HeroPhase;
}

const clamp01 = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const segment = (value: number, start: number, end: number) => clamp01((value - start) / (end - start));

export function getHeroFrame(progress: number, frameCount: number): number {
  const count = Number.isFinite(frameCount) ? Math.floor(frameCount) : 0;
  if (count < 1) return 0;
  const sequenceProgress = clamp01(progress);
  if (sequenceProgress >= 0.82) return count - 1;
  return Math.min(count - 1, Math.round((sequenceProgress / 0.82) * count));
}

export function getHeroTransform(progress: number): HeroTransform {
  const p = clamp01(progress);
  if (p < 0.2) {
    const t = segment(p, 0, 0.2);
    return {
      scale: lerp(1, 1.55, t),
      focusX: lerp(0.67, 0.69, t),
      focusY: lerp(0.48, 0.28, t),
      phase: 'push-in',
    };
  }
  if (p < 0.55) {
    const t = segment(p, 0.2, 0.55);
    return {
      scale: lerp(1.55, 1, t),
      focusX: lerp(0.69, 0.67, t),
      focusY: lerp(0.28, 0.48, t),
      phase: 'pull-back',
    };
  }
  if (p < 0.82) return { scale: 1, focusX: 0.67, focusY: 0.48, phase: 'turn' };
  return { scale: 1, focusX: 0.67, focusY: 0.48, phase: 'hold' };
}

export function drawHeroFrame(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  transform: HeroTransform,
  canvasWidth: number,
  canvasHeight: number,
): void {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  if (image.width <= 0 || image.height <= 0 || canvasWidth <= 0 || canvasHeight <= 0) return;

  const coverScale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const drawWidth = image.width * coverScale * transform.scale;
  const drawHeight = image.height * coverScale * transform.scale;
  const x = canvasWidth * transform.focusX - drawWidth * transform.focusX;
  const y = canvasHeight * transform.focusY - drawHeight * transform.focusY;
  context.drawImage(image, x, y, drawWidth, drawHeight);
}
