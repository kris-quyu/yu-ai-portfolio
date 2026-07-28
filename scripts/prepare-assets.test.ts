import { describe, expect, it } from 'vitest';
import { buildFrameArgs, frameFileName } from './prepare-assets.mjs';

describe('portrait frame preparation', () => {
  it('builds 15 fps desktop WebP extraction arguments', () => {
    expect(buildFrameArgs('portrait.mp4', 15, 1600, 'out/frame-%04d.webp')).toEqual([
      '-y', '-i', 'portrait.mp4',
      '-vf', 'fps=15,scale=1600:-2:force_original_aspect_ratio=decrease:flags=lanczos',
      '-c:v', 'libwebp', '-quality', '78', '-compression_level', '4',
      'out/frame-%04d.webp',
    ]);
  });

  it('formats four-digit frame names', () => {
    expect(frameFileName(1)).toBe('frame-0001.webp');
    expect(frameFileName(120)).toBe('frame-0120.webp');
  });
});
