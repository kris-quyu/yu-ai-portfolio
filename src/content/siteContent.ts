export type SectionId = 'profile' | 'film' | 'system' | 'capabilities' | 'contact';

export interface Capability {
  id: 'automation' | 'video' | 'commerce';
  index: '01' | '02' | '03';
  title: string;
  summary: string;
  tools: readonly string[];
}

export interface ContactDetails {
  name: string;
  city: string;
  phone: string;
  email: string;
}

export interface SiteContent {
  navigation: readonly { id: SectionId; label: string }[];
  hero: { eyebrow: string; titleLines: readonly string[]; summary: string };
  film: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  workflow: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  capabilities: readonly Capability[];
  contact: ContactDetails & { eyebrow: string; titleLines: readonly string[] };
}

export const siteContent: SiteContent = {
  navigation: [
    { id: 'profile', label: 'PROFILE' },
    { id: 'film', label: 'FILM' },
    { id: 'system', label: 'SYSTEM' },
    { id: 'capabilities', label: 'CAPABILITIES' },
    { id: 'contact', label: 'CONTACT' },
  ],
  hero: {
    eyebrow: 'AI CONTENT CREATOR',
    titleLines: ['BUILDING', 'CREATIVE', 'WORKFLOWS.'],
    summary: '连接 AI 工具、内容创作与电商业务，把复杂流程变成稳定输出。',
  },
  film: {
    eyebrow: 'FEATURED OUTPUT · 54 SEC',
    title: 'AI PRODUCT FILM',
    summary: '以生活场景呈现家电产品卖点，展示 AI 视频和内容表达能力。',
    tags: ['AI VIDEO', 'CONTENT', 'EDIT'],
  },
  workflow: {
    eyebrow: 'WORKFLOW BUILDER',
    title: 'TOOLS INTO SYSTEMS.',
    summary: '能够搭建并调试图像生成、人像修复与视频生成工作流。',
    tags: ['COMFYUI', 'N8N', 'CODEX'],
  },
  capabilities: [
    {
      id: 'automation',
      index: '01',
      title: 'AI 内容与自动化',
      summary: '图像生成、视频生成与自动化工作流。',
      tools: ['ComfyUI', 'n8n', 'Codex'],
    },
    {
      id: 'video',
      index: '02',
      title: '视频编导与剪辑',
      summary: '脚本、分镜、卖点表达和剪辑包装。',
      tools: ['脚本', '分镜', '剪辑'],
    },
    {
      id: 'commerce',
      index: '03',
      title: '电商内容转化',
      summary: '理解商品卖点、用户痛点与成交逻辑。',
      tools: ['卖点', '用户痛点', '转化'],
    },
  ],
  contact: {
    eyebrow: 'HANGZHOU · AVAILABLE FOR OPPORTUNITIES',
    titleLines: ["LET'S BUILD", 'SOMETHING.'],
    name: '瞿先生',
    city: '杭州',
    phone: '13123986103',
    email: '1282736393@qq.com',
  },
};
