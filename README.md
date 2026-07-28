# QX / AI LAB

瞿先生的单页 AI 创意能力网站。首屏使用滚动控制的 Canvas 人物帧序列，随后展示一支 AI 产品影片、一份 ComfyUI 工作流证明、三项核心能力，以及可直接使用的联系方式。

## 本地开发

需要 Node.js 22 和 npm。

```bash
npm ci
npm run dev
```

开发服务器默认使用 Vite。项目部署基础路径是 `/yu-ai-portfolio/`，本地开发首页仍可直接通过 Vite 输出的地址访问。

## 验证与生产预览

```bash
npm run test:run
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

测试覆盖内容契约、完整页面结构、媒体回退、滚动映射、导航、影片弹窗、能力卡片与联系操作。生产预览地址为 `http://127.0.0.1:4173/yu-ai-portfolio/`。

如需从已批准的原始素材重新生成优化媒体，可运行：

```bash
npm run prepare:assets
```

该命令依赖本机可用的 FFmpeg，并会更新 `public/media/` 中的帧序列、海报、影片和媒体清单。

## GitHub Pages

`main` 分支推送会触发 `.github/workflows/deploy.yml`。工作流使用 Node.js 22 执行 `npm ci` 和 `npm run build`，然后将 `dist/` 部署到 GitHub Pages。请保留 `vite.config.ts` 中的 `base: "/yu-ai-portfolio/"`，否则媒体与静态资源在项目子路径下会失效。
