import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('no-JavaScript fallback', () => {
  it('keeps the portfolio identity, proof, film, and contact reachable without JavaScript', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const document = new DOMParser().parseFromString(html, 'text/html');
    const fallback = document.querySelector('noscript');

    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toContain('QX / AI LAB');
    expect(fallback?.textContent).toContain('BUILDING CREATIVE WORKFLOWS.');
    expect(fallback?.textContent).toContain('AI PRODUCT FILM');
    expect(fallback?.textContent).toContain('ComfyUI');
    expect(fallback?.textContent).toContain('1282736393@qq.com');

    const links = Array.from(fallback?.querySelectorAll('a') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(expect.arrayContaining([
      '/yu-ai-portfolio/media/film/ai-product-film.mp4',
      '/yu-ai-portfolio/media/workflow/comfyui-workflow.webp',
      'mailto:1282736393@qq.com',
      'tel:13123986103',
    ]));

    expect(fallback?.querySelector('img')?.getAttribute('src')).toBe(
      '/yu-ai-portfolio/media/film/poster.webp',
    );
  });
});
