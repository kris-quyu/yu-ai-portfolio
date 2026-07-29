export type SectionId =
  | 'home'
  | 'profile'
  | 'film'
  | 'system'
  | 'capabilities'
  | 'contact';

export interface HeroStage {
  id: 'think' | 'shape' | 'build' | 'deliver';
  phase: 'push-in' | 'pull-back' | 'turn' | 'hold';
  eyebrow: string;
  translation: string;
  title: string;
  summary: string;
}

export interface BilingualCopy {
  readonly zh: string;
  readonly en: string;
}

export interface Capability {
  id:
    | 'automation'
    | 'video'
    | 'commerce'
    | 'programming'
    | 'hardware'
    | 'photography';
  index: '01' | '02' | '03' | '04' | '05' | '06';
  title: string;
  summary: string;
  tools: readonly string[];
  mastered: BilingualCopy;
  growing: BilingualCopy;
  next: BilingualCopy;
}

export interface ContactDetails {
  name: string;
  city: string;
  phone: string;
  email: string;
}

export interface SiteContent {
  intro: { title: string; reveal: string; annotation: string; hint: string };
  navigation: readonly { id: SectionId; label: string }[];
  hero: { eyebrow: string; titleLines: readonly string[]; summary: string; stages: readonly HeroStage[] };
  film: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  workflow: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  capabilities: readonly Capability[];
  contact: ContactDetails & { eyebrow: string; titleLines: readonly string[] };
}

export const siteContent: SiteContent = {
  intro: {
    title: "HELLO, I'M YU",
    reveal: '你好，我是宇',
    annotation: 'AI AGENT PORTFOLIO / CREATIVE WORKFLOW SHOWCASE',
    hint: '移动鼠标探索 · 向下滚动查看更多',
  },
  navigation: [
    { id: 'home', label: 'HOME' },
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
    stages: [
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
    ],
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
      mastered: { zh: 'AI 工作流搭建与自动化', en: 'AI workflow setup and automation' },
      growing: { zh: '稳定的多工具协同', en: 'Reliable multi-tool orchestration' },
      next: { zh: '可复用的生产系统', en: 'Reusable production systems' },
      title: 'AI 内容与自动化',
      summary: '图像生成、视频生成与自动化工作流。',
      tools: ['ComfyUI', 'n8n', 'Codex'],
    },
    {
      id: 'video',
      index: '02',
      mastered: { zh: '脚本策划与剪辑指导', en: 'Script and edit direction' },
      growing: { zh: 'AI 辅助视觉叙事', en: 'AI-assisted visual storytelling' },
      next: { zh: '端到端影片制作', en: 'End-to-end film production' },
      title: '视频编导与剪辑',
      summary: '脚本、分镜、卖点表达和剪辑包装。',
      tools: ['脚本', '分镜', '剪辑'],
    },
    {
      id: 'commerce',
      index: '03',
      mastered: { zh: '产品价值表达', en: 'Product value communication' },
      growing: { zh: '内容转化策略', en: 'Content conversion strategy' },
      next: { zh: '可衡量的电商成果', en: 'Measurable commerce outcomes' },
      title: '电商内容转化',
      summary: '理解商品卖点、用户痛点与成交逻辑。',
      tools: ['卖点', '用户痛点', '转化'],
    },
    {
      id: 'programming',
      index: '04',
      mastered: { zh: '基础程序开发与视觉处理', en: 'Foundational programming and visual processing' },
      growing: { zh: 'AI 辅助编程与视觉识别', en: 'AI-assisted programming and visual recognition' },
      next: { zh: '将代码能力接入内容自动化流程', en: 'Integrate coding into content automation' },
      title: '编程与视觉识别',
      summary: '掌握 Python、C/C++ 基础，了解 OpenCV 视觉识别与图像处理。',
      tools: ['Python', 'C/C++', 'OpenCV'],
    },
    {
      id: 'hardware',
      index: '05',
      mastered: { zh: '硬件调试与三维建模', en: 'Hardware debugging and 3D modeling' },
      growing: { zh: '软硬件联动原型', en: 'Hardware-software integrated prototyping' },
      next: { zh: '完成可展示的智能设备作品', en: 'Build a showcase-ready smart device' },
      title: '硬件开发与数字制造',
      summary: '单片机开发、传感器调试、UG/NX 建模与 3D 打印。',
      tools: ['单片机', '传感器', 'UG/NX', '3D 打印'],
    },
    {
      id: 'photography',
      index: '06',
      mastered: { zh: '专业拍摄与后期制作', en: 'Professional photography and post-production' },
      growing: { zh: '商业级灯光与镜头语言', en: 'Commercial lighting and visual language' },
      next: { zh: '建立稳定的视觉内容风格', en: 'Establish a consistent visual style' },
      title: '专业摄影与视觉后期',
      summary: '专业相机摄影，熟悉 PS、PR、LR 与完整后期流程。',
      tools: ['专业摄影', 'PS', 'PR', 'LR'],
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
