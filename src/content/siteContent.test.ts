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

  it('defines all six capabilities including the supplied technical and visual skills', () => {
    expect(siteContent.capabilities).toHaveLength(6);
    expect(siteContent.capabilities.slice(3)).toEqual([
      {
        id: 'programming',
        index: '04',
        title: '编程与视觉识别',
        summary: '掌握 Python、C/C++ 基础，了解 OpenCV 视觉识别与图像处理。',
        tools: ['Python', 'C/C++', 'OpenCV'],
        mastered: '基础程序开发与视觉处理',
        growing: 'AI 辅助编程与视觉识别',
        next: '将代码能力接入内容自动化流程',
      },
      {
        id: 'hardware',
        index: '05',
        title: '硬件开发与数字制造',
        summary: '单片机开发、传感器调试、UG/NX 建模与 3D 打印。',
        tools: ['单片机', '传感器', 'UG/NX', '3D 打印'],
        mastered: '硬件调试与三维建模',
        growing: '软硬件联动原型',
        next: '完成可展示的智能设备作品',
      },
      {
        id: 'photography',
        index: '06',
        title: '专业摄影与视觉后期',
        summary: '专业相机摄影，熟悉 PS、PR、LR 与完整后期流程。',
        tools: ['专业摄影', 'PS', 'PR', 'LR'],
        mastered: '专业拍摄与后期制作',
        growing: '商业级灯光与镜头语言',
        next: '建立稳定的视觉内容风格',
      },
    ]);
  });

  it('defines growth copy for every capability back', () => {
    siteContent.capabilities.forEach((capability) => {
      expect(capability.mastered).not.toBe('');
      expect(capability.growing).not.toBe('');
      expect(capability.next).not.toBe('');
    });
  });

  it('excludes rejected resume content', () => {
    const serialized = JSON.stringify(siteContent);

    expect(serialized).not.toContain('4年工作经验');
    expect(serialized).not.toContain('4 年工作经验');
    expect(serialized).not.toContain('下载简历');
  });
});
