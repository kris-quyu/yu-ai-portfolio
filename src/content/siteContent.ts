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
  title: string;
  label: string;
  summary: string;
}

export interface Capability {
  id: 'automation' | 'video' | 'commerce';
  index: '01' | '02' | '03';
  title: string;
  summary: string;
  tools: readonly string[];
  mastered: string;
  growing: string;
  next: string;
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
        eyebrow: '01 路 THINK',
        title: 'THINK WITH AI.',
        label: '鐞嗚В宸ュ叿',
        summary: '鐞嗚В ComfyUI銆乶8n銆丆odex 绛?AI 宸ュ叿銆?',
      },
      {
        id: 'shape',
        phase: 'pull-back',
        eyebrow: '02 路 SHAPE',
        title: 'SHAPE THE STORY.',
        label: '褰㈡垚鍐呭',
        summary: '鎶婁骇鍝佸崠鐐硅浆鎴愯剼鏈€佸垎闀滃拰鐢婚潰銆?',
      },
      {
        id: 'build',
        phase: 'turn',
        eyebrow: '03 路 BUILD',
        title: 'BUILD THE WORKFLOW.',
        label: '涓茶仈娴佺▼',
        summary: '灏嗙敓鎴愩€佸壀杈戝拰鑷姩鍖栦覆鎴愮ǔ瀹氭祦绋嬨€?',
      },
      {
        id: 'deliver',
        phase: 'hold',
        eyebrow: '04 路 DELIVER',
        title: 'DELIVER THE RESULT.',
        label: '鏈嶅姟杞寲',
        summary: '璁╁唴瀹规渶缁堟湇鍔＄敤鎴风悊瑙ｄ笌鐢靛晢杞寲銆?',
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
      mastered: 'AI workflow setup and automation',
      growing: 'Reliable multi-tool orchestration',
      next: 'Reusable production systems',
      title: 'AI 内容与自动化',
      summary: '图像生成、视频生成与自动化工作流。',
      tools: ['ComfyUI', 'n8n', 'Codex'],
    },
    {
      id: 'video',
      index: '02',
      mastered: 'Script and edit direction',
      growing: 'AI-assisted visual storytelling',
      next: 'End-to-end film production',
      title: '视频编导与剪辑',
      summary: '脚本、分镜、卖点表达和剪辑包装。',
      tools: ['脚本', '分镜', '剪辑'],
    },
    {
      id: 'commerce',
      index: '03',
      mastered: 'Product value communication',
      growing: 'Content conversion strategy',
      next: 'Measurable commerce outcomes',
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
