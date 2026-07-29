import { describe, expect, it } from 'vitest';
import { getIntroTransform } from './introMath';

describe('getIntroTransform', () => {
  it('returns center-zero 3D title angles at the viewport center', () => {
    const transform = getIntroTransform(500, 300, 1000, 600);

    expect(transform).toEqual({
      rotateX: 0,
      rotateY: 0,
      normalizedX: 0,
      normalizedY: 0,
    });
    expect(Object.keys(transform).filter((key) => key.startsWith('rotate'))).toEqual([
      'rotateX',
      'rotateY',
    ]);
  });

  it.each([
    ['left edge', 0, 300, -20],
    ['right edge', 1000, 300, 20],
    ['past left edge', -1000, 300, -20],
    ['past right edge', 2000, 300, 20],
  ])('clamps the %s rotateY angle to the approved range', (_label, x, y, rotateY) => {
    expect(getIntroTransform(x, y, 1000, 600).rotateY).toBe(rotateY);
  });

  it.each([
    ['top edge', 500, 0, 20],
    ['bottom edge', 500, 600, -20],
    ['past top edge', 500, -600, 20],
    ['past bottom edge', 500, 1200, -20],
  ])('clamps the %s rotateX angle to the approved range', (_label, x, y, rotateX) => {
    expect(getIntroTransform(x, y, 1000, 600).rotateX).toBe(rotateX);
  });

  it('handles zero-sized viewports without returning non-finite values', () => {
    expect(getIntroTransform(0, 0, 0, 0)).toEqual({
      normalizedX: -1,
      normalizedY: -1,
      rotateX: 20,
      rotateY: -20,
    });
  });
});
