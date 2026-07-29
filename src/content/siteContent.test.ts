import { describe, expect, it } from 'vitest';
import { siteContent } from './siteContent';

describe('siteContent', () => {
  it('defines the approved intro and six-section navigation', () => {
    expect(siteContent.intro).toEqual({
      title: "HELLO, I'M YU",
      reveal: '你好，我是宇',
      annotation: 'AI AGENT PORTFOLIO / CREATIVE WORKFLOW SHOWCASE',
      hint: '移动鼠标探索 · 向下滚动查看更多',
    });
    expect(siteContent.navigation.map(({ id }) => id)).toEqual([
      'home', 'profile', 'film', 'system', 'capabilities', 'contact',
    ]);
  });

  it('defines the four bilingual hero stages verbatim', () => {
    expect(siteContent.hero.stages).toEqual([
      {
        id: 'think',
        phase: 'push-in',
        eyebrow: '01 / THINK',
        translation: '借助 AI 思考',
        title: 'THINK WITH AI.',
        summary: '理解 ComfyUI、n8n、Codex 等 AI 工具。',
      },
      {
        id: 'shape',
        phase: 'pull-back',
        eyebrow: '02 / SHAPE',
        translation: '塑造内容表达',
        title: 'SHAPE THE STORY.',
        summary: '把产品卖点转成脚本、分镜和画面。',
      },
      {
        id: 'build',
        phase: 'turn',
        eyebrow: '03 / BUILD',
        translation: '搭建创作工作流',
        title: 'BUILD THE WORKFLOW.',
        summary: '将生成、剪辑和自动化串成稳定流程。',
      },
      {
        id: 'deliver',
        phase: 'hold',
        eyebrow: '04 / DELIVER',
        translation: '交付转化结果',
        title: 'DELIVER THE RESULT.',
        summary: '让内容最终服务用户理解与电商转化。',
      },
    ]);
  });

  it('defines all 18 approved bilingual capability growth pairs verbatim', () => {
    expect(siteContent.capabilities.map(({ id, mastered, growing, next }) => ({
      id, mastered, growing, next,
    }))).toEqual([
      { id: 'automation', mastered: { zh: 'AI 工作流搭建与自动化', en: 'AI workflow setup and automation' }, growing: { zh: '稳定的多工具协同', en: 'Reliable multi-tool orchestration' }, next: { zh: '可复用的生产系统', en: 'Reusable production systems' } },
      { id: 'video', mastered: { zh: '脚本策划与剪辑指导', en: 'Script and edit direction' }, growing: { zh: 'AI 辅助视觉叙事', en: 'AI-assisted visual storytelling' }, next: { zh: '端到端影片制作', en: 'End-to-end film production' } },
      { id: 'commerce', mastered: { zh: '产品价值表达', en: 'Product value communication' }, growing: { zh: '内容转化策略', en: 'Content conversion strategy' }, next: { zh: '可衡量的电商成果', en: 'Measurable commerce outcomes' } },
      { id: 'programming', mastered: { zh: '基础程序开发与视觉处理', en: 'Foundational programming and visual processing' }, growing: { zh: 'AI 辅助编程与视觉识别', en: 'AI-assisted programming and visual recognition' }, next: { zh: '将代码能力接入内容自动化流程', en: 'Integrate coding into content automation' } },
      { id: 'hardware', mastered: { zh: '硬件调试与三维建模', en: 'Hardware debugging and 3D modeling' }, growing: { zh: '软硬件联动原型', en: 'Hardware-software integrated prototyping' }, next: { zh: '完成可展示的智能设备作品', en: 'Build a showcase-ready smart device' } },
      { id: 'photography', mastered: { zh: '专业拍摄与后期制作', en: 'Professional photography and post-production' }, growing: { zh: '商业级灯光与镜头语言', en: 'Commercial lighting and visual language' }, next: { zh: '建立稳定的视觉内容风格', en: 'Establish a consistent visual style' } },
    ]);
  });

  it('excludes rejected resume content', () => {
    const serialized = JSON.stringify(siteContent);

    expect(serialized).not.toContain('4年工作经验');
    expect(serialized).not.toContain('4 年工作经验');
    expect(serialized).not.toContain('下载简历');
  });
});
