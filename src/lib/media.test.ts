import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest } from './media';

describe('loadMediaManifest', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads from the Vite base URL and resolves every manifest asset against it', async () => {
    const base = import.meta.env.BASE_URL;
    const manifest = {
      portrait: {
        poster: 'media/portrait/poster.webp',
        desktop: { pattern: 'media/portrait/desktop/frame-%04d.webp', count: 120 },
        mobile: { pattern: 'media/portrait/mobile/frame-%04d.webp', count: 96 },
      },
      film: { src: 'media/film/ai-product-film.mp4', poster: 'media/film/poster.webp' },
      workflow: { src: 'media/workflow/comfyui-workflow.webp' },
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(manifest) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadMediaManifest()).resolves.toEqual({
      portrait: {
        poster: `${base}media/portrait/poster.webp`,
        desktop: { pattern: `${base}media/portrait/desktop/frame-%04d.webp`, count: 120 },
        mobile: { pattern: `${base}media/portrait/mobile/frame-%04d.webp`, count: 96 },
      },
      film: {
        src: `${base}media/film/ai-product-film.mp4`,
        poster: `${base}media/film/poster.webp`,
      },
      workflow: { src: `${base}media/workflow/comfyui-workflow.webp` },
    });
    expect(fetchMock).toHaveBeenCalledWith(`${base}media/media-manifest.json`);
  });

  it('rejects a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(loadMediaManifest()).rejects.toThrow('Media manifest failed: 500');
  });
});
