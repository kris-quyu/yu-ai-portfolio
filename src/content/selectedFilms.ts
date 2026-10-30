export interface SelectedFilm {
  id: string;
  title: string;
  titleZh: string;
  summary: string;
  focus: string;
  duration: string;
  client?: string;
  delivery?: string;
  roleLabel?: string;
  tags?: readonly string[];
  format?: 'landscape';
  excerpt?: boolean;
  disclosure?: string;
  process?: readonly { title: string; description: string }[];
}

export const selectedFilms: readonly SelectedFilm[] = [
  {
    id: 'enjitang', title: 'ENJITANG BRAND FILM', titleZh: '恩济堂品牌合作短片', duration: '00:24',
    client: '恩济堂',
    delivery: '已交付 · 未发布（品牌端） / DELIVERED · BRAND RELEASE PENDING',
    roleLabel: '策划 · 拍摄 · AI 生成 · 剪辑 / CONCEPT · SHOOTING · AI GENERATION · EDITING',
    summary: '围绕恩济堂纯梨膏产品，独立完成内容策划、拍摄、AI 生成与后期剪辑，将产品信息转化为生活场景中的短视频表达。',
    focus: '品牌合作 / BRAND COLLABORATION',
    tags: ['BRAND CONTENT', 'SHOOTING', 'AI GENERATION', 'EDITING'],
  },
  {
    id: 'oes-excerpt', title: 'OES COOKWARE', titleZh: 'OES 砂锅｜产品信息流广告', duration: '00:21',
    client: 'OES', format: 'landscape', excerpt: true,
    delivery: '品牌委托 · 已交付 · 节选展示 / COMMISSIONED · DELIVERED · EXCERPT',
    roleLabel: '全流程独立制作 / END-TO-END PRODUCTION',
    summary: '围绕砂锅产品卖点，将产品资料转化为脚本、分镜与使用场景，独立完成 AI 内容生成及后期剪辑，形成面向信息流的产品广告。',
    focus: '商业信息流 / COMMERCIAL VIDEO',
    tags: ['PRODUCT STRATEGY', 'STORYBOARD', 'AI VIDEO', 'EDITING'],
    disclosure: '受项目及素材授权范围限制，此处仅展示不含代言人的产品画面与制作过程说明，视频为静音节选。完整案例可微信联系，在授权范围内沟通展示。 / Product-only silent excerpt. Contact via WeChat for an authorized case discussion.',
    process: [
      { title: '01 / 卖点与脚本 · STRATEGY & SCRIPT', description: '分析产品资料、提炼内容卖点，将产品信息组织成广告脚本与镜头顺序。' },
      { title: '02 / 分镜与生成 · STORYBOARD & GENERATION', description: '设计产品、烹饪和使用场景分镜，完成 Prompt 设计、AI 图片与视频生成及素材筛选。' },
      { title: '03 / 剪辑与交付 · EDITING & DELIVERY', description: '独立完成节奏组织、字幕与视觉优化，交付品牌广告成片；公开版仅保留产品节选，不展示完整广告。' },
    ],
  },
  {
    id: 'beauty', title: 'BEAUTY FILM', titleZh: '美妆视觉短片', duration: '00:20',
    summary: '通过黑白空间、人物镜头与产品特写，建立统一的美妆视觉表达。',
    focus: '人物与产品叙事 / CHARACTER & PRODUCT',
  },
  {
    id: 'jewelry', title: 'JEWELRY FILM', titleZh: '珠宝产品短片', duration: '00:23',
    summary: '围绕珠宝形态、材质与微距细节，组织产品展示镜头。',
    focus: '产品细节与运镜 / DETAIL & CAMERA',
  },
  {
    id: 'footwear', title: 'FOOTWEAR FILM', titleZh: '鞋履产品短片', duration: '00:22',
    summary: '从鞋履细节到日常穿着场景，连接产品展示与使用情境。',
    focus: '产品与使用场景 / PRODUCT & LIFESTYLE',
  },
  {
    id: 'fashion', title: 'FASHION FILM', titleZh: '男装穿搭短片', duration: '00:15',
    summary: '以街景、人物动作与服装细节，呈现统一的穿搭氛围。',
    focus: '人物与服装表达 / CHARACTER & STYLING',
  },
];
