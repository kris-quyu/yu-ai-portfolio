import { describe, expect, it } from 'vitest';
import { siteContent } from './siteContent';

describe('siteContent', () => {
  it('defines the approved intro and six-section navigation', () => {
    expect(siteContent.intro).toEqual({
      title: "HELLO, I'M YU",
      reveal: '你好，我是宇',
      subtitle: 'AI CONTENT CREATOR / HANGZHOU',
      hint: '移动鼠标探索 · 向下滚动查看更多',
    });
    expect(siteContent.navigation.map(({ id }) => id)).toEqual([
      'home', 'profile', 'film', 'system', 'capabilities', 'contact',
    ]);
  });

  it('defines the four capability-growth stages verbatim', () => {
    expect(siteContent.hero.stages.map(({ title, label }) => [title, label])).toEqual([
      ['THINK WITH AI.', '鐞嗚В宸ュ叿'],
      ['SHAPE THE STORY.', '褰㈡垚鍐呭'],
      ['BUILD THE WORKFLOW.', '涓茶仈娴佺▼'],
      ['DELIVER THE RESULT.', '鏈嶅姟杞寲'],
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
