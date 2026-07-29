const clamp = (value: number) => Math.min(1, Math.max(-1, value));

export function getIntroTransform(
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
  maxTilt = 20,
) {
  const normalizedX = clamp(((pointerX / Math.max(width, 1)) - 0.5) * 2);
  const normalizedY = clamp(((pointerY / Math.max(height, 1)) - 0.5) * 2);

  return {
    normalizedX,
    normalizedY,
    rotateX: normalizedY === 0 ? 0 : normalizedY * -maxTilt,
    rotateY: normalizedX === 0 ? 0 : normalizedX * maxTilt,
  };
}
