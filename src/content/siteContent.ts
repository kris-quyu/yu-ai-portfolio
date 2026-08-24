export type SectionId = 'home' | 'about' | 'work' | 'skills' | 'contact';
export type ProjectId = 'project-01' | 'project-02' | 'project-03';
export type ProjectStatus = 'COMPLETED' | 'IN DEVELOPMENT';
export type WorkflowStageStatus = 'COMPLETED' | 'EXPERIMENTAL' | 'PLANNED';

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

export interface ProjectContent {
  id: ProjectId;
  number: '01' | '02' | '03';
  title: string;
  titleZh: string;
  status: ProjectStatus;
  summary: string;
  tags: readonly string[];
  problem: string;
  solution: string;
  tools: readonly string[];
  role: readonly string[];
  result: string;
  sharedOutput?: { label: string; href: '#project-01-media' };
}

export interface SkillGroup {
  id: 'aigc' | 'automation' | 'content' | 'engineering';
  index: '01' | '02' | '03' | '04';
  title: string;
  titleZh: string;
  summary: string;
  tools: readonly string[];
  priority: 'core' | 'supporting';
  mastered: BilingualCopy;
  growing: BilingualCopy;
  next: BilingualCopy;
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

export interface AboutContent {
  statement: string;
  practiceAreas: readonly string[];
  targetDirection: string;
}

export interface ContentWorkflow {
  steps: readonly string[];
  completed: readonly string[];
  experimental: readonly string[];
  planned: readonly string[];
}

export interface SiteContent {
  intro: { title: string; reveal: string; annotation: string; annotationZh: string; hint: string };
  navigation: readonly { id: SectionId; label: string }[];
  hero: {
    eyebrow: string;
    titleLines: readonly string[];
    summary: string;
    positioning: string;
    keywords: readonly string[];
    stages: readonly HeroStage[];
  };
  about: AboutContent;
  projects: readonly ProjectContent[];
  contentWorkflow: ContentWorkflow;
  skillGroups: readonly SkillGroup[];
  // These fields preserve the current components until their focused migrations consume the model above.
  film: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  workflow: { eyebrow: string; title: string; summary: string; tags: readonly string[] };
  capabilities: readonly Capability[];
  contact: ContactDetails & { eyebrow: string; titleLines: readonly string[] };
}

const positioning = '使用 ComfyUI、AI 图像与视频模型、Python / API 和自动化工具，连接内容策划、素材生成、视频制作与交付。';

export const siteContent: SiteContent = {
  intro: {
    title: "HELLO, I'M YU",
    reveal: '你好，我是宇',
    annotation: 'AIGC CONTENT PRODUCTION / AI WORKFLOW',
    annotationZh: 'AIGC 内容生产 · AI 工作流 · 自动化应用',
    hint: '移动鼠标探索 · 向下滚动查看更多',
  },
  navigation: [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'work', label: 'WORK' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
  ],
  hero: {
    eyebrow: 'AIGC CONTENT PRODUCTION / AI WORKFLOW',
    titleLines: ['BUILDING', 'CREATIVE', 'WORKFLOWS.'],
    summary: positioning,
    positioning,
    keywords: ['AI VIDEO', 'COMFYUI', 'AI WORKFLOW', 'AUTOMATION', 'AI IMAGE', 'PYTHON / API'],
    stages: [
      {
        id: 'think',
        phase: 'push-in',
        eyebrow: '01 / UNDERSTAND',
        translation: '产品资料分析与内容方向',
        title: 'UNDERSTAND THE BRIEF.',
        summary: '从产品资料、用户需求和内容目标建立方向。',
      },
      {
        id: 'shape',
        phase: 'pull-back',
        eyebrow: '02 / DESIGN',
        translation: '选题、脚本与分镜设计',
        title: 'DESIGN THE STORY.',
        summary: '将信息转化为可执行的镜头和内容结构。',
      },
      {
        id: 'build',
        phase: 'turn',
        eyebrow: '03 / GENERATE',
        translation: 'AI 图像与视频生成',
        title: 'GENERATE THE VISUALS.',
        summary: '通过参考素材、Prompt 和模型生成视觉素材。',
      },
      {
        id: 'deliver',
        phase: 'hold',
        eyebrow: '04 / CONNECT',
        translation: '剪辑、处理与工作流交付',
        title: 'CONNECT THE WORKFLOW.',
        summary: '完成筛选、剪辑、输出并尝试流程自动化。',
      },
    ],
  },
  about: {
    statement: '我关注的不是单次生成图片或视频，而是如何把 AI 工具组合成完整的内容生产流程。从产品资料和内容目标出发，独立完成选题、脚本、分镜、AI 图像与视频生成、素材筛选和后期剪辑，并持续尝试将 Python、API 与自动化能力接入生产流程。',
    practiceAreas: [
      'AI 图像生成',
      'AI 视频生成',
      'ComfyUI 工作流',
      '内容策划与分镜',
      'Python / API',
      'AI 电商内容生产',
      '视频剪辑与视觉处理',
    ],
    targetDirection: 'AIGC / AI 内容生产 / AI 工作流 / AI 应用',
  },
  projects: [
    {
      id: 'project-01',
      number: '01',
      title: 'AI PRODUCT FILM',
      titleZh: 'AI 产品宣传片',
      status: 'COMPLETED',
      summary: '从产品卖点出发，独立完成 AI 素材生成、视频制作和后期剪辑。',
      tags: ['AI VIDEO', 'COMFYUI', 'AI IMAGE', 'VIDEO EDITING'],
      problem: 'AI 视频制作需要在参考素材、Prompt、生成、筛选和后期之间频繁切换，过程零散且容易失去统一的产品表达。',
      solution: '围绕产品卖点和生活使用场景规划视觉方向，通过参考图和镜头拆解组织 AI 图像、AI 视频与后期制作。',
      tools: ['ComfyUI', 'AI Image', 'AI Video', 'Photoshop', 'Video Editing'],
      role: [
        '产品资料与卖点分析',
        '内容方向和视觉方向',
        'Prompt 设计',
        'AI 图像与视频生成',
        '素材筛选',
        '后期剪辑与视觉优化',
      ],
      result: '完成一支 AI 产品宣传视频，作为最终成片证据。',
    },
    {
      id: 'project-02',
      number: '02',
      title: 'AI SHORT FILM WORKFLOW',
      titleZh: 'AI 连续镜头制作工作流',
      status: 'COMPLETED',
      summary: '通过参考图、场景约束、镜头规划和 AI 视频模型控制连续画面的角色与空间一致性。',
      tags: ['COMFYUI', 'AI VIDEO', 'CONTINUITY', 'STORYBOARD', 'VIDEO EDITING'],
      problem: 'AI 视频连续镜头容易出现人物变化、服装漂移、场景结构变化和动作不受控。',
      solution: '使用角色与场景参考素材、分镜拆解、镜头描述、Prompt 模板和 ComfyUI / AI 视频模型组织连续镜头制作。',
      tools: ['ComfyUI', 'MiniMax H3', 'Seedance', 'AI Image', 'AI Video', 'LLM', 'Video Editing'],
      role: [
        '产品资料分析',
        '内容选题与策划',
        '脚本生成和修改',
        '分镜与镜头设计',
        '角色和场景参考设计',
        'Prompt 设计',
        'AI 图像与视频生成',
        '素材筛选',
        '后期剪辑',
      ],
      result: '独立完成从资料分析、内容策划、脚本、分镜、AI 图像和视频生成到后期剪辑的完整流程，并将该流程应用于产品成片制作。',
      sharedOutput: {
        label: 'APPLIED OUTPUT · SHARED WITH PROJECT 01',
        href: '#project-01-media',
      },
    },
    {
      id: 'project-03',
      number: '03',
      title: 'AI CONTENT WORKFLOW',
      titleZh: 'AI 内容生产工作流',
      status: 'IN DEVELOPMENT',
      summary: '将已经实践的 AI 内容生产环节逐步整理为可复用、可自动化的工作流。',
      tags: ['PYTHON', 'FFMPEG · EXPERIMENTAL', 'API · PLANNED', 'AUTOMATION'],
      problem: '已实践的内容生产环节仍需逐步整理为可复用、可自动化的流程。',
      solution: '按产品输入、分析、内容策略、脚本、分镜、生成、剪辑和输出梳理流程，并明确区分已实践、实验中与计划中环节。',
      tools: ['Python', 'Codex', 'FFmpeg · EXPERIMENTAL', 'API · PLANNED', 'Workflow Design'],
      role: ['梳理内容生产阶段', '尝试素材处理和流程串联', '持续完善可复用的内容生产模板'],
      result: '已形成真实的阶段化工作流说明；稳定的端到端自动化输出仍在持续开发。',
    },
  ],
  contentWorkflow: {
    steps: [
      'Product Input', 'AI Analysis', 'Content Strategy', 'Script', 'Storyboard',
      'AI Image', 'AI Video', 'Editing', 'Output',
    ],
    completed: [
      '产品资料分析', '内容选题', '脚本生成', '分镜生成', 'AI 图片生成', 'AI 视频生成', '后期剪辑',
    ],
    experimental: ['使用 FFmpeg 尝试素材处理和流程串联，尚未达到稳定、可复用的自动化生产状态。'],
    planned: ['API 接入', '批量任务', '稳定的端到端自动化输出', '可复用的内容生产模板'],
  },
  skillGroups: [
    {
      id: 'aigc',
      index: '01',
      title: 'AI / AIGC',
      titleZh: 'AI 生成',
      summary: '组合图像、视频和语言模型完成内容生产中的视觉素材与表达开发。',
      tools: ['ComfyUI', 'MiniMax H3', 'Seedance', 'AI Image Generation', 'AI Video Generation', 'LLM', 'Prompt Design'],
      priority: 'core',
      mastered: { zh: 'AI 图像与视频生成、Prompt 设计', en: 'AI image and video generation, prompt design' },
      growing: { zh: '连续镜头和视觉一致性控制', en: 'Continuity and visual consistency control' },
      next: { zh: '更稳定的多模型内容生产组合', en: 'More reliable multi-model production workflows' },
    },
    {
      id: 'automation',
      index: '02',
      title: 'AUTOMATION',
      titleZh: '自动化',
      summary: '将 Python、API 和工作流设计接入内容生产；FFmpeg 串联目前仍处于实验阶段。',
      tools: ['Python', 'API', 'Codex', 'FFmpeg', 'Workflow Design'],
      priority: 'core',
      mastered: { zh: '内容流程梳理与工具组合', en: 'Content-flow mapping and tool combinations' },
      growing: { zh: 'FFmpeg 素材处理与流程串联（实验中）', en: 'Experimental FFmpeg processing and orchestration' },
      next: { zh: '稳定的端到端自动化输出', en: 'Reliable end-to-end automated output' },
    },
    {
      id: 'content',
      index: '03',
      title: 'CONTENT / DESIGN',
      titleZh: '内容与设计',
      summary: '从产品资料、卖点和用户需求出发，完成选题、分镜、制作与视觉处理。',
      tools: ['内容策划', '脚本与分镜', 'Photoshop', '视频剪辑', '摄影与视觉处理', '电商内容制作'],
      priority: 'core',
      mastered: { zh: '产品卖点分析、脚本与分镜、后期剪辑', en: 'Product analysis, scripting, storyboarding, editing' },
      growing: { zh: 'AI 辅助视觉叙事与连续镜头表达', en: 'AI-assisted visual storytelling and continuity' },
      next: { zh: '更完整的商业内容生产方法', en: 'More complete commercial-content production methods' },
    },
    {
      id: 'engineering',
      index: '04',
      title: 'OTHER ENGINEERING',
      titleZh: '工程补充',
      summary: '作为内容生产方向的工程补充能力，不作为项目主视觉。',
      tools: ['C/C++', 'OpenCV', 'CAD / UG/NX', '单片机', '传感器', 'PLC / HMI 基础'],
      priority: 'supporting',
      mastered: { zh: '基础编程、视觉处理与硬件调试', en: 'Foundational programming, visual processing, hardware debugging' },
      growing: { zh: '软硬件原型与视觉识别应用', en: 'Hardware-software prototyping and computer vision' },
      next: { zh: '将工程能力用于内容工具与自动化辅助', en: 'Apply engineering skills to content tools and automation support' },
    },
  ],
  film: {
    eyebrow: 'PROJECT 01 · COMPLETED',
    title: 'AI PRODUCT FILM',
    summary: '从产品卖点出发，独立完成 AI 素材生成、视频制作和后期剪辑。',
    tags: ['AI VIDEO', 'COMFYUI', 'AI IMAGE', 'VIDEO EDITING'],
  },
  workflow: {
    eyebrow: 'PROJECT 02 · COMPLETED',
    title: 'AI SHORT FILM WORKFLOW',
    summary: '通过参考图、场景约束、镜头规划和 AI 视频模型控制连续画面的角色与空间一致性。',
    tags: ['COMFYUI', 'AI VIDEO', 'VIDEO EDITING'],
  },
  capabilities: [
    {
      id: 'automation', index: '01', title: 'AI 内容与自动化', summary: '图像生成、视频生成与实验性的流程串联。', tools: ['ComfyUI', 'FFmpeg', 'Codex'],
      mastered: { zh: 'AI 工作流搭建与内容生产', en: 'AI workflow setup and content production' }, growing: { zh: '稳定的多工具协同', en: 'Reliable multi-tool orchestration' }, next: { zh: '可复用的生产系统', en: 'Reusable production systems' },
    },
    {
      id: 'video', index: '02', title: '视频编导与剪辑', summary: '脚本、分镜、卖点表达和剪辑包装。', tools: ['脚本', '分镜', '剪辑'],
      mastered: { zh: '脚本策划与剪辑指导', en: 'Script and edit direction' }, growing: { zh: 'AI 辅助视觉叙事', en: 'AI-assisted visual storytelling' }, next: { zh: '端到端影片制作', en: 'End-to-end film production' },
    },
    {
      id: 'commerce', index: '03', title: '电商内容转化', summary: '理解商品卖点、用户痛点与成交逻辑。', tools: ['卖点', '用户痛点', '转化'],
      mastered: { zh: '产品价值表达', en: 'Product value communication' }, growing: { zh: '内容转化策略', en: 'Content conversion strategy' }, next: { zh: '可衡量的电商成果', en: 'Measurable commerce outcomes' },
    },
    {
      id: 'programming', index: '04', title: '编程与视觉识别', summary: '掌握 Python、C/C++ 基础，了解 OpenCV 视觉识别与图像处理。', tools: ['Python', 'C/C++', 'OpenCV'],
      mastered: { zh: '基础程序开发与视觉处理', en: 'Foundational programming and visual processing' }, growing: { zh: 'AI 辅助编程与视觉识别', en: 'AI-assisted programming and visual recognition' }, next: { zh: '将代码能力接入内容自动化流程', en: 'Integrate coding into content automation' },
    },
    {
      id: 'hardware', index: '05', title: '硬件开发与数字制造', summary: '单片机开发、传感器调试、UG/NX 建模与 3D 打印。', tools: ['单片机', '传感器', 'UG/NX', '3D 打印'],
      mastered: { zh: '硬件调试与三维建模', en: 'Hardware debugging and 3D modeling' }, growing: { zh: '软硬件联动原型', en: 'Hardware-software integrated prototyping' }, next: { zh: '完成可展示的智能设备作品', en: 'Build a showcase-ready smart device' },
    },
    {
      id: 'photography', index: '06', title: '专业摄影与视觉后期', summary: '专业相机摄影，熟悉 PS、PR、LR 与完整后期流程。', tools: ['专业摄影', 'PS', 'PR', 'LR'],
      mastered: { zh: '专业拍摄与后期制作', en: 'Professional photography and post-production' }, growing: { zh: '商业级灯光与镜头语言', en: 'Commercial lighting and visual language' }, next: { zh: '建立稳定的视觉内容风格', en: 'Establish a consistent visual style' },
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
