# 求职导向个人作品集改版设计规格

日期：2026-08-20  
项目：QX / AI LAB  
站点：`yu-ai-portfolio`

## 1. 背景与目标

当前网站已经具备清晰的品牌视觉、鼠标跟随开场、人物逐帧滚动、AI 视频播放器、ComfyUI 工作流证明、技能翻转和联系方式。本次不重新搭建网站，也不改变现有深色科技感、字体体系、品牌配色和核心交互。

本次目标是重组信息，使 HR 或面试官在 10～20 秒内理解：

1. 求职方向是 AIGC 内容生产、AI 工作流和自动化应用；
2. 能够组合 ComfyUI、AI 图像/视频、Python/API、Codex、FFmpeg 和内容工具；
3. 已独立完成产品分析、内容选题、脚本、分镜、AI 图像、AI 视频和剪辑；
4. 项目解决的问题、采用的方案、个人职责和结果分别是什么；
5. 自动化能力处于持续开发阶段，不把实验包装成成熟系统。

## 2. 真实性边界

- 不虚构效率、播放量、转化率、GMV 或节省时间等数据。
- Project 01 与 Project 02 共用同一支视频时必须明确标记共享证据，不描述为两支不同成片。
- Project 03 中资料分析、选题、脚本、分镜、AI 图片、AI 视频和剪辑为已实践环节。
- FFmpeg 只标记为 `EXPERIMENTAL`，不声称已经实现稳定的端到端自动化。
- API 接入、批量任务和稳定自动化输出标记为 `PLANNED`。
- 全站不再提及 n8n。

## 3. 保留的视觉与交互

- 深森林绿、松针绿、酸绿、鼠尾草和暖象牙色设计变量保持不变。
- `HELLO, I'M YU` 鼠标跟随、圆形中文蒙版和不超过约 20° 的标题倾斜保持不变。
- 人物逐帧滚动、反向滚动、四阶段文案切换和进度条保持不变。
- 视频弹窗、静音预览、媒体失败回退和焦点管理保持不变。
- 技能点击翻转、键盘操作、多卡独立翻转和 reduced-motion 降级保持不变。
- 不更换字体，不改成白底简历，不引入企业后台式卡片系统。

## 4. 页面顺序

页面继续采用单页锚点结构：

1. Portfolio Loader
2. Pointer Intro / `HELLO, I'M YU`
3. Hero Scroll Sequence / 人物滚动职业定位
4. About
5. Selected Work / 三项目索引
6. Project 01 / AI Product Film
7. Project 02 / AI Short Film Workflow
8. Project 03 / AI Content Workflow
9. Skills / Tool Combinations
10. Contact

固定导航调整为：

`HOME / ABOUT / WORK / SKILLS / CONTACT`

项目索引中的 `VIEW CASE STUDY` 使用页内锚点进入对应案例，不新增路由或独立详情页。

## 5. 开场与职业定位

### 5.1 鼠标跟随开场

保留主标题：

`HELLO, I'M YU`

主标题下增加职业注释：

`AIGC CONTENT PRODUCTION / AI WORKFLOW`

`AIGC 内容生产 · AI 工作流 · 自动化应用`

该区域继续以视觉识别为主，不放长文案。

### 5.2 人物滚动页

增加持续可见的职业定位：

> 使用 ComfyUI、AI 图像与视频模型、Python / API 和自动化工具，连接内容策划、素材生成、视频制作与交付。

快速关键词：

`AI VIDEO · COMFYUI · AI WORKFLOW · AUTOMATION · AI IMAGE · PYTHON / API`

四阶段文案：

| 阶段 | 英文标题 | 中文能力 | 说明 |
| --- | --- | --- | --- |
| 01 | `UNDERSTAND THE BRIEF.` | 产品资料分析与内容方向 | 从产品资料、用户需求和内容目标建立方向 |
| 02 | `DESIGN THE STORY.` | 选题、脚本与分镜设计 | 将信息转化为可执行的镜头和内容结构 |
| 03 | `GENERATE THE VISUALS.` | AI 图像与视频生成 | 通过参考素材、Prompt 和模型生成视觉素材 |
| 04 | `CONNECT THE WORKFLOW.` | 剪辑、处理与工作流交付 | 完成筛选、剪辑、输出并尝试流程自动化 |

人物动作区间、镜头推拉、转身和最终姿势不变，只更新文案层级。

## 6. About 模块

About 使用大号观点文案和简短分组，不使用传统简历卡片。

核心文案：

> 我关注的不是单次生成图片或视频，而是如何把 AI 工具组合成完整的内容生产流程。从产品资料和内容目标出发，独立完成选题、脚本、分镜、AI 图像与视频生成、素材筛选和后期剪辑，并持续尝试将 Python、API 与自动化能力接入生产流程。

实践方向：

- AI 图像生成
- AI 视频生成
- ComfyUI 工作流
- 内容策划与分镜
- Python / API
- AI 电商内容生产
- 视频剪辑与视觉处理

求职方向：

`AIGC / AI 内容生产 / AI 工作流 / AI 应用`

## 7. Selected Work 索引

项目索引采用编辑式三项布局，保持大字号、留白和轻量描边，不堆叠后台式信息卡。

每项显示：

- 项目编号；
- 中英文项目名称；
- 状态；
- 一句话定位；
- 3～5 个关键词；
- `VIEW CASE STUDY`。

项目状态：

- Project 01：`COMPLETED`
- Project 02：`COMPLETED`
- Project 03：`IN DEVELOPMENT`

## 8. 统一案例结构

三个案例统一使用以下信息架构：

1. `Problem / 问题`
2. `Solution / 方案`
3. `Tools / 工具`
4. `Role / 我的工作`
5. `Result / 结果`
6. `Evidence / 媒体证据`

桌面端采用左侧项目元信息、右侧正文与媒体的编辑式布局；移动端按问题、方案、工具、职责、结果、媒体顺序纵向排列。

## 9. Project 01 — AI Product Film

### 9.1 定位

`AI PRODUCT FILM / AI 产品宣传片`

> 从产品卖点出发，独立完成 AI 素材生成、视频制作和后期剪辑。

### 9.2 内容

**Problem**

AI 视频制作需要在参考素材、Prompt、生成、筛选和后期之间频繁切换，过程零散且容易失去统一的产品表达。

**Solution**

围绕产品卖点和生活使用场景规划视觉方向，通过参考图和镜头拆解组织 AI 图像、AI 视频与后期制作。

**Tools**

`ComfyUI · AI Image · AI Video · Photoshop · Video Editing`

**Role**

- 产品资料与卖点分析；
- 内容方向和视觉方向；
- Prompt 设计；
- AI 图像与视频生成；
- 素材筛选；
- 后期剪辑与视觉优化。

**Result**

完成一支 AI 产品宣传视频，作为最终成片证据。

### 9.3 媒体

- 保留现有 `public/media/film/ai-product-film.mp4`；
- 保留现有封面、静音预览和沉浸式播放器；
- 不把新的连续性工作流截图描述为该产品片的专属完整管线。

## 10. Project 02 — AI Short Film Workflow

### 10.1 定位

`AI SHORT FILM WORKFLOW / AI 连续镜头制作工作流`

> 通过参考图、场景约束、镜头规划和 AI 视频模型控制连续画面的角色与空间一致性。

### 10.2 内容

**Problem**

AI 视频连续镜头容易出现人物变化、服装漂移、场景结构变化和动作不受控。

**Solution**

使用角色与场景参考素材、分镜拆解、镜头描述、Prompt 模板和 ComfyUI / AI 视频模型组织连续镜头制作。

**Tools**

`ComfyUI · MiniMax H3 · Seedance · AI Image · AI Video · LLM · Video Editing`

**Role**

- 产品资料分析；
- 内容选题与策划；
- 脚本生成和修改；
- 分镜与镜头设计；
- 角色和场景参考设计；
- Prompt 设计；
- AI 图像与视频生成；
- 素材筛选；
- 后期剪辑。

**Result**

独立完成从资料分析、内容策划、脚本、分镜、AI 图像和视频生成到后期剪辑的完整流程，并将该流程应用于产品成片制作。

### 10.3 共享视频规则

Project 02 不放置第二个重复播放器。案例中显示：

`APPLIED OUTPUT · SHARED WITH PROJECT 01`

点击该入口定位到 Project 01 的视频播放器。同一视频从两个角度提供证据：Project 01 证明最终交付，Project 02 证明制作方法和连续性工作流。

### 10.4 媒体证据

- `Character & Scene Reference`
- `Prompt / Storyboard Development`
- `ComfyUI Continuity Workflow`
- `AI Video Generation`
- `Applied Output`

新的 ComfyUI 截图用于该项目。实施时裁掉右侧失败任务、无关任务队列和不必要侧栏，保留参考素材、连续性控制、镜头分组和输出节点，并提供点击放大。

两张 Seedance 生成记录截图经过裁剪后分别用于场景开发和连续镜头证据。文件列表截图不作为主视觉，只在需要证明本地工作流文件时作为次要证据。

## 11. Project 03 — AI Content Workflow

### 11.1 定位

`AI CONTENT WORKFLOW / AI 内容生产工作流`

状态：`IN DEVELOPMENT`

> 将已经实践的 AI 内容生产环节逐步整理为可复用、可自动化的工作流。

### 11.2 流程

`Product Input → AI Analysis → Content Strategy → Script → Storyboard → AI Image → AI Video → Editing → Output`

### 11.3 状态分层

**COMPLETED**

- 产品资料分析；
- 内容选题；
- 脚本生成；
- 分镜生成；
- AI 图片生成；
- AI 视频生成；
- 后期剪辑。

**EXPERIMENTAL**

- 使用 FFmpeg 尝试素材处理和流程串联；
- 尚未达到稳定、可复用的自动化生产状态。

**PLANNED**

- API 接入；
- 批量任务；
- 稳定的端到端自动化输出；
- 可复用的内容生产模板。

流程可视化采用语义化有序步骤和状态标记，不伪造后台、节点图或完成数据。

## 12. Skills / Tool Combinations

保留当前翻转交互，调整为三个核心能力组和一个低权重工程补充区。

### 12.1 核心能力组

**AI / AIGC**

- ComfyUI
- MiniMax H3
- Seedance
- AI Image Generation
- AI Video Generation
- LLM
- Prompt Design

**AUTOMATION**

- Python
- API
- Codex
- FFmpeg
- Workflow Design

FFmpeg 在卡片内容中明确标记为实验和持续强化方向。

**CONTENT / DESIGN**

- 内容策划
- 脚本与分镜
- Photoshop
- 视频剪辑
- 摄影与视觉处理
- 电商内容制作

### 12.2 Other Engineering

低权重显示：

`C/C++ · OpenCV · CAD / UG/NX · 单片机 · 传感器 · PLC / HMI 基础`

该部分不占据首屏和项目主视觉。

### 12.3 翻转背面

继续使用：

- 已能独立完成；
- 正在持续强化；
- 下一阶段目标。

不使用虚假熟练度百分比。

## 13. 组件与内容结构

现有 `App` 继续作为页面编排入口，新增以下职责明确的组件：

- `AboutSection`：观点、实践方向和求职方向；
- `ProjectIndex`：快速项目索引和页内跳转；
- `ProjectCaseStudy`：统一 Problem / Solution / Tools / Role / Result 结构；
- `ProjectMediaGallery`：真实媒体、状态、放大和媒体回退；
- `ProjectFlow`：Project 03 流程及 Completed / Experimental / Planned 状态。

`FeaturedFilm` 保留播放器职责并作为 Project 01 的媒体部分。`WorkflowProof` 调整为 Project 02 的工作流证据部分。`CapabilityGrid` 保留交互并重新组织技能数据。

`siteContent.ts` 扩展 `about`、`projects`、`skills` 和项目状态数据。展示内容继续数据驱动，避免将项目文案分散硬编码在多个组件中。

## 14. 素材引用

- 所有站内媒体继续通过 Vite `BASE_URL` 和媒体清单解析，兼容 `/yu-ai-portfolio/` 子路径。
- Project 01 视频和封面保留原路径。
- Project 02 新媒体放入 `public/media/projects/project-02/`，转换为适合网页的 WebP 或 MP4。
- 原始截图不直接拉伸；先裁剪无关 UI，再生成与展示槽位匹配的资源。
- 不使用现有 `public/projects/*.svg` 作为项目成果证据，这些装饰图不能证明本次三个项目。

## 15. 加载与性能

现有 Loader 视觉保留，但关键加载条件调整为字体、人物海报和首批关键帧。完整桌面/移动帧序列在进入页面后继续后台加载。

- 不等待完整 120/96 帧后才进入网站；
- 视频只预热 metadata，不阻塞首屏；
- 项目媒体使用懒加载；
- 大型工作流截图使用缩略图，用户打开时再查看高清版本；
- 保留最长超时和 degraded 回退；
- 不让加载动画占用 10～20 秒招聘扫描窗口的大部分时间。

## 16. 响应式与无障碍

- 验证 360、390、768、1024、1440 和宽屏桌面；
- 移动端项目案例改为纵向阅读，避免横向滚动；
- 项目索引、共享视频入口、媒体放大和技能翻转均支持键盘；
- 项目状态不仅依赖颜色，必须同时显示文本；
- 所有真实媒体提供准确替代文本；
- 保留 `prefers-reduced-motion`，禁用强烈倾斜、3D 翻转和滚动动画时仍可完整阅读内容；
- 200% 缩放后项目文案、工具标签和媒体操作仍可用。

## 17. 错误处理

- 项目图片失败：显示项目名称、媒体类型和失败说明，不显示空白卡片；
- 视频失败：保留封面和直接打开视频入口；
- 高清工作流图失败：保留缩略图与文字说明；
- 共享视频锚点失败：入口仍指向 Project 01 案例顶部；
- 人物帧加载失败：使用静态人物海报和四段可读文案；
- JavaScript 禁用：`noscript` 更新职业定位、三个项目状态、核心技能和联系方式。

## 18. 测试与部署

需要新增或更新以下测试：

- 首页职业定位和关键词；
- About 文案和求职方向；
- 三项目索引、状态和锚点；
- 三案例统一信息结构；
- Project 01 视频入口保持可用；
- Project 02 共享视频入口指向 Project 01；
- Project 03 状态分层正确；
- 全站不包含 `n8n`；
- Skills 分类、翻转、键盘和 reduced-motion；
- 新媒体路径在 GitHub Pages 基础路径下解析；
- Desktop 和 Mobile 没有横向溢出；
- 现有视频、人物帧、工作流和联系方式回归测试。

部署继续使用 GitHub Actions 和 GitHub Pages，`vite.config.ts` 必须保持：

```ts
base: "/yu-ai-portfolio/"
```

## 19. 验收标准

- 10～20 秒内可以识别求职方向、核心工具、三项目和工作流能力；
- 首屏明确显示 AIGC 内容生产、AI 工作流和自动化应用定位；
- About 简短、准确，不变成长篇简历；
- 三个项目均显示 Problem、Solution、Tools、Role、Result；
- Project 01 和 Project 02 明确标记共享同一视频证据；
- Project 02 使用新连续性工作流截图，不出现右侧失败任务；
- Project 03 真实区分 Completed、Experimental 和 Planned；
- 全站不显示 n8n；
- FFmpeg 不被描述为成熟自动化系统；
- 原有核心动画、交互、字体和配色保持；
- Desktop、Mobile、键盘和 reduced-motion 均可用；
- `npm run test:run`、`npm run build` 和 GitHub Pages 部署成功。

## 20. 不在本次范围

- 新增后端、登录、CMS 或数据收集；
- 创建虚构项目素材或虚构业务数据；
- 制作第二支视频；
- 替换人物逐帧动画素材；
- 重新设计品牌配色和字体；
- 将实验性 FFmpeg 流程扩展为完整生产系统；
- 大规模重构与本次招聘叙事无关的基础设施。
