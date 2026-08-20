import { describe, expect, it } from 'vitest';
import { siteContent } from './siteContent';

describe('siteContent', () => {
  it('defines the recruiter-facing direction and five anchors', () => {
    expect(siteContent.intro.annotation).toBe('AIGC CONTENT PRODUCTION / AI WORKFLOW');
    expect(siteContent.intro.annotationZh).toBe('AIGC 内容生产 · AI 工作流 · 自动化应用');
    expect(siteContent.navigation.map(({ id }) => id)).toEqual([
      'home', 'about', 'work', 'skills', 'contact',
    ]);
    expect(siteContent.hero.positioning).toBe(
      '使用 ComfyUI、AI 图像与视频模型、Python / API 和自动化工具，连接内容策划、素材生成、视频制作与交付。',
    );
    expect(siteContent.hero.keywords).toEqual([
      'AI VIDEO', 'COMFYUI', 'AI WORKFLOW', 'AUTOMATION', 'AI IMAGE', 'PYTHON / API',
    ]);
    expect(siteContent.hero.stages.map(({ title, translation }) => ({ title, translation }))).toEqual([
      { title: 'UNDERSTAND THE BRIEF.', translation: '产品资料分析与内容方向' },
      { title: 'DESIGN THE STORY.', translation: '选题、脚本与分镜设计' },
      { title: 'GENERATE THE VISUALS.', translation: 'AI 图像与视频生成' },
      { title: 'CONNECT THE WORKFLOW.', translation: '剪辑、处理与工作流交付' },
    ]);
  });

  it('models the approved About statement and truthful skill groups', () => {
    expect(siteContent.about.statement).toContain('我关注的不是单次生成图片或视频');
    expect(siteContent.about.statement).toContain('独立完成选题、脚本、分镜、AI 图像与视频生成');
    expect(siteContent.about.practiceAreas).toEqual([
      'AI 图像生成', 'AI 视频生成', 'ComfyUI 工作流', '内容策划与分镜',
      'Python / API', 'AI 电商内容生产', '视频剪辑与视觉处理',
    ]);
    expect(siteContent.about.targetDirection).toBe('AIGC / AI 内容生产 / AI 工作流 / AI 应用');
    expect(siteContent.skillGroups.map(({ id, priority }) => ({ id, priority }))).toEqual([
      { id: 'aigc', priority: 'core' },
      { id: 'automation', priority: 'core' },
      { id: 'content', priority: 'core' },
      { id: 'engineering', priority: 'supporting' },
    ]);
    const automation = siteContent.skillGroups[1];
    expect(automation.tools).toEqual(['Python', 'API', 'Codex', 'FFmpeg', 'Workflow Design']);
    expect(`${automation.mastered.zh}${automation.growing.zh}${automation.next.zh}`).toMatch(/FFmpeg.*实验|实验.*FFmpeg/);
  });

  it('defines three truthful case studies and shared evidence', () => {
    expect(siteContent.projects.map(({ id, status }) => ({ id, status }))).toEqual([
      { id: 'project-01', status: 'COMPLETED' },
      { id: 'project-02', status: 'COMPLETED' },
      { id: 'project-03', status: 'IN DEVELOPMENT' },
    ]);
    expect(siteContent.projects.map(({ title, titleZh }) => ({ title, titleZh }))).toEqual([
      { title: 'AI PRODUCT FILM', titleZh: 'AI 产品宣传片' },
      { title: 'AI SHORT FILM WORKFLOW', titleZh: 'AI 连续镜头制作工作流' },
      { title: 'AI CONTENT WORKFLOW', titleZh: 'AI 内容生产工作流' },
    ]);
    expect(siteContent.projects[1].tools).toEqual([
      'ComfyUI', 'MiniMax H3', 'Seedance', 'AI Image', 'AI Video', 'LLM', 'Video Editing',
    ]);
    expect(siteContent.projects[1].sharedOutput).toEqual({
      label: 'APPLIED OUTPUT · SHARED WITH PROJECT 01',
      href: '#project-01-media',
    });
    const [productFilm, shortFilmWorkflow, contentWorkflow] = siteContent.projects;

    expect(productFilm.problem).toContain('统一的产品表达');
    expect(productFilm.solution).toContain('生活使用场景');
    expect(productFilm.role).toContain('后期剪辑与视觉优化');
    expect(productFilm.result).toContain('最终成片证据');

    expect(shortFilmWorkflow.problem).toContain('服装漂移');
    expect(shortFilmWorkflow.solution).toContain('角色与场景参考素材');
    expect(shortFilmWorkflow.role).toContain('角色和场景参考设计');
    expect(shortFilmWorkflow.result).toContain('应用于产品成片制作');

    expect(contentWorkflow.problem).toContain('可复用、可自动化');
    expect(contentWorkflow.solution).toContain('已实践、实验中与计划中');
    expect(contentWorkflow.role).toContain('尝试素材处理和流程串联');
    expect(contentWorkflow.result).toContain('稳定的端到端自动化输出仍在持续开发');
  });

  it('keeps automation claims truthful and removes n8n', () => {
    const serialized = JSON.stringify(siteContent);
    expect(serialized).not.toMatch(/n8n/i);
    expect(siteContent.contentWorkflow.completed).toEqual([
      '产品资料分析', '内容选题', '脚本生成', '分镜生成', 'AI 图片生成', 'AI 视频生成', '后期剪辑',
    ]);
    expect(siteContent.contentWorkflow.experimental).toContain(
      '使用 FFmpeg 尝试素材处理和流程串联，尚未达到稳定、可复用的自动化生产状态。',
    );
    expect(siteContent.contentWorkflow.planned).toEqual([
      'API 接入', '批量任务', '稳定的端到端自动化输出', '可复用的内容生产模板',
    ]);
  });
});
