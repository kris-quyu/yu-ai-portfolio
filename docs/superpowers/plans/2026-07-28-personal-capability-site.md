# Personal Capability Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive one-page personal capability site whose hero scroll controls a half-body animated character, followed by one AI film, one workflow proof, three capability cards, and contact actions.

**Architecture:** A static React/Vite application keeps all copy in a typed content module and separates each page section into a focused component. A pre-generated WebP frame sequence is drawn to Canvas and controlled by GSAP ScrollTrigger; pure scroll math remains framework-independent and unit tested. Media preparation is handled by a repeatable Node/FFmpeg script, while Vitest and Playwright cover behavior, accessibility, responsive layout, and fallbacks.

**Tech Stack:** React, TypeScript, Vite, GSAP ScrollTrigger, Canvas 2D, CSS Modules, Vitest, React Testing Library, Playwright, FFmpeg.

## Existing Repository Execution Addendum

- This plan now executes inside the existing `yu-ai-portfolio` repository and the isolated `feat/personal-capability-site` worktree.
- Preserve the existing React/Vite/TypeScript architecture, `base: "/yu-ai-portfolio/"`, GitHub Pages workflow, and compatible GSAP/Lenis patterns.
- Task 1 must not run `git init`, `npm init`, replace the existing toolchain, or bootstrap a new template. It should add only the missing test dependencies/configuration, typed content contract, and minimal application shell needed by later tasks.
- Existing files listed as “Create” are “Modify” when already present. Prefer focused incremental replacement of obsolete portfolio sections over unrelated restructuring.
- The user explicitly authorizes deleting obsolete legacy portfolio components, styles, and media from the original GitHub project when the replacement no longer uses them. Preserve repository history, the GitHub Pages workflow, Vite base configuration, and all assets required by the new site.
- Asset and manifest URLs must honor Vite’s configured base path so the deployed project works at `/yu-ai-portfolio/`, not only at the domain root.
- Browser automation is not authorized by default. Unit/component/build checks may run normally; interactive browser verification will use the user’s already-open Codex in-app browser.

## Global Constraints

- The site is a frontend-only static single page with no backend, login, CMS, analytics, or form submission.
- Display exactly one AI product film and exactly one ComfyUI workflow proof.
- Do not display “4 年工作经验” or provide a résumé download.
- Display only the three approved capabilities: AI content and automation, video direction and editing, and commerce content conversion.
- Desktop and mobile must both keep scroll-controlled character motion.
- The approved camera sequence is: push from half-body to head close-up, pull back to the complete half-body source frame while the right hand lowers, hold while the character turns toward camera, then freeze in the final pose.
- The approved character source is `E:\D\7月28日(2)\7月28日(2)-1.mp4`; do not regenerate a full-body version.
- Users with `prefers-reduced-motion: reduce`, unsupported Canvas, insufficient media loading, or media errors receive a static poster without losing content.
- Do not autoplay audio.
- Required responsive widths are 360px, 390px, 768px, and 1440px with no horizontal overflow.
- Preserve the source files; only copy or derive optimized media into `public/media/`.
- The project is an existing Git repository. Work only on the isolated feature branch and preserve its configured GitHub Pages deployment.

---

## Planned File Structure

```text
index.html
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
playwright.config.ts
scripts/
  prepare-assets.mjs
  prepare-assets.test.ts
public/
  media/
    media-manifest.json
    portrait/
      poster.webp
      desktop/frame-0001.webp ... frame-0120.webp
      mobile/frame-0001.webp ... frame-0096.webp
    film/
      ai-product-film.mp4
      poster.webp
    workflow/
      comfyui-workflow.webp
src/
  main.tsx
  App.tsx
  content/
    siteContent.ts
    siteContent.test.ts
  styles/global.css
  test/setup.ts
  lib/
    media.ts
    media.test.ts
    useReducedMotion.ts
  features/
    navigation/
      Navigation.tsx
      Navigation.module.css
      Navigation.test.tsx
    hero/
      heroMath.ts
      heroMath.test.ts
      frameLoader.ts
      frameLoader.test.ts
      HeroScrollSequence.tsx
      HeroScrollSequence.module.css
      HeroScrollSequence.test.tsx
    film/
      FeaturedFilm.tsx
      FeaturedFilm.module.css
      FeaturedFilm.test.tsx
    workflow/
      WorkflowProof.tsx
      WorkflowProof.module.css
      WorkflowProof.test.tsx
    capabilities/
      CapabilityGrid.tsx
      CapabilityGrid.module.css
      CapabilityGrid.test.tsx
    contact/
      ContactSection.tsx
      ContactSection.module.css
      ContactSection.test.tsx
e2e/
  site.spec.ts
```

---

### Task 1: Project Foundation and Content Contract

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `src/content/siteContent.ts`
- Test: `src/content/siteContent.test.ts`

**Interfaces:**
- Produces: `SiteContent`, `Capability`, `ContactDetails`, and `siteContent`.
- Later tasks consume `siteContent.hero`, `siteContent.film`, `siteContent.workflow`, `siteContent.capabilities`, and `siteContent.contact`.

- [ ] **Step 1: Initialize version control and install the project dependencies**

Run:

```powershell
git init
npm.cmd init -y
npm.cmd install react react-dom gsap
npm.cmd install -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/react @types/react-dom @playwright/test
```

Expected: `.git/`, `package.json`, and `package-lock.json` exist; dependency installation exits with code 0.

- [ ] **Step 2: Write the failing content contract test**

```ts
// src/content/siteContent.test.ts
import { describe, expect, it } from 'vitest';
import { siteContent } from './siteContent';

describe('siteContent', () => {
  it('contains the approved five-section story', () => {
    expect(siteContent.navigation.map((item) => item.id)).toEqual([
      'profile',
      'film',
      'system',
      'capabilities',
      'contact',
    ]);
    expect(siteContent.capabilities).toHaveLength(3);
    expect(siteContent.contact.phone).toBe('13123986103');
    expect(siteContent.contact.email).toBe('1282736393@qq.com');
  });

  it('excludes rejected résumé content', () => {
    const serialized = JSON.stringify(siteContent);
    expect(serialized).not.toContain('4年工作经验');
    expect(serialized).not.toContain('4 年工作经验');
    expect(serialized).not.toContain('下载简历');
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run:

```powershell
npm.cmd exec vitest run src/content/siteContent.test.ts
```

Expected: FAIL because `src/content/siteContent.ts` does not exist.

- [ ] **Step 4: Add the typed content module**

```ts
// src/content/siteContent.ts
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
```

- [ ] **Step 5: Add Vite, TypeScript, test setup, and the minimal application shell**

Set these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest",
    "test:run": "vitest run",
    "e2e": "playwright test",
    "prepare:assets": "node scripts/prepare-assets.mjs"
  }
}
```

Configure `vite.config.ts` with React and Vitest:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "scripts"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create the minimal `src/App.tsx`:

```tsx
import { siteContent } from './content/siteContent';

export default function App() {
  return <main><h1>{siteContent.hero.titleLines.join(' ')}</h1></main>;
}
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="瞿先生的 AI 内容、视频与电商能力展示网站" />
    <title>QX / AI LAB</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Run the content test and production build**

Run:

```powershell
npm.cmd run test:run -- src/content/siteContent.test.ts
npm.cmd run build
```

Expected: both commands exit with code 0; `dist/` is created.

- [ ] **Step 7: Commit the foundation**

```powershell
git add package.json package-lock.json tsconfig*.json vite.config.ts index.html src
git commit -m "chore: scaffold personal capability site"
```

---

### Task 2: Repeatable Media Preparation Pipeline

**Files:**
- Create: `scripts/prepare-assets.mjs`
- Test: `scripts/prepare-assets.test.ts`
- Generate: `public/media/media-manifest.json`
- Generate: `public/media/portrait/poster.webp`
- Generate: `public/media/portrait/desktop/frame-0001.webp` through `frame-0120.webp`
- Generate: `public/media/portrait/mobile/frame-0001.webp` through `frame-0096.webp`
- Generate: `public/media/film/ai-product-film.mp4`
- Generate: `public/media/film/poster.webp`
- Generate: `public/media/workflow/comfyui-workflow.webp`

**Interfaces:**
- Produces: `MediaManifest` JSON with exact portrait frame counts and public URLs.
- Later tasks consume `/media/media-manifest.json`, `/media/portrait/poster.webp`, `/media/film/ai-product-film.mp4`, `/media/film/poster.webp`, and `/media/workflow/comfyui-workflow.webp`.

- [ ] **Step 1: Write the failing FFmpeg argument test**

```ts
// scripts/prepare-assets.test.ts
import { describe, expect, it } from 'vitest';
import { buildFrameArgs, frameFileName } from './prepare-assets.mjs';

describe('portrait frame preparation', () => {
  it('builds 15 fps desktop WebP extraction arguments', () => {
    expect(buildFrameArgs('portrait.mp4', 15, 1600, 'out/frame-%04d.webp')).toEqual([
      '-y', '-i', 'portrait.mp4',
      '-vf', 'fps=15,scale=1600:-2:force_original_aspect_ratio=decrease:flags=lanczos',
      '-c:v', 'libwebp', '-quality', '78', '-compression_level', '4',
      'out/frame-%04d.webp',
    ]);
  });

  it('formats four-digit frame names', () => {
    expect(frameFileName(1)).toBe('frame-0001.webp');
    expect(frameFileName(120)).toBe('frame-0120.webp');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
npm.cmd exec vitest run scripts/prepare-assets.test.ts
```

Expected: FAIL because `prepare-assets.mjs` does not exist.

- [ ] **Step 3: Implement safe argument-array FFmpeg commands**

Export these functions from `scripts/prepare-assets.mjs`:

```js
export function frameFileName(index) {
  return `frame-${String(index).padStart(4, '0')}.webp`;
}

export function buildFrameArgs(input, fps, width, outputPattern) {
  return [
    '-y', '-i', input,
    '-vf', `fps=${fps},scale=${width}:-2:force_original_aspect_ratio=decrease:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '78', '-compression_level', '4',
    outputPattern,
  ];
}
```

The script must:

1. Parse `--portrait`, `--film`, and `--workflow`.
2. Validate that all three input paths exist.
3. Create the `public/media/` directory tree.
4. Run FFmpeg through `spawnSync('ffmpeg', args, { stdio: 'inherit' })`.
5. Extract desktop portrait frames at 15 fps and 1600px maximum width.
6. Extract mobile portrait frames at 12 fps and 960px maximum width.
7. Extract the portrait poster from second 7.2.
8. Optimize the AI film with H.264, `-crf 23`, AAC 128k, and `-movflags +faststart`.
9. Extract the film poster from second 20.
10. Convert the workflow screenshot to WebP at maximum width 1600px.
11. Count the generated frame files and fail unless counts are exactly 120 and 96.
12. Write:

```json
{
  "portrait": {
    "poster": "/media/portrait/poster.webp",
    "desktop": { "pattern": "/media/portrait/desktop/frame-%04d.webp", "count": 120 },
    "mobile": { "pattern": "/media/portrait/mobile/frame-%04d.webp", "count": 96 }
  },
  "film": {
    "src": "/media/film/ai-product-film.mp4",
    "poster": "/media/film/poster.webp"
  },
  "workflow": {
    "src": "/media/workflow/comfyui-workflow.webp"
  }
}
```

- [ ] **Step 4: Run the unit test**

Run:

```powershell
npm.cmd exec vitest run scripts/prepare-assets.test.ts
```

Expected: PASS.

- [ ] **Step 5: Generate the approved media**

Run:

```powershell
npm.cmd run prepare:assets -- --portrait "E:\D\7月28日(2)\7月28日(2)-1.mp4" --film "D:\weix\xwechat_files\wxid_exeyb1jp5hnl22_98c6\msg\video\2026-07\ed5cb1179a49224c3e29c3b149e3266f.mp4" --workflow "C:\Users\qxy12\AppData\Local\Temp\codex-clipboard-a10c2003-1660-41e7-9601-96a8c04ca136.png"
```

Expected: the script reports 120 desktop frames and 96 mobile frames; all manifest paths exist.

- [ ] **Step 6: Commit the media pipeline and generated assets**

```powershell
git add scripts public/media
git commit -m "feat: prepare optimized portfolio media"
```

---

### Task 3: Hero Scroll Math and Frame Loading

**Files:**
- Create: `src/lib/media.ts`
- Test: `src/lib/media.test.ts`
- Create: `src/features/hero/heroMath.ts`
- Test: `src/features/hero/heroMath.test.ts`
- Create: `src/features/hero/frameLoader.ts`
- Test: `src/features/hero/frameLoader.test.ts`

**Interfaces:**
- Produces: `loadMediaManifest(): Promise<MediaManifest>`.
- Produces: `getHeroFrame(progress: number, frameCount: number): number`.
- Produces: `getHeroTransform(progress: number): HeroTransform`.
- Produces: `drawHeroFrame(context, image, transform, canvasWidth, canvasHeight): void`.
- Produces: `loadFrameSequence(options: FrameLoadOptions): Promise<HTMLImageElement[]>`.
- `HeroScrollSequence` in Task 4 consumes all four interfaces.

- [ ] **Step 1: Write failing hero math tests**

```ts
// src/features/hero/heroMath.test.ts
import { describe, expect, it } from 'vitest';
import { getHeroFrame, getHeroTransform } from './heroMath';

describe('getHeroFrame', () => {
  it('clamps scroll progress to valid frames', () => {
    expect(getHeroFrame(-1, 120)).toBe(0);
    expect(getHeroFrame(0.5, 120)).toBe(60);
    expect(getHeroFrame(1, 120)).toBe(119);
    expect(getHeroFrame(2, 120)).toBe(119);
  });
});

describe('getHeroTransform', () => {
  it('pushes in, pulls back, then holds', () => {
    expect(getHeroTransform(0)).toMatchObject({ scale: 1, phase: 'push-in' });
    expect(getHeroTransform(0.2)).toMatchObject({ scale: 1.55, phase: 'pull-back' });
    expect(getHeroTransform(0.55)).toMatchObject({ scale: 1, phase: 'turn' });
    expect(getHeroTransform(0.9)).toMatchObject({ scale: 1, phase: 'hold' });
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```powershell
npm.cmd exec vitest run src/features/hero/heroMath.test.ts
```

Expected: FAIL because `heroMath.ts` does not exist.

- [ ] **Step 3: Implement the approved nonlinear camera mapping**

```ts
// src/features/hero/heroMath.ts
export type HeroPhase = 'push-in' | 'pull-back' | 'turn' | 'hold';

export interface HeroTransform {
  scale: number;
  focusX: number;
  focusY: number;
  phase: HeroPhase;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const segment = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));

export function getHeroFrame(progress: number, frameCount: number): number {
  if (frameCount < 1) return 0;
  return Math.min(frameCount - 1, Math.round(clamp01(progress) * frameCount));
}

export function getHeroTransform(progress: number): HeroTransform {
  const p = clamp01(progress);
  if (p < 0.2) {
    const t = segment(p, 0, 0.2);
    return { scale: lerp(1, 1.55, t), focusX: lerp(0.67, 0.69, t), focusY: lerp(0.48, 0.28, t), phase: 'push-in' };
  }
  if (p < 0.55) {
    const t = segment(p, 0.2, 0.55);
    return { scale: lerp(1.55, 1, t), focusX: lerp(0.69, 0.67, t), focusY: lerp(0.28, 0.48, t), phase: 'pull-back' };
  }
  if (p < 0.82) return { scale: 1, focusX: 0.67, focusY: 0.48, phase: 'turn' };
  return { scale: 1, focusX: 0.67, focusY: 0.48, phase: 'hold' };
}

export function drawHeroFrame(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  transform: HeroTransform,
  canvasWidth: number,
  canvasHeight: number,
) {
  const coverScale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const drawWidth = image.width * coverScale * transform.scale;
  const drawHeight = image.height * coverScale * transform.scale;
  const x = canvasWidth * transform.focusX - drawWidth * transform.focusX;
  const y = canvasHeight * transform.focusY - drawHeight * transform.focusY;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}
```

- [ ] **Step 4: Implement manifest types and frame loading**

`src/lib/media.ts` must export:

```ts
export interface MediaManifest {
  portrait: {
    poster: string;
    desktop: { pattern: string; count: number };
    mobile: { pattern: string; count: number };
  };
  film: { src: string; poster: string };
  workflow: { src: string };
}

export async function loadMediaManifest(): Promise<MediaManifest> {
  const response = await fetch('/media/media-manifest.json');
  if (!response.ok) throw new Error(`Media manifest failed: ${response.status}`);
  return response.json() as Promise<MediaManifest>;
}
```

Add the manifest test:

```ts
// src/lib/media.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadMediaManifest } from './media';

describe('loadMediaManifest', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the typed manifest when the request succeeds', async () => {
    const manifest = {
      portrait: {
        poster: '/media/portrait/poster.webp',
        desktop: { pattern: '/desktop/frame-%04d.webp', count: 120 },
        mobile: { pattern: '/mobile/frame-%04d.webp', count: 96 },
      },
      film: { src: '/film.mp4', poster: '/film.webp' },
      workflow: { src: '/workflow.webp' },
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(manifest),
    }));
    await expect(loadMediaManifest()).resolves.toEqual(manifest);
  });

  it('rejects a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(loadMediaManifest()).rejects.toThrow('Media manifest failed: 500');
  });
});
```

`src/features/hero/frameLoader.ts` must:

- Format `%04d` URLs.
- Load at most six images concurrently.
- Report progress after every settled image.
- Reject when the poster or more than 5% of frames fail.
- Preserve frame order.
- Stop when an `AbortSignal` is aborted.

Use this exported signature:

```ts
export interface FrameLoadOptions {
  pattern: string;
  count: number;
  concurrency?: number;
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}

export function loadFrameSequence(options: FrameLoadOptions): Promise<HTMLImageElement[]>;
```

Use this queue shape so concurrency and ordering are deterministic:

```ts
const formatFrameUrl = (pattern: string, index: number) =>
  pattern.replace('%04d', String(index).padStart(4, '0'));

export async function loadFrameSequence({
  pattern,
  count,
  concurrency = 6,
  signal,
  onProgress,
}: FrameLoadOptions): Promise<HTMLImageElement[]> {
  const frames = new Array<HTMLImageElement>(count);
  let next = 0;
  let settled = 0;
  let failures = 0;

  const loadOne = (index: number) => new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => { frames[index] = image; resolve(); };
    image.onerror = () => { failures += 1; resolve(); };
    image.src = formatFrameUrl(pattern, index + 1);
  }).finally(() => {
    settled += 1;
    onProgress?.(settled, count);
  });

  const worker = async () => {
    while (next < count) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const index = next++;
      await loadOne(index);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, count) }, worker));
  if (failures / count > 0.05) throw new Error('Portrait frame loading failed');
  const fallback = frames.find((frame): frame is HTMLImageElement => Boolean(frame));
  if (!fallback) throw new Error('Portrait poster frame missing');
  for (let index = 0; index < frames.length; index += 1) {
    if (!frames[index]) frames[index] = frames[index - 1] ?? fallback;
  }
  return frames;
}
```

- [ ] **Step 5: Add frame loader tests**

Test these exact cases in `frameLoader.test.ts`:

1. `%04d` becomes `0001`, `0002`, and `0003`.
2. Returned image order matches frame order when load events complete out of order.
3. `onProgress` receives `(1, 3)`, `(2, 3)`, and `(3, 3)`.
4. Aborting rejects with an `AbortError`.
5. Two failures out of twenty frames reject because the 5% threshold is exceeded.

- [ ] **Step 6: Run all library tests**

Run:

```powershell
npm.cmd exec vitest run src/lib/media.test.ts src/features/hero/heroMath.test.ts src/features/hero/frameLoader.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit hero foundations**

```powershell
git add src/lib src/features/hero
git commit -m "feat: add scroll sequence math and frame loading"
```

---

### Task 4: Scroll-Controlled Hero Component

**Files:**
- Create: `src/lib/useReducedMotion.ts`
- Create: `src/features/hero/HeroScrollSequence.tsx`
- Create: `src/features/hero/HeroScrollSequence.module.css`
- Test: `src/features/hero/HeroScrollSequence.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `siteContent.hero`, `loadMediaManifest`, `loadFrameSequence`, `getHeroFrame`, and `getHeroTransform`.
- Produces: `<HeroScrollSequence />` with section id `profile`.
- `App` and E2E tests consume the `profile` section and its loading/fallback states.

- [ ] **Step 1: Write failing component tests**

```tsx
// src/features/hero/HeroScrollSequence.test.tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroScrollSequence } from './HeroScrollSequence';

vi.mock('../../lib/media', () => ({
  loadMediaManifest: vi.fn().mockResolvedValue({
    portrait: {
      poster: '/media/portrait/poster.webp',
      desktop: { pattern: '/desktop/frame-%04d.webp', count: 120 },
      mobile: { pattern: '/mobile/frame-%04d.webp', count: 96 },
    },
  }),
}));
vi.mock('./frameLoader', () => ({
  loadFrameSequence: vi.fn(() => new Promise(() => undefined)),
}));

describe('HeroScrollSequence', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  it('renders approved hero copy and a canvas', () => {
    render(<HeroScrollSequence />);
    expect(screen.getByRole('heading', { name: /BUILDING CREATIVE WORKFLOWS/i })).toBeInTheDocument();
    expect(screen.getByLabelText('滚动控制的动画人物')).toBeInTheDocument();
  });

  it('uses the static poster when reduced motion is enabled', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<HeroScrollSequence />);
    expect(screen.getByAltText('瞿先生动画人物')).toHaveAttribute('src', '/media/portrait/poster.webp');
  });
});
```

- [ ] **Step 2: Run the component tests and verify they fail**

Run:

```powershell
npm.cmd exec vitest run src/features/hero/HeroScrollSequence.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement reduced-motion observation**

`useReducedMotion.ts` must subscribe to `(prefers-reduced-motion: reduce)` and return a boolean. It must remove its listener during cleanup.

- [ ] **Step 4: Implement the hero rendering loop**

`HeroScrollSequence.tsx` must:

1. Render a 250vh outer section and sticky 100svh inner stage.
2. Render the approved title and summary on the left.
3. Immediately render `/media/portrait/poster.webp`.
4. Choose desktop frames at viewport width `>= 768` and mobile frames below it.
5. Preload frames and show `LOADING 0–100%`.
6. Register a GSAP ScrollTrigger from the outer section start to its end.
7. Store target progress in a ref rather than React state.
8. Smooth current progress toward target progress with `current += (target - current) * 0.12`.
9. Call `getHeroFrame` and `getHeroTransform` on each changed frame.
10. Draw the frame with a cover crop centered on `focusX` and `focusY`, then apply `scale`.
11. Stop its animation frame loop and abort loading on unmount.
12. Use the poster if Canvas is unavailable or frame loading exceeds the failure threshold.

The core scroll and render loop must follow this shape:

```tsx
useLayoutEffect(() => {
  if (reducedMotion || fallback || frames.length === 0) return;
  const section = sectionRef.current;
  const canvas = canvasRef.current;
  const context = canvas?.getContext('2d');
  if (!section || !canvas || !context) {
    setFallback(true);
    return;
  }

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) => { targetProgress.current = progress; },
  });

  const tick = () => {
    currentProgress.current +=
      (targetProgress.current - currentProgress.current) * 0.12;
    const index = getHeroFrame(currentProgress.current, frames.length);
    if (index !== lastFrame.current) {
      drawHeroFrame(
        context,
        frames[index],
        getHeroTransform(currentProgress.current),
        canvas.width,
        canvas.height,
      );
      lastFrame.current = index;
    }
    raf.current = requestAnimationFrame(tick);
  };
  raf.current = requestAnimationFrame(tick);

  return () => {
    trigger.kill();
    cancelAnimationFrame(raf.current);
  };
}, [fallback, frames, reducedMotion]);
```

Export `drawHeroFrame` from `heroMath.ts` so its cover-crop calculation can be unit tested with a mocked `CanvasRenderingContext2D`.

The accessible structure must include:

```tsx
<section id="profile" aria-labelledby="hero-title">
  <canvas aria-label="滚动控制的动画人物" role="img" />
  <h1 id="hero-title">
    <span>BUILDING</span><span>CREATIVE</span><span>WORKFLOWS.</span>
  </h1>
</section>
```

- [ ] **Step 5: Add the hero visual rules**

`HeroScrollSequence.module.css` must include:

- Dark charcoal background with a restrained green radial glow behind the character.
- Character occupying the right 52–58% on desktop.
- Copy occupying the left 48%.
- Mobile copy in the top safe area and character centered slightly right.
- Fluorescent green scroll progress rail.
- No baked particles or decorative icons.
- `@media (prefers-reduced-motion: reduce)` removing sticky behavior and transitions.

- [ ] **Step 6: Run component tests and build**

Run:

```powershell
npm.cmd exec vitest run src/features/hero/HeroScrollSequence.test.tsx
npm.cmd run build
```

Expected: PASS and build exits with code 0.

- [ ] **Step 7: Commit the hero**

```powershell
git add src/lib/useReducedMotion.ts src/features/hero src/App.tsx
git commit -m "feat: build scroll-controlled character hero"
```

---

### Task 5: Page Shell and Section Navigation

**Files:**
- Create: `src/features/navigation/Navigation.tsx`
- Create: `src/features/navigation/Navigation.module.css`
- Test: `src/features/navigation/Navigation.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `siteContent.navigation`.
- Produces: `Navigation` links pointing to all five approved section IDs.
- Later section components must expose matching `id` values.

- [ ] **Step 1: Write the failing navigation test**

```tsx
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  beforeAll(() => {
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })));
  });

  it('links to all approved sections', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: 'PROFILE' })).toHaveAttribute('href', '#profile');
    expect(screen.getByRole('link', { name: 'FILM' })).toHaveAttribute('href', '#film');
    expect(screen.getByRole('link', { name: 'SYSTEM' })).toHaveAttribute('href', '#system');
    expect(screen.getByRole('link', { name: 'CAPABILITIES' })).toHaveAttribute('href', '#capabilities');
    expect(screen.getByRole('link', { name: 'CONTACT' })).toHaveAttribute('href', '#contact');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
npm.cmd exec vitest run src/features/navigation/Navigation.test.tsx
```

Expected: FAIL because `Navigation.tsx` does not exist.

- [ ] **Step 3: Implement the sticky navigation**

Implement semantic `<header><nav aria-label="主要导航">`. Use `IntersectionObserver` with a `rootMargin` centered on the viewport to set `aria-current="location"` on the active section. Clicking links uses native hash navigation with `scroll-behavior: smooth`; reduced-motion mode uses `auto`.

```tsx
export function Navigation() {
  const [active, setActive] = useState<SectionId>('profile');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    siteContent.navigation.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header>
      <a href="#profile" aria-label="返回首页">QX / AI LAB</a>
      <nav aria-label="主要导航">
        {siteContent.navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'location' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <span aria-label="当前可联系">● ONLINE</span>
    </header>
  );
}
```

- [ ] **Step 4: Add global design tokens**

Define in `global.css`:

```css
:root {
  color-scheme: dark;
  --bg: #090d0a;
  --panel: #111713;
  --line: #313b33;
  --text: #f4f7f1;
  --muted: #949f97;
  --accent: #b7ff2a;
  --radius-lg: 1.5rem;
  --page-gutter: clamp(1rem, 4vw, 4rem);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}

html { scroll-behavior: smooth; background: var(--bg); }
body { margin: 0; overflow-x: clip; background: var(--bg); color: var(--text); }
button, a { font: inherit; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
```

- [ ] **Step 5: Compose navigation and the hero in `App.tsx`**

```tsx
export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <HeroScrollSequence />
      </main>
    </>
  );
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm.cmd exec vitest run src/features/navigation/Navigation.test.tsx
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 7: Commit navigation and global styling**

```powershell
git add src/features/navigation src/styles/global.css src/App.tsx
git commit -m "feat: add sticky section navigation"
```

---

### Task 6: AI Film Preview and Accessible Modal Player

**Files:**
- Create: `src/features/film/FeaturedFilm.tsx`
- Create: `src/features/film/FeaturedFilm.module.css`
- Test: `src/features/film/FeaturedFilm.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `siteContent.film` and `MediaManifest.film`.
- Produces: section id `film`, muted viewport preview, and an accessible modal player.

- [ ] **Step 1: Write failing film interaction tests**

```tsx
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { FeaturedFilm } from './FeaturedFilm';

describe('FeaturedFilm', () => {
  beforeAll(() => {
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    })));
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  it('shows only the approved film and opens a player dialog', async () => {
    const user = userEvent.setup();
    render(<FeaturedFilm />);
    expect(screen.getAllByText('AI PRODUCT FILM')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: '播放 AI 产品视频' }));
    expect(screen.getByRole('dialog', { name: 'AI PRODUCT FILM' })).toBeInTheDocument();
  });

  it('closes the dialog with Escape', async () => {
    const user = userEvent.setup();
    render(<FeaturedFilm />);
    await user.click(screen.getByRole('button', { name: '播放 AI 产品视频' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
npm.cmd exec vitest run src/features/film/FeaturedFilm.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the viewport preview**

Render one `<video muted loop playsInline preload="metadata">` with the approved poster. Use `IntersectionObserver` at threshold `0.55` to call `video.play()` when visible and `video.pause()` when hidden. Ignore rejected autoplay promises because the poster remains visible.

```tsx
useEffect(() => {
  const video = previewRef.current;
  if (!video) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) void video.play().catch(() => undefined);
    else video.pause();
  }, { threshold: 0.55 });
  observer.observe(video);
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 4: Implement the modal**

The modal must:

- Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Include one video with native controls and sound controlled by the user.
- Close on Escape, overlay click, or close button.
- Return focus to the play button after closing.
- Prevent background scrolling while open.
- Pause and reset the modal video on close.

Use one `closeDialog` function for every exit path:

```tsx
const closeDialog = () => {
  const video = dialogVideoRef.current;
  video?.pause();
  if (video) video.currentTime = 0;
  setOpen(false);
  requestAnimationFrame(() => triggerRef.current?.focus());
};

useEffect(() => {
  if (!open) return;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeDialog();
  };
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKeyDown);
  return () => {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeyDown);
  };
}, [open]);
```

- [ ] **Step 5: Add film styling and mount the section**

Use a two-column desktop layout, single-column mobile layout, bordered rounded media frame, fluorescent play button, and restrained scale-in animation. Add `<FeaturedFilm />` after the hero in `App.tsx`.

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm.cmd exec vitest run src/features/film/FeaturedFilm.test.tsx
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 7: Commit the film section**

```powershell
git add src/features/film src/App.tsx
git commit -m "feat: add AI film preview and modal player"
```

---

### Task 7: Workflow Proof and Capability Cards

**Files:**
- Create: `src/features/workflow/WorkflowProof.tsx`
- Create: `src/features/workflow/WorkflowProof.module.css`
- Test: `src/features/workflow/WorkflowProof.test.tsx`
- Create: `src/features/capabilities/CapabilityGrid.tsx`
- Create: `src/features/capabilities/CapabilityGrid.module.css`
- Test: `src/features/capabilities/CapabilityGrid.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `WorkflowProof` consumes `siteContent.workflow` and `/media/workflow/comfyui-workflow.webp`.
- `CapabilityGrid` consumes `siteContent.capabilities`.
- Produces section IDs `system` and `capabilities`.

- [ ] **Step 1: Write failing section tests**

```tsx
// WorkflowProof.test.tsx
render(<WorkflowProof />);
expect(screen.getByRole('heading', { name: 'TOOLS INTO SYSTEMS.' })).toBeInTheDocument();
expect(screen.getByAltText('ComfyUI 工作流界面')).toHaveAttribute(
  'src',
  '/media/workflow/comfyui-workflow.webp',
);
expect(screen.queryByText(/制作步骤|节点教程/)).not.toBeInTheDocument();
```

```tsx
// CapabilityGrid.test.tsx
render(<CapabilityGrid />);
expect(screen.getAllByRole('article')).toHaveLength(3);
expect(screen.getByText('AI 内容与自动化')).toBeInTheDocument();
expect(screen.getByText('视频编导与剪辑')).toBeInTheDocument();
expect(screen.getByText('电商内容转化')).toBeInTheDocument();
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```powershell
npm.cmd exec vitest run src/features/workflow/WorkflowProof.test.tsx src/features/capabilities/CapabilityGrid.test.tsx
```

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement `WorkflowProof`**

Render only the approved heading, one-sentence proof, three tags, and the screenshot. Add decorative DOM nodes with `aria-hidden="true"` around the screenshot. Use ScrollTrigger to add an `isActive` class as the section enters; CSS transitions the node borders and lines from muted gray to fluorescent green. Do not annotate internal ComfyUI nodes.

```tsx
<section id="system" aria-labelledby="workflow-title">
  <div>
    <p>{siteContent.workflow.eyebrow}</p>
    <h2 id="workflow-title">{siteContent.workflow.title}</h2>
    <p>{siteContent.workflow.summary}</p>
    <ul aria-label="工作流工具">
      {siteContent.workflow.tags.map((tag) => <li key={tag}>{tag}</li>)}
    </ul>
  </div>
  <figure>
    <img src="/media/workflow/comfyui-workflow.webp" alt="ComfyUI 工作流界面" />
    <div aria-hidden="true" className={styles.decorativeNodes} />
  </figure>
</section>
```

- [ ] **Step 4: Implement `CapabilityGrid`**

Each capability is an `<article>` with index, title, summary, and a hidden tool list. Desktop reveals tools on `:hover` and `:focus-within`; touch users use a button with `aria-expanded`. Only one mobile card may be expanded at a time.

```tsx
const [expanded, setExpanded] = useState<Capability['id'] | null>(null);

return (
  <section id="capabilities" aria-labelledby="capabilities-title">
    <h2 id="capabilities-title">THREE THINGS I DO WELL.</h2>
    <div className={styles.grid}>
      {siteContent.capabilities.map((capability) => {
        const open = expanded === capability.id;
        return (
          <article key={capability.id}>
            <span>{capability.index}</span>
            <h3>{capability.title}</h3>
            <p>{capability.summary}</p>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`tools-${capability.id}`}
              onClick={() => setExpanded(open ? null : capability.id)}
            >
              {open ? '收起工具' : '查看工具'}
            </button>
            <ul id={`tools-${capability.id}`} hidden={!open}>
              {capability.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </article>
        );
      })}
    </div>
  </section>
);
```

- [ ] **Step 5: Add responsive styling and mount both sections**

Desktop:

- Workflow text left, screenshot right.
- Three equal capability columns.

Mobile:

- Workflow text above screenshot.
- One capability column.
- Tap targets at least 44×44 CSS pixels.

Add `<WorkflowProof />` and `<CapabilityGrid />` after `<FeaturedFilm />`.

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm.cmd exec vitest run src/features/workflow/WorkflowProof.test.tsx src/features/capabilities/CapabilityGrid.test.tsx
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 7: Commit workflow and capabilities**

```powershell
git add src/features/workflow src/features/capabilities src/App.tsx
git commit -m "feat: add workflow proof and capability grid"
```

---

### Task 8: Contact Actions and Graceful Clipboard Fallback

**Files:**
- Create: `src/features/contact/ContactSection.tsx`
- Create: `src/features/contact/ContactSection.module.css`
- Test: `src/features/contact/ContactSection.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `siteContent.contact`.
- Produces: section id `contact`, `mailto:` link, `tel:` link, and copy actions.

- [ ] **Step 1: Write failing contact tests**

```tsx
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  it('renders direct contact actions without résumé download or work years', () => {
    render(<ContactSection />);
    expect(screen.getByRole('link', { name: /1282736393@qq.com/ })).toHaveAttribute(
      'href',
      'mailto:1282736393@qq.com',
    );
    expect(screen.getByRole('link', { name: /13123986103/ })).toHaveAttribute(
      'href',
      'tel:13123986103',
    );
    expect(screen.queryByText(/下载简历|4年工作经验|4 年工作经验/)).not.toBeInTheDocument();
  });

  it('announces a successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.click(screen.getByRole('button', { name: '复制邮箱' }));
    expect(writeText).toHaveBeenCalledWith('1282736393@qq.com');
    expect(screen.getByRole('status')).toHaveTextContent('邮箱已复制');
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```powershell
npm.cmd exec vitest run src/features/contact/ContactSection.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement contact and copy fallback**

Use `navigator.clipboard.writeText` when available. On rejection:

1. Render a temporary readonly input containing the requested value.
2. Focus and select the input.
3. Set the live-region message to `复制失败，请按 Ctrl+C 手动复制`.

Keep the email and phone visible as normal links regardless of copy state. Do not render a résumé button.

```tsx
const [status, setStatus] = useState('');
const fallbackInputRef = useRef<HTMLInputElement>(null);

const copy = async (label: '邮箱' | '电话', value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    setStatus(`${label}已复制`);
  } catch {
    const input = fallbackInputRef.current;
    if (input) {
      input.value = value;
      input.hidden = false;
      input.focus();
      input.select();
    }
    setStatus('复制失败，请按 Ctrl+C 手动复制');
  }
};

return (
  <section id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">LET&apos;S BUILD SOMETHING.</h2>
    <p>{siteContent.contact.name} · {siteContent.contact.city}</p>
    <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a>
    <button type="button" onClick={() => copy('邮箱', siteContent.contact.email)}>复制邮箱</button>
    <a href={`tel:${siteContent.contact.phone}`}>{siteContent.contact.phone}</a>
    <button type="button" onClick={() => copy('电话', siteContent.contact.phone)}>复制电话</button>
    <input ref={fallbackInputRef} readOnly hidden aria-label="手动复制联系方式" />
    <p role="status" aria-live="polite">{status}</p>
  </section>
);
```

- [ ] **Step 4: Add the fluorescent closing section**

Use a fluorescent green background, black text, large `LET'S BUILD SOMETHING.` heading, and high-contrast outlined contact controls. Add `<ContactSection />` last in `App.tsx`.

- [ ] **Step 5: Run tests and build**

Run:

```powershell
npm.cmd exec vitest run src/features/contact/ContactSection.test.tsx
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 6: Commit contact**

```powershell
git add src/features/contact src/App.tsx
git commit -m "feat: add accessible contact actions"
```

---

### Task 9: Responsive, Accessibility, Performance, and End-to-End Verification

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/site.spec.ts`
- Modify: component CSS modules as required by verified failures
- Modify: `src/App.tsx` only when integration fixes require it

**Interfaces:**
- Consumes: the complete application.
- Produces: repeatable browser verification for the approved requirements.

- [ ] **Step 1: Install Playwright browsers**

Run:

```powershell
npm.cmd exec playwright install chromium
```

Expected: Chromium installation succeeds.

- [ ] **Step 2: Write the failing end-to-end requirements**

```ts
// e2e/site.spec.ts
import { expect, test } from '@playwright/test';

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`renders without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  });
}

test('contains one film, one workflow proof, and no rejected résumé content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'AI PRODUCT FILM' })).toHaveCount(1);
  await expect(page.getByAltText('ComfyUI 工作流界面')).toHaveCount(1);
  await expect(page.getByText(/4年工作经验|4 年工作经验|下载简历/)).toHaveCount(0);
});

test('hero changes canvas frame in both scroll directions', async ({ page }) => {
  await page.goto('/');
  const canvas = page.getByLabel('滚动控制的动画人物');
  await expect(canvas).toBeVisible();
  const before = await canvas.screenshot();
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(250);
  const forward = await canvas.screenshot();
  expect(Buffer.compare(before, forward)).not.toBe(0);
  await page.mouse.wheel(0, -900);
  await page.waitForTimeout(250);
  const backward = await canvas.screenshot();
  expect(Buffer.compare(forward, backward)).not.toBe(0);
});

test('reduced motion uses the poster', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByAltText('瞿先生动画人物')).toBeVisible();
});
```

- [ ] **Step 3: Configure Playwright and run the suite**

`playwright.config.ts` must start `npm.cmd run dev -- --host 127.0.0.1` on port 4173 and use `http://127.0.0.1:4173`.

Run:

```powershell
npm.cmd run e2e
```

Expected: initial failures identify remaining integration or responsive issues.

- [ ] **Step 4: Fix only observed responsive and accessibility failures**

Use these acceptance rules while fixing:

- No element exceeds viewport width at the four required sizes.
- Navigation remains keyboard reachable.
- Every interactive control has a visible focus state.
- Dialog focus returns to its opener.
- Contact controls remain at least 44×44 CSS pixels.
- Mobile retains Canvas scroll control unless reduced-motion or loading fallback applies.
- Static poster remains visible until the first Canvas frame is ready.
- Decorative workflow elements are `aria-hidden`.

- [ ] **Step 5: Run the full verification suite**

Run:

```powershell
npm.cmd run test:run
npm.cmd run build
npm.cmd run e2e
```

Expected: all unit tests and E2E tests pass; the production build succeeds.

- [ ] **Step 6: Run a manual interaction checklist**

At 1440×900 and 390×844:

1. Scroll down and confirm the camera pushes to the head, pulls back to the approved half-body range, shows the turn, and holds.
2. Scroll upward and confirm camera and character motion reverse without jumps.
3. Open and close the film modal by button, overlay, close control, and Escape.
4. Confirm the film preview never starts audio automatically.
5. Expand each capability on touch width.
6. Activate email, phone, and both copy actions.
7. Throttle the network and confirm posters prevent blank media regions.
8. Enable reduced motion and confirm the page remains complete with a static character image.

- [ ] **Step 7: Commit verified integration**

```powershell
git add playwright.config.ts e2e src
git commit -m "test: verify responsive interactive portfolio"
```

---

## Plan Self-Review Result

- Every design-spec section maps to a task: content and scope in Task 1, media in Task 2, hero behavior in Tasks 3–4, navigation in Task 5, film in Task 6, workflow and capabilities in Task 7, contact in Task 8, and responsive/accessibility/error verification in Task 9.
- The approved half-body camera treatment is explicit in global constraints, pure scroll math, component behavior, and E2E verification.
- No task adds a second film, résumé download, work-year label, backend, or unapproved content.
- Public interfaces and names are consistent across tasks.
