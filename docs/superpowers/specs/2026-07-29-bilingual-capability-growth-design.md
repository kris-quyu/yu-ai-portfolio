# 双语能力成长卡设计

## 目标

统一六张能力卡背面的语言层级，解决前三张仅英文、后三张仅中文造成的视觉割裂。

## 视觉层级

- 每个成长项采用“中文主标题 + 英文副标题”。
- 中文位于上方，保持当前粗体与主要字号。
- 英文位于下方，字号缩小一档、字重降低、颜色降低对比度。
- 三个成长项之间的分隔线、卡片配色、翻转动画与卡片高度保持不变。
- 不增加新的交互，不改变正面卡片内容。

## 固定文案

### 01 — AI 内容与自动化

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | AI 工作流搭建与自动化 | AI workflow setup and automation |
| 正在持续强化 | 稳定的多工具协同 | Reliable multi-tool orchestration |
| 下一阶段目标 | 可复用的生产系统 | Reusable production systems |

### 02 — 视频编导与剪辑

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | 脚本策划与剪辑指导 | Script and edit direction |
| 正在持续强化 | AI 辅助视觉叙事 | AI-assisted visual storytelling |
| 下一阶段目标 | 端到端影片制作 | End-to-end film production |

### 03 — 电商内容转化

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | 产品价值表达 | Product value communication |
| 正在持续强化 | 内容转化策略 | Content conversion strategy |
| 下一阶段目标 | 可衡量的电商成果 | Measurable commerce outcomes |

### 04 — 编程与视觉识别

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | 基础程序开发与视觉处理 | Foundational programming and visual processing |
| 正在持续强化 | AI 辅助编程与视觉识别 | AI-assisted programming and visual recognition |
| 下一阶段目标 | 将代码能力接入内容自动化流程 | Integrate coding into content automation |

### 05 — 硬件开发与数字制造

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | 硬件调试与三维建模 | Hardware debugging and 3D modeling |
| 正在持续强化 | 软硬件联动原型 | Hardware-software integrated prototyping |
| 下一阶段目标 | 完成可展示的智能设备作品 | Build a showcase-ready smart device |

### 06 — 专业摄影与视觉后期

| 阶段 | 中文主标题 | 英文副标题 |
| --- | --- | --- |
| 已能独立完成 | 专业拍摄与后期制作 | Professional photography and post-production |
| 正在持续强化 | 商业级灯光与镜头语言 | Commercial lighting and visual language |
| 下一阶段目标 | 建立稳定的视觉内容风格 | Establish a consistent visual style |

## 数据与组件

- 能力数据中的 `mastered`、`growing`、`next` 改为包含 `zh` 与 `en` 的双语对象。
- `CapabilityGrid` 为每个成长项渲染两个独立文本元素，便于视觉与无障碍层级控制。
- 翻转按钮的可访问描述同时包含中英文内容。

## 验证

- 六张卡背面均显示 3 组中文主标题与英文副标题。
- 多卡同时翻转、键盘翻转与返回正面行为保持不变。
- 桌面三列、平板两列、手机单列布局保持不变。
- 完整测试与生产构建通过。
