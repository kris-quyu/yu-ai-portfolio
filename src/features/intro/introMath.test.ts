import { describe, expect, it } from 'vitest';
import { getIntroTransform } from './introMath';

describe('getIntroTransform', () => {
  it('returns one flat zero rotation at the viewport center', () => {
    const transform = getIntroTransform(500, 300, 1000, 600);

    expect(transform).toEqual({
      rotateZ: 0,
      normalizedX: 0,
      normalizedY: 0,
    });
    expect(Object.keys(transform).filter((key) => key.startsWith('rotate'))).toEqual([
      'rotateZ',
    ]);
  });

  it.each([
    ['left edge', 0, 300, -20],
    ['right edge', 1000, 300, 20],
    ['past left edge', -1000, 300, -20],
    ['past right edge', 2000, 300, 20],
  ])('clamps the %s rotation to the approved range', (_label, x, y, rotateZ) => {
    expect(getIntroTransform(x, y, 1000, 600).rotateZ).toBe(rotateZ);
  });

  it.each([
    ['top', 500, 0],
    ['bottom', 500, 600],
    ['top-left', 0, 0],
    ['bottom-right', 1000, 600],
  ])('keeps the %s pointer rotation within plus or minus 20 degrees', (_label, x, y) => {
    const { rotateZ } = getIntroTransform(x, y, 1000, 600);

    expect(rotateZ).toBeGreaterThanOrEqual(-20);
    expect(rotateZ).toBeLessThanOrEqual(20);
  });

  it('handles zero-sized viewports without returning non-finite values', () => {
    expect(getIntroTransform(0, 0, 0, 0)).toEqual({
      normalizedX: -1,
      normalizedY: -1,
      rotateZ: -20,
    });
  });
});
