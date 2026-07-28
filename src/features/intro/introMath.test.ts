import { describe, expect, it } from 'vitest';
import { getIntroTransform } from './introMath';

describe('getIntroTransform', () => {
  it('returns zero rotation at the viewport center', () => {
    expect(getIntroTransform(500, 300, 1000, 600)).toEqual({
      rotateX: 0,
      rotateY: 0,
      normalizedX: 0,
      normalizedY: 0,
    });
  });

  it('reaches the approved 20 degree tilt at the viewport edge', () => {
    expect(getIntroTransform(1000, 0, 1000, 600)).toMatchObject({
      rotateX: 20,
      rotateY: 20,
    });
  });

  it('clamps coordinates outside the viewport to the approved tilt', () => {
    expect(getIntroTransform(2000, -1000, 1000, 600)).toEqual({
      normalizedX: 1,
      normalizedY: -1,
      rotateX: 20,
      rotateY: 20,
    });
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
