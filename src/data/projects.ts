export type CoverType = "video" | "workflow" | "dashboard";

export type Project = {
  id: string;
  title: string;
  englishTitle: string;
  shortTitle: string[];
  category: string;
  description: string;
  detail: string;
  role: string;
  status: string;
  year: string;
  stack: string[];
  theme: "amber" | "deepGold" | "champagne" | "bronze";
  coverType: CoverType;
  cover: string;
  visualStyle: string;
  accentColor: string;
  previewTheme: string;
};

export const projects: Project[] = [
  {
    id: "01",
    title: "信息流混剪 AI 工具",
    englishTitle: "AI Short Video Mixing System",
    shortTitle: ["AI Short", "Video", "Mixing", "System"],
    category: "AI Video",
    description:
      "面向电商信息流广告的视频自动混剪系统，支持素材识别、字幕提取、无效片段过滤、自动拼接和 9:16 成片导出。",
    detail:
      "面向电商信息流广告的视频自动混剪系统，支持素材识别、字幕提取、无效片段过滤、自动拼接和 9:16 成片导出。",
    role: "产品设计 / 工作流设计 / Codex 辅助开发",
    status: "本地 Web 工具开发中",
    year: "2026",
    stack: ["Python", "FFmpeg", "MoviePy", "Whisper", "Gemini", "Codex"],
    theme: "amber",
    coverType: "video",
    cover: "/projects/case-ai-video-system.svg",
    visualStyle: "AI 视频剪辑工作台 / 视频时间轴 / 字幕片段 / 深色编辑界面",
    accentColor: "#28D7FF",
    previewTheme: "video editing UI, timeline, subtitle blocks, workflow dashboard, dark interface, cyan blue glow",
  },
  {
    id: "02",
    title: "小红书宠物用品图文自动化",
    englishTitle: "Xiaohongshu Pet Content Workflow",
    shortTitle: ["Pet", "Content", "Workflow"],
    category: "Content Workflow",
    description:
      "读取产品信息后自动生成标题、正文、标签、封面提示词和场景图提示词，用于小红书宠物用品内容批量生产。",
    detail:
      "读取产品信息后自动生成标题、正文、标签、封面提示词和场景图提示词，用于小红书宠物用品内容批量生产。",
    role: "AIGC 内容系统设计 / 自动化流程搭建",
    status: "可批量生成内容",
    year: "2026",
    stack: ["GPT", "Gemini", "Python", "Excel", "ComfyUI", "Codex"],
    theme: "champagne",
    coverType: "workflow",
    cover: "/projects/case-pet-content-workflow.svg",
    visualStyle: "内容生成工作流 / 批量图文卡片 / 标题、正文、标签、封面预览",
    accentColor: "#E8B86D",
    previewTheme: "content workflow dashboard, card layout, batch content generation, clean product UI",
  },
  {
    id: "03",
    title: "智能养殖水质监测平台",
    englishTitle: "Smart Aquaculture Monitoring Platform",
    shortTitle: ["Smart", "Aquaculture", "Monitoring"],
    category: "Intelligent System",
    description:
      "面向工厂化养殖场景的水质监测平台，围绕 DO、pH、ORP、水位、温度等数据，实现实时显示、报警和 HMI 可视化。",
    detail:
      "面向工厂化养殖场景的水质监测平台，围绕 DO、pH、ORP、水位、温度等数据，实现实时显示、报警和 HMI 可视化。",
    role: "系统方案设计 / 传感器选型 / 页面原型",
    status: "硬件选型与组态开发中",
    year: "2026",
    stack: ["RS485", "PLC", "MCGS昆仑屏", "HTML", "JavaScript", "Sensors"],
    theme: "deepGold",
    coverType: "dashboard",
    cover: "/projects/case-aquaculture-monitoring.svg",
    visualStyle: "工业监测 dashboard / DO、pH、ORP 图表 / 实时状态卡片 / 深蓝数据可视化",
    accentColor: "#3AA8FF",
    previewTheme: "aquaculture monitoring dashboard, water quality charts, industrial IoT UI, dark blue interface",
  },
  {
    id: "04",
    title: "GEO 内容优化系统",
    englishTitle: "GEO Content Optimization System",
    shortTitle: ["GEO", "Content", "Optimization"],
    category: "GEO Optimization",
    description:
      "围绕 GEO（生成式引擎优化）场景，设计内容优化与投放表达策略，帮助产品信息更适合被 AI 平台理解、引用与推荐。",
    detail:
      "围绕 GEO（生成式引擎优化）场景，设计内容优化与投放表达策略，帮助产品信息更适合被 AI 平台理解、引用与推荐，适用于 AI 搜索、问答推荐和内容触达场景。",
    role: "策略设计 / 内容优化 / AIGC 工作流设计",
    status: "方案验证中",
    year: "2026",
    stack: ["GPT", "Gemini", "Prompt Design", "Content Strategy", "Workflow"],
    theme: "bronze",
    coverType: "workflow",
    cover: "/projects/case-geo-optimization.svg",
    visualStyle: "AI 搜索优化 / 内容分析面板 / 推荐路径 / 问答卡片 / 紫蓝科技策略系统",
    accentColor: "#8F7CFF",
    previewTheme: "GEO optimization dashboard, AI search workflow, content analysis, recommendation flow, purple blue UI",
  },
];
