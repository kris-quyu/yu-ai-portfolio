import { describe, expect, it, vi } from 'vitest';
import { drawHeroFrame, getHeroFrame, getHeroStageIndex, getHeroTransform } from './heroMath';

describe('getHeroStageIndex', () => {
  it('maps clamped progress to the four character phase boundaries', () => {
    expect(getHeroStageIndex(-1)).toBe(0);
    expect(getHeroStageIndex(0.199)).toBe(0);
    expect(getHeroStageIndex(0.2)).toBe(1);
    expect(getHeroStageIndex(0.549)).toBe(1);
    expect(getHeroStageIndex(0.55)).toBe(2);
    expect(getHeroStageIndex(0.819)).toBe(2);
    expect(getHeroStageIndex(0.82)).toBe(3);
    expect(getHeroStageIndex(2)).toBe(3);
  });
});

describe('getHeroFrame', () => {
  it('clamps scroll progress to valid frames, including an empty sequence', () => {
    expect(getHeroFrame(-1, 120)).toBe(0);
    expect(getHeroFrame(0.5, 120)).toBe(73);
    expect(getHeroFrame(1, 120)).toBe(119);
    expect(getHeroFrame(2, 120)).toBe(119);
    expect(getHeroFrame(0.5, 0)).toBe(0);
  });

  it('freezes on the final source frame throughout the hold phase', () => {
    expect(getHeroFrame(0.82, 120)).toBe(119);
    expect(getHeroFrame(0.9, 120)).toBe(119);
    expect(getHeroFrame(1, 120)).toBe(119);
  });
});

describe('getHeroTransform', () => {
  it('pushes in, pulls back, turns, then holds the final pose', () => {
    expect(getHeroTransform(0)).toMatchObject({ scale: 1, phase: 'push-in' });
    expect(getHeroTransform(0.2)).toMatchObject({ scale: 1.55, phase: 'pull-back' });
    expect(getHeroTransform(0.55)).toMatchObject({ scale: 1, phase: 'turn' });
    expect(getHeroTransform(0.9)).toMatchObject({ scale: 1, phase: 'hold' });
  });
});

describe('drawHeroFrame', () => {
  it('cover-crops around the requested focal point', () => {
    const context = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    const image = { width: 100, height: 100 } as CanvasImageSource & { width: number; height: number };

    drawHeroFrame(context, image, { scale: 2, focusX: 0.5, focusY: 0.25, phase: 'push-in' }, 300, 100);

    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 300, 100);
    expect(context.drawImage).toHaveBeenCalledWith(image, -150, -125, 600, 600);
  });
});
