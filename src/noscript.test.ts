import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';

describe('no-JavaScript fallback and metadata', () => {
  it('describes the public YU portfolio with recruiter-facing metadata', () => {
    const document = new DOMParser().parseFromString(html, 'text/html');

    expect(document.title).toBe('YU｜AIGC 内容生产与 AI 工作流作品集');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe('AIGC 内容生产、AI 视频、ComfyUI、Python/API 与自动化工作流个人作品集。');
  });

  it('keeps all three truthful projects, shared evidence, and contacts readable without JavaScript', () => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const fallback = document.querySelector('noscript');
    const fallbackText = fallback?.textContent ?? '';

    expect(fallback).not.toBeNull();
    expect(fallbackText).toContain('QX / AI LAB · AIGC CONTENT & AI WORKFLOW');
    expect(fallbackText).toContain('AIGC 内容生产 / AI 工作流');
    expect(fallbackText).toContain('PROJECT 01 · AI PRODUCT FILM · COMPLETED');
    expect(fallbackText).toContain('PROJECT 02 · AI SHORT FILM WORKFLOW · COMPLETED');
    expect(fallbackText).toContain('与 Project 01 共用同一支成片');
    expect(fallbackText).toContain('PROJECT 03 · AI CONTENT WORKFLOW · IN DEVELOPMENT');
    expect(fallbackText).toContain('FFmpeg 流程串联处于实验阶段');
    expect(fallbackText).not.toMatch(/n8n|AI CONTENT CREATOR|TOOLS INTO SYSTEMS/i);

    const hrefs = Array.from(fallback?.querySelectorAll('a') ?? [], (link) =>
      link.getAttribute('href'),
    );
    expect(hrefs).toEqual(expect.arrayContaining([
      '/yu-ai-portfolio/media/film/ai-product-film.mp4',
      '/yu-ai-portfolio/media/projects/project-02/comfyui-continuity-workflow.webp',
      'mailto:1282736393@qq.com',
      'tel:13123986103',
    ]));
  });

  it('uses only the approved portfolio palette in the static fallback', () => {
    const rejected = ['#07100a', '#f3f7f2', '#a9ff1c', '#adb8ae', '#314033'];

    expect(html).toContain('#07160f');
    expect(html).toContain('#f3f1e8');
    expect(html).toContain('#b7ff2a');
    expect(html).toContain('#89958a');
    rejected.forEach((color) => expect(html).not.toContain(color));
  });
});
