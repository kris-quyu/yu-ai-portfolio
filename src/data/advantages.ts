export type Advantage = {
  title: string;
  description: string;
  tags: string[];
};

export const advantages: Advantage[] = [
  {
    title: "AI 内容生产",
    description: "把产品卖点、用户痛点和平台语境转成可批量生成的标题、正文、标签、封面提示词和场景图方案。",
    tags: ["商品卖点", "图文批量", "平台内容"],
  },
  {
    title: "AI 视频工作流",
    description: "把素材识别、字幕提取、无效片段过滤、自动拼接和竖屏导出整理成稳定的视频生产链路。",
    tags: ["混剪系统", "字幕提取", "成片导出"],
  },
  {
    title: "AI 辅助开发",
    description: "用 Codex 把自动化脚本、本地 Web 工具和前端原型快速落地，让业务想法变成可运行界面。",
    tags: ["本地工具", "前端原型", "自动化脚本"],
  },
  {
    title: "AI + 业务落地",
    description: "围绕电商增长、内容效率和现场系统，把多个 AI 工具组合成能交付、能复用的业务流程。",
    tags: ["电商增长", "流程复用", "系统交付"],
  },
];
