# Recruiter-Focused Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the existing portfolio so a recruiter can understand the AIGC content-production direction, tool combinations, three truthful projects, and workflow-design ability within 10–20 seconds without losing the current visual identity or interactions.

**Architecture:** Keep the existing React/Vite single-page anchor architecture and data-driven `siteContent` model. Add focused About, project-index, reusable case-study, media-gallery, and workflow-status components; upgrade the existing film, workflow, capability, loader, navigation, and noscript surfaces in place. Preserve the existing palette, GSAP portrait sequence, pointer intro, modal film player, card flips, and GitHub Pages base-path handling.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, GSAP/ScrollTrigger 3.15, CSS Modules, Vitest 4, Testing Library, FFmpeg for one-time evidence-image preparation.

**Spec:** `docs/superpowers/specs/2026-08-20-recruiter-focused-portfolio-redesign-design.md`

## Global Constraints

- Work only in the existing `feat/cinematic-portfolio-redesign` worktree; do not create a replacement website.
- Preserve the existing six-color palette exactly: `#e7ebdd`, `#07160f`, `#123326`, `#b7ff2a`, `#89958a`, `#f3f1e8`.
- Preserve the current fonts, pointer-follow intro, maximum approximately 20° title tilt, GSAP portrait scroll, film dialog, skill-card flip, contact behavior, and reduced-motion fallbacks.
- Site order must be Loader → Pointer Intro → Hero → About → Selected Work → Project 01 → Project 02 → Project 03 → Skills → Contact.
- Navigation must be `HOME / ABOUT / WORK / SKILLS / CONTACT` and remain a single-page anchor system.
- Do not display `n8n` anywhere in production content or generated HTML.
- Project 01 and Project 02 must explicitly share one video; never imply that they are two different finished films.
- Project 03 must label practiced stages `COMPLETED`, FFmpeg orchestration `EXPERIMENTAL`, and API/batch/stable automation `PLANNED`.
- Do not invent efficiency, conversion, GMV, view, time-saved, or completion figures.
- Keep `vite.config.ts` exactly compatible with `base: "/yu-ai-portfolio/"`.
- Keep Desktop, Mobile, keyboard, 200% zoom, and `prefers-reduced-motion` usable.
- Use TDD for each task and commit only after its focused tests pass.

## File Structure

### Content and shared presentation

- Modify `src/content/siteContent.ts`: define recruiter-facing copy, project types, three case studies, workflow statuses, and four skill groups.
- Modify `src/content/siteContent.test.ts`: lock truthful copy, statuses, shared-evidence disclosure, and removal of `n8n`.
- Create `src/features/about/AboutSection.tsx` and `.module.css`: short About statement, practice areas, and target roles.
- Create `src/features/about/AboutSection.test.tsx`: About semantics and copy.
- Create `src/features/projects/ProjectIndex.tsx` and `.module.css`: three-item Selected Work index.
- Create `src/features/projects/ProjectIndex.test.tsx`: status, tags, and case-study anchors.
- Create `src/features/projects/ProjectCaseStudy.tsx` and `.module.css`: shared Problem/Solution/Tools/Role/Result structure.
- Create `src/features/projects/ProjectCaseStudy.test.tsx`: common information hierarchy and bilingual labels.
- Create `src/features/projects/ProjectMediaGallery.tsx` and `.module.css`: lazy evidence images, lightbox, image fallbacks, keyboard behavior.
- Create `src/features/projects/ProjectMediaGallery.test.tsx`: lazy media, dialog, focus restoration, and error fallback.
- Create `src/features/projects/ProjectFlow.tsx` and `.module.css`: Project 03 ordered workflow and truthful status groups.
- Create `src/features/projects/ProjectFlow.test.tsx`: order and status semantics.

### Existing features upgraded in place

- Modify `src/features/intro/PointerIntro.tsx`, `.module.css`, and `.test.tsx`: recruiter-facing bilingual annotation while preserving motion.
- Modify `src/features/hero/HeroScrollSequence.tsx`, `.module.css`, and `.test.tsx`: persistent positioning statement, keywords, and four new stage copies.
- Modify `src/features/film/FeaturedFilm.tsx`, `.module.css`, and `.test.tsx`: Project 01 case study wrapped around the existing player.
- Modify `src/features/workflow/WorkflowProof.tsx`, `.module.css`, and `.test.tsx`: Project 02 case study, evidence gallery, and shared-output anchor.
- Modify `src/features/capabilities/CapabilityGrid.tsx`, `.module.css`, and `.test.tsx`: three core skill groups plus low-priority engineering supplement.
- Modify `src/features/loader/PortfolioLoader.tsx`, `loadPortfolio.ts`, and their tests: unblock entry after fonts/poster/key frames and continue full sequence in the existing cache.
- Modify `src/features/navigation/Navigation.tsx`, `.module.css`, and `.test.tsx`: five recruiter-oriented anchors.
- Modify `src/App.tsx`, `src/App.test.tsx`, and `src/App.integration.test.tsx`: assemble and verify the new section order.
- Modify `src/styles/global.css`: retain tokens and add shared section spacing/focus behavior only if needed.
- Modify `index.html`: update title, description, and truthful noscript project overview.

### Media

- Modify `src/lib/media.ts` and `src/lib/media.test.ts`: typed Project 02 evidence manifest entries and base-safe resolution.
- Modify `public/media/media-manifest.json`: add Project 02 evidence paths while preserving portrait and film paths.
- Create `public/media/projects/project-02/comfyui-continuity-workflow.webp`: cropped ComfyUI continuity workflow.
- Create `public/media/projects/project-02/scene-development.webp`: cropped Seedance scene-development record.
- Create `public/media/projects/project-02/continuity-generation.webp`: cropped Seedance continuity-generation record.

---

### Task 1: Recruiter-Facing Content Model

**Files:**
- Modify: `src/content/siteContent.ts`
- Modify: `src/content/siteContent.test.ts`

**Interfaces:**
- Produces: `ProjectId`, `ProjectStatus`, `WorkflowStageStatus`, `ProjectContent`, `SkillGroup`, and `siteContent.about/projects/contentWorkflow/skillGroups`.
- Consumed by: all About, project, hero, skill, navigation, and noscript-facing tasks.

- [ ] **Step 1: Replace the old content assertions with failing recruiter-content tests**

```ts
it('defines the recruiter-facing direction and five anchors', () => {
  expect(siteContent.intro.annotation).toBe('AIGC CONTENT PRODUCTION / AI WORKFLOW');
  expect(siteContent.intro.annotationZh).toBe('AIGC 内容生产 · AI 工作流 · 自动化应用');
  expect(siteContent.navigation.map(({ id }) => id)).toEqual([
    'home', 'about', 'work', 'skills', 'contact',
  ]);
  expect(siteContent.hero.keywords).toEqual([
    'AI VIDEO', 'COMFYUI', 'AI WORKFLOW', 'AUTOMATION', 'AI IMAGE', 'PYTHON / API',
  ]);
});

it('defines three truthful case studies and shared evidence', () => {
  expect(siteContent.projects.map(({ id, status }) => ({ id, status }))).toEqual([
    { id: 'project-01', status: 'COMPLETED' },
    { id: 'project-02', status: 'COMPLETED' },
    { id: 'project-03', status: 'IN DEVELOPMENT' },
  ]);
  expect(siteContent.projects[1].sharedOutput).toEqual({
    label: 'APPLIED OUTPUT · SHARED WITH PROJECT 01',
    href: '#project-01-media',
  });
});

it('keeps automation claims truthful and removes n8n', () => {
  const serialized = JSON.stringify(siteContent);
  expect(serialized).not.toMatch(/n8n/i);
  expect(siteContent.contentWorkflow.experimental).toContain(
    '使用 FFmpeg 尝试素材处理和流程串联，尚未达到稳定、可复用的自动化生产状态。',
  );
  expect(siteContent.contentWorkflow.planned).toEqual([
    'API 接入', '批量任务', '稳定的端到端自动化输出', '可复用的内容生产模板',
  ]);
});
```

- [ ] **Step 2: Run the content tests and verify failure**

Run: `npm run test:run -- src/content/siteContent.test.ts`

Expected: FAIL because `annotationZh`, `projects`, `contentWorkflow`, and the five-anchor `SectionId` do not exist and old content still contains `n8n`.

- [ ] **Step 3: Add the exact shared types and top-level content fields**

```ts
export type SectionId = 'home' | 'about' | 'work' | 'skills' | 'contact';
export type ProjectId = 'project-01' | 'project-02' | 'project-03';
export type ProjectStatus = 'COMPLETED' | 'IN DEVELOPMENT';
export type WorkflowStageStatus = 'COMPLETED' | 'EXPERIMENTAL' | 'PLANNED';

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
```

Add the exact approved intro, hero, About, three projects, Project 03 statuses, and four skill groups from the design spec. Project 02 tools must be `ComfyUI · MiniMax H3 · Seedance · AI Image · AI Video · LLM · Video Editing`; the Automation skill group must include `Python`, `API`, `Codex`, `FFmpeg`, and `Workflow Design` but must describe FFmpeg as experimental.

- [ ] **Step 4: Run the content tests and scan production source for rejected claims**

Run: `npm run test:run -- src/content/siteContent.test.ts`

Expected: PASS.

Run: `Get-ChildItem src,index.html -Recurse -File | Select-String -Pattern 'n8n|4年工作经验|下载简历' -CaseSensitive:$false`

Expected: no production-content matches. Test fixtures may still be updated in later tasks, but no `src/**/*.tsx`, `src/content/siteContent.ts`, or `index.html` match is allowed.

- [ ] **Step 5: Commit the content foundation**

```powershell
git add src/content/siteContent.ts src/content/siteContent.test.ts
git commit -m "feat: define recruiter-focused portfolio content"
```

### Task 2: Project Evidence Assets and Base-Safe Manifest

**Files:**
- Create: `public/media/projects/project-02/comfyui-continuity-workflow.webp`
- Create: `public/media/projects/project-02/scene-development.webp`
- Create: `public/media/projects/project-02/continuity-generation.webp`
- Modify: `public/media/media-manifest.json`
- Modify: `scripts/prepare-assets.mjs`
- Modify: `src/lib/media.ts`
- Modify: `src/lib/media.test.ts`

**Interfaces:**
- Produces: `MediaManifest.projects.project02.workflow`, `.sceneDevelopment`, and `.continuityGeneration`, each `{ src, alt }` after resolution.
- Consumed by: `WorkflowProof` and `ProjectMediaGallery`.

- [ ] **Step 1: Write a failing manifest-resolution test**

```ts
expect(await loadMediaManifest()).toMatchObject({
  projects: {
    project02: {
      workflow: {
        src: `${base}media/projects/project-02/comfyui-continuity-workflow.webp`,
        alt: 'ComfyUI 连续镜头工作流界面',
      },
      sceneDevelopment: {
        src: `${base}media/projects/project-02/scene-development.webp`,
        alt: 'Seedance 场景参考与画面开发记录',
      },
      continuityGeneration: {
        src: `${base}media/projects/project-02/continuity-generation.webp`,
        alt: 'Seedance 连续镜头生成记录',
      },
    },
  },
});
```

- [ ] **Step 2: Run the media test and verify failure**

Run: `npm run test:run -- src/lib/media.test.ts`

Expected: FAIL because `projects.project02` is not defined or resolved.

- [ ] **Step 3: Crop the three supplied evidence screenshots without retaining irrelevant UI**

Run these commands from the worktree after confirming each source image exists:

```powershell
New-Item -ItemType Directory -Force -Path 'public/media/projects/project-02' | Out-Null
ffmpeg -y -i 'C:/Users/qxy12/AppData/Local/Temp/codex-clipboard-b80aee07-1df4-4c33-8c0f-3260f45e0744.png' -vf "crop=1768:1640:728:116,scale=1600:-2:flags=lanczos" -c:v libwebp -quality 82 'public/media/projects/project-02/comfyui-continuity-workflow.webp'
ffmpeg -y -i 'C:/Users/qxy12/AppData/Local/Temp/codex-clipboard-1c0af7e2-5f5f-4ee0-a600-4af649e223ea.png' -vf "crop=1420:1530:240:150,scale=1400:-2:flags=lanczos" -c:v libwebp -quality 82 'public/media/projects/project-02/scene-development.webp'
ffmpeg -y -i 'C:/Users/qxy12/AppData/Local/Temp/codex-clipboard-60017073-6012-4576-8b2c-f61e74ae7479.png' -vf "crop=1320:1650:300:120,scale=1400:-2:flags=lanczos" -c:v libwebp -quality 82 'public/media/projects/project-02/continuity-generation.webp'
```

Inspect all three with the image viewer before proceeding. The ComfyUI image must exclude the right-side failure queue and unrelated left media library. If the fixed crop leaves either visible, adjust only the crop rectangle and regenerate before committing.

- [ ] **Step 4: Extend and resolve the typed manifest**

```ts
export interface MediaEvidence {
  src: string;
  alt: string;
}

export interface MediaManifest {
  // existing portrait and film stay unchanged
  workflow: { src: string };
  projects: {
    project02: {
      workflow: MediaEvidence;
      sceneDevelopment: MediaEvidence;
      continuityGeneration: MediaEvidence;
    };
  };
}

const resolveEvidence = (item: MediaEvidence): MediaEvidence => ({
  ...item,
  src: resolveMediaUrl(item.src),
});
```

Keep the current `workflow` entry for compatibility but point it to the new cropped ComfyUI image. Add and resolve the three `projects.project02` entries in `public/media/media-manifest.json`, `scripts/prepare-assets.mjs`, and `resolveManifest` so a future portrait/film asset rebuild cannot erase the Project 02 evidence manifest.

Add this object to the manifest written by `prepareAssets`:

```js
projects: {
  project02: {
    workflow: {
      src: 'media/projects/project-02/comfyui-continuity-workflow.webp',
      alt: 'ComfyUI 连续镜头工作流界面',
    },
    sceneDevelopment: {
      src: 'media/projects/project-02/scene-development.webp',
      alt: 'Seedance 场景参考与画面开发记录',
    },
    continuityGeneration: {
      src: 'media/projects/project-02/continuity-generation.webp',
      alt: 'Seedance 连续镜头生成记录',
    },
  },
},
```

- [ ] **Step 5: Verify files, resolution, and size**

Run: `npm run test:run -- src/lib/media.test.ts`

Expected: PASS.

Run: `Get-ChildItem public/media/projects/project-02/*.webp | Select-Object Name,Length`

Expected: three non-empty WebP files; each should remain below 1.5 MB. If any exceeds the limit, regenerate at quality 76 before committing.

- [ ] **Step 6: Commit the evidence assets and manifest**

```powershell
git add public/media/projects/project-02 public/media/media-manifest.json scripts/prepare-assets.mjs src/lib/media.ts src/lib/media.test.ts
git commit -m "feat: add project continuity evidence"
```

### Task 3: Intro and Hero Recruiter Positioning

**Files:**
- Modify: `src/features/intro/PointerIntro.tsx`
- Modify: `src/features/intro/PointerIntro.module.css`
- Modify: `src/features/intro/PointerIntro.test.tsx`
- Modify: `src/features/hero/HeroScrollSequence.tsx`
- Modify: `src/features/hero/HeroScrollSequence.module.css`
- Modify: `src/features/hero/HeroScrollSequence.test.tsx`

**Interfaces:**
- Consumes: `siteContent.intro.annotationZh`, `siteContent.hero.positioning`, `siteContent.hero.keywords`, and four `HeroStage` values.
- Produces: unchanged `#home` and hero section behavior, with `#profile` retained as an internal section ID but no longer exposed in navigation.

- [ ] **Step 1: Write failing intro and hero tests for the new bilingual positioning**

```tsx
expect(screen.getByText('AIGC CONTENT PRODUCTION / AI WORKFLOW')).toBeInTheDocument();
expect(screen.getByText('AIGC 内容生产 · AI 工作流 · 自动化应用')).toBeInTheDocument();
expect(screen.getByText(/使用 ComfyUI、AI 图像与视频模型/)).toBeInTheDocument();
expect(screen.getByRole('list', { name: '核心能力关键词' })).toHaveTextContent(
  'AI VIDEOCOMFYUIAI WORKFLOWAUTOMATIONAI IMAGEPYTHON / API',
);
expect(screen.getByRole('heading', { name: 'UNDERSTAND THE BRIEF.' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'CONNECT THE WORKFLOW.' })).toBeInTheDocument();
```

Retain the existing tests for pointer-follow math, the approximately 20° cap, four hero phases, frame drawing, static fallback, and reduced motion.

- [ ] **Step 2: Run focused tests and verify copy failures without motion regressions**

Run: `npm run test:run -- src/features/intro/PointerIntro.test.tsx src/features/hero/HeroScrollSequence.test.tsx src/features/intro/introMath.test.ts src/features/hero/heroMath.test.ts`

Expected: new copy assertions FAIL; existing math assertions remain PASS.

- [ ] **Step 3: Render bilingual intro annotation without changing pointer mechanics**

```tsx
<div className={styles.annotationGroup}>
  <p className={styles.annotation}>{siteContent.intro.annotation}</p>
  <p className={styles.annotationZh}>{siteContent.intro.annotationZh}</p>
</div>
```

Add only typography and spacing rules for `.annotationGroup` and `.annotationZh`. Do not change `getIntroTransform`, pointer capture, CSS custom properties, circle positioning, mask behavior, or the maximum rotation input of `20`.

- [ ] **Step 4: Add persistent hero positioning and keyword list around the existing stage viewport**

```tsx
<p className={styles.positioning}>{siteContent.hero.positioning}</p>
<ul className={styles.keywords} aria-label="核心能力关键词">
  {siteContent.hero.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
</ul>
```

Keep `siteContent.hero.stages.map(...)`, `getHeroStageIndex`, `ScrollTrigger`, canvas loading, poster fallback, and progress rail unchanged. Use the new four stage titles and Chinese translations from Task 1.

- [ ] **Step 5: Add responsive and reduced-motion styling**

```css
.positioning { max-width: 38rem; color: var(--ivory); line-height: 1.65; }
.keywords { display: flex; flex-wrap: wrap; gap: .5rem 1rem; }
.keywords li { color: var(--acid); font-size: .75rem; letter-spacing: .12em; }

@media (max-width: 767px) {
  .positioning { max-width: 30rem; font-size: .95rem; }
  .keywords { gap: .4rem .7rem; }
}
```

Use existing module tokens and spacing conventions; do not add new colors.

- [ ] **Step 6: Run focused tests and commit**

Run: `npm run test:run -- src/features/intro src/features/hero`

Expected: PASS.

```powershell
git add src/features/intro src/features/hero
git commit -m "feat: clarify AIGC role in intro and hero"
```

### Task 4: About and Selected Work Index

**Files:**
- Create: `src/features/about/AboutSection.tsx`
- Create: `src/features/about/AboutSection.module.css`
- Create: `src/features/about/AboutSection.test.tsx`
- Create: `src/features/projects/ProjectIndex.tsx`
- Create: `src/features/projects/ProjectIndex.module.css`
- Create: `src/features/projects/ProjectIndex.test.tsx`

**Interfaces:**
- Consumes: `siteContent.about` and `siteContent.projects`.
- Produces: top-level `#about` and `#work` sections; Project Index links `#project-01`, `#project-02`, `#project-03`.

- [ ] **Step 1: Write failing About tests**

```tsx
render(<AboutSection />);
expect(screen.getByRole('heading', { name: 'ABOUT' })).toBeInTheDocument();
expect(screen.getByText(/我关注的不是单次生成图片或视频/)).toBeInTheDocument();
expect(screen.getByRole('list', { name: '主要实践方向' })).toHaveTextContent('AI 图像生成');
expect(screen.getByText('AIGC / AI 内容生产 / AI 工作流 / AI 应用')).toBeInTheDocument();
```

- [ ] **Step 2: Write failing Project Index tests**

```tsx
render(<ProjectIndex />);
expect(screen.getByRole('heading', { name: 'SELECTED WORK' })).toBeInTheDocument();
expect(screen.getAllByRole('article')).toHaveLength(3);
expect(screen.getByRole('link', { name: /AI PRODUCT FILM.*VIEW CASE STUDY/i }))
  .toHaveAttribute('href', '#project-01');
expect(screen.getByRole('link', { name: /AI SHORT FILM WORKFLOW.*VIEW CASE STUDY/i }))
  .toHaveAttribute('href', '#project-02');
expect(screen.getByText('IN DEVELOPMENT')).toBeInTheDocument();
```

- [ ] **Step 3: Run both new tests and verify missing-module failures**

Run: `npm run test:run -- src/features/about/AboutSection.test.tsx src/features/projects/ProjectIndex.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 4: Implement the semantic About module**

```tsx
export function AboutSection() {
  const { about } = siteContent;
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <p className={styles.eyebrow}>ABOUT / 关于我</p>
      <h2 id="about-title">ABOUT</h2>
      <p className={styles.statement}>{about.statement}</p>
      <ul aria-label="主要实践方向" className={styles.practiceList}>
        {about.practiceAreas.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <p className={styles.directionLabel}>TARGET DIRECTION / 求职方向</p>
      <p className={styles.direction}>{about.targetDirection}</p>
    </section>
  );
}
```

- [ ] **Step 5: Implement the three-item editorial Project Index**

```tsx
export function ProjectIndex() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <p className={styles.eyebrow}>WORK / 项目案例</p>
      <h2 id="work-title">SELECTED WORK</h2>
      <div className={styles.list}>
        {siteContent.projects.map((project) => (
          <article key={project.id} className={styles.item}>
            <span>{project.number}</span>
            <div>
              <p>{project.status}</p>
              <h3>{project.title}<span lang="zh-CN">{project.titleZh}</span></h3>
              <p>{project.summary}</p>
              <ul aria-label={`${project.title} 关键词`}>
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
            <a href={`#${project.id}`} aria-label={`${project.title} · VIEW CASE STUDY`}>
              VIEW CASE STUDY ↘
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Use open editorial rows, oversized type, existing section lines, and restrained hover/focus transitions. Do not turn the index into dashboard cards.

- [ ] **Step 6: Verify responsive tests and commit**

Run: `npm run test:run -- src/features/about/AboutSection.test.tsx src/features/projects/ProjectIndex.test.tsx`

Expected: PASS.

```powershell
git add src/features/about src/features/projects/ProjectIndex.*
git commit -m "feat: add about and selected work index"
```

### Task 5: Shared Case-Study Structure and Project 01

**Files:**
- Create: `src/features/projects/ProjectCaseStudy.tsx`
- Create: `src/features/projects/ProjectCaseStudy.module.css`
- Create: `src/features/projects/ProjectCaseStudy.test.tsx`
- Modify: `src/features/film/FeaturedFilm.tsx`
- Modify: `src/features/film/FeaturedFilm.module.css`
- Modify: `src/features/film/FeaturedFilm.test.tsx`

**Interfaces:**
- Consumes: one `ProjectContent` and optional `children` evidence.
- Produces: reusable `<ProjectCaseStudy project={project}>...</ProjectCaseStudy>` and `#project-01-media` around the existing player.

- [ ] **Step 1: Write a failing reusable-structure test**

```tsx
render(<ProjectCaseStudy project={siteContent.projects[0]}><div>evidence</div></ProjectCaseStudy>);
expect(screen.getByRole('heading', { name: /AI PRODUCT FILM/ })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '01 / 问题 Problem' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '02 / 方案 Solution' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '03 / 工具 Tools' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '04 / 我的工作 Role' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '05 / 结果 Result' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '06 / 媒体证据 Evidence' })).toBeInTheDocument();
```

- [ ] **Step 2: Extend Project 01 tests before implementation**

Keep every existing player/dialog/fallback test and add:

```tsx
expect(screen.getByText('COMPLETED')).toBeInTheDocument();
expect(screen.getByText(/AI 视频制作需要在参考素材、Prompt、生成、筛选和后期之间频繁切换/)).toBeInTheDocument();
expect(screen.getByText('产品资料与卖点分析')).toBeInTheDocument();
expect(screen.getByText('后期剪辑与视觉优化')).toBeInTheDocument();
expect(screen.getByTestId('project-01-media')).toHaveAttribute('id', 'project-01-media');
```

- [ ] **Step 3: Run tests and verify structural failures**

Run: `npm run test:run -- src/features/projects/ProjectCaseStudy.test.tsx src/features/film/FeaturedFilm.test.tsx`

Expected: FAIL for missing `ProjectCaseStudy` and Project 01 detail copy; legacy film behavior assertions should identify no unrelated regressions.

- [ ] **Step 4: Implement the common case-study component**

```tsx
import type { ReactNode, Ref } from 'react';

export interface ProjectCaseStudyProps {
  project: ProjectContent;
  children: ReactNode;
  sectionRef?: Ref<HTMLElement>;
  className?: string;
  active?: boolean;
}

const detailBlocks = (project: ProjectContent) => [
  { id: 'problem', heading: '01 / 问题 Problem', content: <p>{project.problem}</p> },
  { id: 'solution', heading: '02 / 方案 Solution', content: <p>{project.solution}</p> },
  {
    id: 'tools',
    heading: '03 / 工具 Tools',
    content: <ul aria-label={`${project.title} 工具`}>{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>,
  },
  { id: 'role', heading: '04 / 我的工作 Role', content: <ul>{project.role.map((item) => <li key={item}>{item}</li>)}</ul> },
  { id: 'result', heading: '05 / 结果 Result', content: <p>{project.result}</p> },
];
```

Render a section with `ref={sectionRef}`, `id={project.id}`, `className={className}`, `data-active={active}`, a bilingual title, status text, summary, five detail blocks, and a final `06 / 媒体证据 Evidence` region containing `children`. Keep status text visible instead of color-only. Optional ref/class/active props allow `WorkflowProof` to retain its existing ScrollTrigger reveal without adding a nested top-level section.

- [ ] **Step 5: Wrap the existing film player as Project 01 evidence**

```tsx
const project = siteContent.projects[0];

return (
  <ProjectCaseStudy project={project}>
    <div id="project-01-media" data-testid="project-01-media">
      {/* move the existing preview, play button, manifest fallback, and dialog here unchanged */}
    </div>
  </ProjectCaseStudy>
);
```

Do not duplicate the video. Preserve the preview intersection threshold `0.55`, metadata preload, muted/loop/playsInline flags, dialog focus trap, Escape/overlay close, reset-to-zero behavior, and direct-link fallback.

Update legacy test selectors from `#film video` to `#project-01 video`; keep every behavior assertion otherwise unchanged.

- [ ] **Step 6: Verify Project 01 and commit**

Run: `npm run test:run -- src/features/projects/ProjectCaseStudy.test.tsx src/features/film/FeaturedFilm.test.tsx`

Expected: PASS.

```powershell
git add src/features/projects/ProjectCaseStudy.* src/features/film
git commit -m "feat: turn product film into a recruiter case study"
```

### Task 6: Project 02 Media Gallery, Workflow Proof, and Shared Output

**Files:**
- Create: `src/features/projects/ProjectMediaGallery.tsx`
- Create: `src/features/projects/ProjectMediaGallery.module.css`
- Create: `src/features/projects/ProjectMediaGallery.test.tsx`
- Modify: `src/features/workflow/WorkflowProof.tsx`
- Modify: `src/features/workflow/WorkflowProof.module.css`
- Modify: `src/features/workflow/WorkflowProof.test.tsx`

**Interfaces:**
- Consumes: `MediaEvidence[]`, Project 02 content, and `project.sharedOutput`.
- Produces: lazy evidence thumbnails, an accessible image dialog, visible evidence explanations, and link `#project-01-media`.

- [ ] **Step 1: Write failing media-gallery interaction tests**

```tsx
render(<ProjectMediaGallery items={items} />);
const images = screen.getAllByRole('img');
images.forEach((image) => expect(image).toHaveAttribute('loading', 'lazy'));
await user.click(screen.getByRole('button', { name: /放大 ComfyUI 连续镜头工作流界面/ }));
expect(screen.getByRole('dialog', { name: 'ComfyUI 连续镜头工作流界面' })).toBeInTheDocument();
await user.keyboard('{Escape}');
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
expect(screen.getByRole('button', { name: /放大 ComfyUI/ })).toHaveFocus();
```

Add an error test that fires `error` on a thumbnail and expects `role="status"` plus the media label instead of an empty frame.

- [ ] **Step 2: Replace old workflow-only expectations with Project 02 evidence assertions**

```tsx
expect(screen.getByRole('heading', { name: /AI SHORT FILM WORKFLOW/ })).toBeInTheDocument();
expect(screen.getByText('COMPLETED')).toBeInTheDocument();
expect(screen.getByText(/人物变化、服装漂移、场景结构变化和动作不受控/)).toBeInTheDocument();
expect(screen.getByText('MiniMax H3')).toBeInTheDocument();
expect(screen.getByRole('link', { name: 'APPLIED OUTPUT · SHARED WITH PROJECT 01' }))
  .toHaveAttribute('href', '#project-01-media');
expect(screen.getAllByRole('img')).toHaveLength(3);
expect(screen.queryByText(/失败|任务队列/)).not.toBeInTheDocument();
```

- [ ] **Step 3: Run tests and verify failure**

Run: `npm run test:run -- src/features/projects/ProjectMediaGallery.test.tsx src/features/workflow/WorkflowProof.test.tsx`

Expected: FAIL because the gallery and Project 02 case structure do not exist.

- [ ] **Step 4: Implement accessible lazy evidence media**

```tsx
export interface ProjectMediaGalleryProps { items: readonly MediaEvidence[]; }

export function ProjectMediaGallery({ items }: ProjectMediaGalleryProps) {
  const [active, setActive] = useState<MediaEvidence | null>(null);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setActive(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const open = (item: MediaEvidence, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(item);
  };

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === 'Tab' && document.activeElement === closeRef.current) {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);
}
```

Each thumbnail must include a short visible caption explaining what it proves: continuity controls, reference/scene development, or generation iteration. Use `<button>` wrappers, exact `alt`, `loading="lazy"`, `decoding="async"`, and fallback text keyed by `item.src`.

- [ ] **Step 5: Rebuild WorkflowProof as Project 02 without changing its reveal behavior**

```tsx
const project = siteContent.projects[1];
const fallbackEvidence: readonly MediaEvidence[] = [
  {
    src: resolveMediaUrl('media/projects/project-02/comfyui-continuity-workflow.webp'),
    alt: 'ComfyUI 连续镜头工作流界面',
  },
  {
    src: resolveMediaUrl('media/projects/project-02/scene-development.webp'),
    alt: 'Seedance 场景参考与画面开发记录',
  },
  {
    src: resolveMediaUrl('media/projects/project-02/continuity-generation.webp'),
    alt: 'Seedance 连续镜头生成记录',
  },
];
const evidence = manifest ? [
  manifest.projects.project02.workflow,
  manifest.projects.project02.sceneDevelopment,
  manifest.projects.project02.continuityGeneration,
] : fallbackEvidence;

return (
  <ProjectCaseStudy
    project={project}
    sectionRef={sectionRef}
    className={`${styles.section} ${active ? styles.active : ''}`}
    active={active}
  >
    <ProjectMediaGallery items={evidence} />
    <a className={styles.sharedOutput} href={project.sharedOutput?.href}>
      {project.sharedOutput?.label}
    </a>
  </ProjectCaseStudy>
);
```

Keep the existing ScrollTrigger reveal and reduced-motion no-animation behavior. Update the reveal test selector from `#system` to `#project-02`. Do not render a second video player.

- [ ] **Step 6: Run focused workflow/gallery tests and commit**

Run: `npm run test:run -- src/features/projects/ProjectMediaGallery.test.tsx src/features/workflow/WorkflowProof.test.tsx`

Expected: PASS.

```powershell
git add src/features/projects/ProjectMediaGallery.* src/features/workflow
git commit -m "feat: add truthful short-film workflow evidence"
```

### Task 7: Project 03 Development Workflow

**Files:**
- Create: `src/features/projects/ProjectFlow.tsx`
- Create: `src/features/projects/ProjectFlow.module.css`
- Create: `src/features/projects/ProjectFlow.test.tsx`

**Interfaces:**
- Consumes: `siteContent.projects[2]` and `siteContent.contentWorkflow`.
- Produces: `#project-03`, ordered semantic workflow, and textual Completed/Experimental/Planned groups.

- [ ] **Step 1: Write failing status and order tests**

```tsx
render(<ProjectFlow />);
expect(screen.getByRole('heading', { name: /AI CONTENT WORKFLOW/ })).toBeInTheDocument();
expect(screen.getByText('IN DEVELOPMENT')).toBeInTheDocument();
expect(screen.getByRole('list', { name: 'AI 内容生产流程' })).toHaveTextContent(
  'Product InputAI AnalysisContent StrategyScriptStoryboardAI ImageAI VideoEditingOutput',
);
expect(screen.getByRole('heading', { name: 'COMPLETED / 已实践' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'EXPERIMENTAL / 实验中' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'PLANNED / 计划中' })).toBeInTheDocument();
expect(screen.getByText(/FFmpeg.*尚未达到稳定、可复用/)).toBeInTheDocument();
expect(screen.getByText('API 接入')).toBeInTheDocument();
```

- [ ] **Step 2: Run the new test and verify missing-component failure**

Run: `npm run test:run -- src/features/projects/ProjectFlow.test.tsx`

Expected: FAIL because `ProjectFlow` does not exist.

- [ ] **Step 3: Implement semantic process and status groups**

```tsx
const statusGroups = [
  { key: 'completed', heading: 'COMPLETED / 已实践', items: contentWorkflow.completed },
  { key: 'experimental', heading: 'EXPERIMENTAL / 实验中', items: contentWorkflow.experimental },
  { key: 'planned', heading: 'PLANNED / 计划中', items: contentWorkflow.planned },
] as const;

<ol className={styles.process} aria-label="AI 内容生产流程">
  {contentWorkflow.steps.map((step) => <li key={step}>{step}</li>)}
</ol>
```

Wrap the process and status groups in `ProjectCaseStudy` using Project 03. The visualization must be a readable ordered flow, not a fake dashboard or invented node editor.

- [ ] **Step 4: Add responsive flow styling and reduced-motion behavior**

On desktop, allow the ordered steps to form a horizontal/stepped path with CSS arrows. At `max-width: 767px`, use a single vertical list. Status group color may reinforce meaning but every status must remain explicit text.

```css
.process { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 767px) { .process { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .process li { transition: none; transform: none; } }
```

- [ ] **Step 5: Verify and commit Project 03**

Run: `npm run test:run -- src/features/projects/ProjectFlow.test.tsx`

Expected: PASS.

```powershell
git add src/features/projects/ProjectFlow.*
git commit -m "feat: show content workflow development status"
```

### Task 8: Skills as Tool Combinations

**Files:**
- Modify: `src/features/capabilities/CapabilityGrid.tsx`
- Modify: `src/features/capabilities/CapabilityGrid.module.css`
- Modify: `src/features/capabilities/CapabilityGrid.test.tsx`

**Interfaces:**
- Consumes: `SkillGroup` and `siteContent.skillGroups`.
- Produces: `#skills`, three core flip cards, one lower-weight engineering supplement, and the existing independent flip state.

- [ ] **Step 1: Replace the six-software-card test with failing grouped-skill tests**

```tsx
render(<CapabilityGrid />);
expect(screen.getByRole('heading', { name: 'TOOLS I COMBINE.' })).toBeInTheDocument();
expect(screen.getAllByRole('article')).toHaveLength(4);
expect(screen.getByRole('heading', { name: 'AI / AIGC' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'AUTOMATION / 自动化' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'CONTENT / DESIGN' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'OTHER ENGINEERING / 工程补充' })).toBeInTheDocument();
expect(screen.getByText('FFmpeg')).toBeInTheDocument();
expect(screen.getByText(/实验/)).toBeInTheDocument();
expect(screen.queryByText(/n8n/i)).not.toBeInTheDocument();
```

Keep existing tests for multiple simultaneous flips, Enter/Space toggling, `aria-pressed`, `aria-describedby`, face visibility, three bilingual growth pairs, no hover flip, and non-3D reduced-motion swaps.

- [ ] **Step 2: Run focused tests and verify content failures**

Run: `npm run test:run -- src/features/capabilities/CapabilityGrid.test.tsx`

Expected: FAIL because the old six-card capabilities and `#capabilities` remain.

- [ ] **Step 3: Change the generic card state to `SkillGroup['id']` and render four groups**

```tsx
const [flippedCards, setFlippedCards] = useState<Set<SkillGroup['id']>>(() => new Set());

<section id="skills" aria-labelledby="skills-title" className={styles.section}>
  <p className={styles.eyebrow}>SKILLS / 工具组合</p>
  <h2 id="skills-title">TOOLS I COMBINE.</h2>
  <p className={styles.intro}>核心不是会多少软件，而是组合不同工具完成 AI 内容生产。</p>
  <div className={styles.grid}>
    {siteContent.skillGroups.map((skill) => renderCard(skill))}
  </div>
</section>
```

Preserve the semantic front/back face structure and full-card button. Add `data-priority={skill.priority}` to each article; use it to reduce the size/contrast of only the engineering supplement without hiding its content.

- [ ] **Step 4: Update the responsive grid without weakening accessibility**

Use three core columns at wide desktop and make the fourth supporting card a full-width compact row below. At tablet use two columns; at mobile use one. Retain 2.75rem minimum control targets, visible focus, back-face sage palette, and existing reduced-motion face swap.

- [ ] **Step 5: Verify skill interactions and commit**

Run: `npm run test:run -- src/features/capabilities/CapabilityGrid.test.tsx`

Expected: PASS.

```powershell
git add src/features/capabilities
git commit -m "feat: organize skills around tool combinations"
```

### Task 9: Loader Critical Path Without Removing the Loader

**Files:**
- Modify: `src/features/loader/PortfolioLoader.tsx`
- Modify: `src/features/loader/PortfolioLoader.test.tsx`
- Modify: `src/features/loader/loadPortfolio.ts`
- Modify: `src/features/loader/loadPortfolio.test.ts`
- Reuse: `src/features/hero/portraitSequenceCache.ts`

**Interfaces:**
- Produces: `loadCriticalAssets(report)` that resolves after manifest, fonts, poster, and the first key frames; starts but does not await `loadPortraitSequenceCached` for the rest.
- Preserves: `loadPortfolio` minimum/maximum timing and `ready | degraded` result.

- [ ] **Step 1: Add a failing test that proves full sequence loading does not block entry**

Refactor `loadDefaultCritical` to an exported `loadCriticalAssets` with injectable helpers:

```ts
export interface CriticalAssetLoaders {
  loadManifest: typeof loadMediaManifest;
  waitForFonts: () => Promise<void>;
  preloadImages: (sources: readonly string[]) => Promise<void>;
  loadKeyFrames: (pattern: string, indices: readonly number[]) => Promise<void>;
  warmSequence: () => Promise<unknown>;
}
```

Test:

```ts
const warmSequence = vi.fn(() => new Promise(() => undefined));
const loaders: CriticalAssetLoaders = {
  loadManifest: vi.fn().mockResolvedValue(manifest),
  waitForFonts: vi.fn().mockResolvedValue(undefined),
  preloadImages: vi.fn().mockResolvedValue(undefined),
  loadKeyFrames: vi.fn().mockResolvedValue(undefined),
  warmSequence,
};
await expect(loadCriticalAssets(report, loaders)).resolves.toBeUndefined();
expect(warmSequence).toHaveBeenCalledTimes(1);
expect(report).toHaveBeenLastCalledWith(4, 4);
```

- [ ] **Step 2: Run loader tests and verify missing-export failure**

Run: `npm run test:run -- src/features/loader`

Expected: FAIL because `loadCriticalAssets` and the critical-loader interface do not exist.

- [ ] **Step 3: Implement key-frame readiness and background warming**

Use key frame indices `[1, Math.ceil(count * 0.34), Math.ceil(count * 0.67), count]`. Preload those URLs directly with the existing `%04d` replacement convention. After fonts and poster succeed, start the existing cached full-sequence loader without awaiting it:

```ts
const frameUrl = (pattern: string, index: number) =>
  pattern.replace('%04d', String(index).padStart(4, '0'));

export async function loadCriticalAssets(
  report: (loaded: number, total: number) => void,
  loaders: CriticalAssetLoaders = defaultCriticalAssetLoaders,
) {
  const manifest = await loaders.loadManifest();
  const sequence = window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;
  const indices = [1, Math.ceil(sequence.count * .34), Math.ceil(sequence.count * .67), sequence.count];

  report(1, 4);
  await loaders.waitForFonts();
  report(2, 4);
  await loaders.preloadImages([manifest.portrait.poster]);
  report(3, 4);
  await loaders.loadKeyFrames(sequence.pattern, indices);
  void loaders.warmSequence().catch(() => undefined);
  report(4, 4);
}

const defaultCriticalAssetLoaders: CriticalAssetLoaders = {
  loadManifest: loadMediaManifest,
  waitForFonts: () => (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
  preloadImages: (sources) => Promise.all(sources.map(preloadImage)).then(() => undefined),
  loadKeyFrames: (pattern, indices) => Promise.all(
    indices.map((index) => preloadImage(frameUrl(pattern, index))),
  ).then(() => undefined),
  warmSequence: async () => {
    const manifest = await loadMediaManifest();
    const sequence = window.innerWidth < 768 ? manifest.portrait.mobile : manifest.portrait.desktop;
    return loadPortraitSequenceCached({
      posterUrl: manifest.portrait.poster,
      pattern: sequence.pattern,
      count: sequence.count,
    });
  },
};

```

Do not warm the film file; leave video loading at `preload="metadata"` inside `FeaturedFilm`. Keep the existing `minimumMs: 1200`, `maximumMs: 6000`, reveal animation, body-scroll lock, and degraded timeout.

- [ ] **Step 4: Add a regression test for fallback behavior**

```ts
it('enters degraded mode when a critical poster or key frame fails', async () => {
  const result = loadPortfolio({
    minimumMs: 0,
    maximumMs: 6000,
    onProgress: vi.fn(),
    loadCritical: () => Promise.reject(new Error('critical image failed')),
  });
  await expect(result).resolves.toBe('degraded');
});
```

- [ ] **Step 5: Verify loader behavior and commit**

Run: `npm run test:run -- src/features/loader src/features/hero/portraitSequenceCache.test.ts`

Expected: PASS.

```powershell
git add src/features/loader
git commit -m "perf: enter portfolio after critical visual assets"
```

### Task 10: Assemble Navigation, Page Order, Noscript, and Full Regression

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.integration.test.tsx`
- Modify: `src/features/navigation/Navigation.tsx`
- Modify: `src/features/navigation/Navigation.module.css`
- Modify: `src/features/navigation/Navigation.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: all components and content from Tasks 1–9.
- Produces: final production page and deployment-ready static fallback.

- [ ] **Step 1: Update App tests for the approved final order**

Mock all new components and assert:

```tsx
expect([...container.querySelectorAll('main > section')].map((section) => section.id)).toEqual([
  'home',
  'profile',
  'about',
  'work',
  'project-01',
  'project-02',
  'project-03',
  'skills',
  'contact',
]);
```

Update the loader/navigation/main wrapper assertion without changing their top-level order.

- [ ] **Step 2: Update navigation and integration assertions before implementation**

```tsx
expect(screen.getAllByRole('link', { name: /HOME|ABOUT|WORK|SKILLS|CONTACT/ })).toHaveLength(5);
expect(container.querySelector('a[href="#about"]')).toBeInTheDocument();
expect(container.querySelector('a[href="#work"]')).toBeInTheDocument();
expect(container.querySelector('a[href="#skills"]')).toBeInTheDocument();
expect(container.querySelector('a[href="#profile"]')).not.toBeInTheDocument();
expect(container.querySelector('a[href="#project-01-media"]')).toHaveTextContent(
  'APPLIED OUTPUT · SHARED WITH PROJECT 01',
);
```

Extend `visualCss` in `App.integration.test.tsx` with these exact imports and keep the exact palette assertion:

```ts
import aboutCss from './features/about/AboutSection.module.css?raw';
import projectIndexCss from './features/projects/ProjectIndex.module.css?raw';
import projectCaseCss from './features/projects/ProjectCaseStudy.module.css?raw';
import projectMediaCss from './features/projects/ProjectMediaGallery.module.css?raw';
import projectFlowCss from './features/projects/ProjectFlow.module.css?raw';

const visualCss = [
  globalCss,
  introCss,
  loaderCss,
  navigationCss,
  heroCss,
  aboutCss,
  projectIndexCss,
  projectCaseCss,
  filmCss,
  projectMediaCss,
  workflowCss,
  projectFlowCss,
  capabilityCss,
  contactCss,
].join('\n');
```

Add exact serialized DOM assertions excluding rejected claims:

```ts
expect(container).not.toHaveTextContent(/n8n|4\s*年工作经验|下载简历/i);
expect(container).not.toHaveTextContent(/效率提升|节省时间|GMV|播放量|转化率\s*\d+%/i);
```

- [ ] **Step 3: Run App/navigation/integration tests and verify order failures**

Run: `npm run test:run -- src/App.test.tsx src/App.integration.test.tsx src/features/navigation/Navigation.test.tsx`

Expected: FAIL for the old component order and six-link navigation.

- [ ] **Step 4: Assemble the final page**

```tsx
<PortfolioLoader />
<Navigation />
<main>
  <PointerIntro />
  <HeroScrollSequence />
  <AboutSection />
  <ProjectIndex />
  <FeaturedFilm />
  <WorkflowProof />
  <ProjectFlow />
  <CapabilityGrid />
  <ContactSection />
</main>
```

Navigation continues to observe only `siteContent.navigation` anchors. The `#profile` and individual project sections remain valid internal scroll targets but are not navigation items.

- [ ] **Step 5: Update metadata and truthful noscript content**

Set:

```html
<title>YU｜AIGC 内容生产与 AI 工作流作品集</title>
<meta name="description" content="AIGC 内容生产、AI 视频、ComfyUI、Python/API 与自动化工作流个人作品集。" />
```

Do not infer a full legal name from `HELLO, I'M YU`; use only the user-approved public name `YU` in metadata.

Noscript must include:

```html
<small>QX / AI LAB · AIGC CONTENT &amp; AI WORKFLOW</small>
<h1>AIGC 内容生产 / AI 工作流</h1>
<p>独立完成产品分析、选题、脚本、分镜、AI 图像、AI 视频与剪辑，并持续尝试 Python、API 与自动化应用。</p>
<h2>PROJECT 01 · AI PRODUCT FILM · COMPLETED</h2>
<h2>PROJECT 02 · AI SHORT FILM WORKFLOW · COMPLETED</h2>
<p>与 Project 01 共用同一支成片；此项目重点证明连续镜头制作方法。</p>
<h2>PROJECT 03 · AI CONTENT WORKFLOW · IN DEVELOPMENT</h2>
<p>FFmpeg 流程串联处于实验阶段；API、批量任务和稳定自动化输出仍在计划中。</p>
```

Keep the base-safe `/yu-ai-portfolio/` video and evidence links plus email/phone links. Remove old `AI CONTENT CREATOR`, `TOOLS INTO SYSTEMS`, and old workflow image copy.

Update noscript colors to the same approved palette: background `#07160f`, text `#f3f1e8`, accent `#b7ff2a`, muted/lines `#89958a`; remove the old off-palette `#07100a`, `#f3f7f2`, `#a9ff1c`, `#adb8ae`, and `#314033` literals.

- [ ] **Step 6: Run focused assembly tests**

Run: `npm run test:run -- src/App.test.tsx src/App.integration.test.tsx src/features/navigation/Navigation.test.tsx`

Expected: PASS.

- [ ] **Step 7: Run full automated verification**

Run: `npm run test:run`

Expected: all tests PASS with no unhandled React warnings.

Run: `npm run build`

Expected: TypeScript and Vite build PASS; generated assets use `/yu-ai-portfolio/`.

Run: `Get-ChildItem dist -Recurse -File | Select-String -Pattern 'n8n|4年工作经验|下载简历' -CaseSensitive:$false`

Expected: no matches.

Run: `Select-String -LiteralPath vite.config.ts -Pattern 'base:\s*["'']\/yu-ai-portfolio\/["'']'`

Expected: one match.

- [ ] **Step 8: Perform visual and accessibility verification**

Start: `npm run dev -- --host 127.0.0.1`

Verify at widths 360, 390, 768, 1024, 1440, and a wide desktop:

- no horizontal overflow;
- loader exits after key visual assets rather than the full frame sequence;
- pointer intro remains under approximately 20° and the Chinese mask reveals only over the English title;
- four hero stages remain synchronized with portrait scrolling;
- recruiter direction, About, three projects, and Skills are understandable in the first 10–20 seconds;
- Project 01 player and dialog work;
- Project 02 shows three readable evidence images and no failed-task panel;
- the shared-output link lands on the Project 01 player;
- Project 03 statuses are text-visible and truthful;
- all four skill cards flip by click, Enter, and Space;
- reduced-motion retains all content without 3D flips or animated scrolling;
- 200% zoom remains operable.

- [ ] **Step 9: Commit the assembled site**

```powershell
git add src/App.tsx src/App.test.tsx src/App.integration.test.tsx src/features/navigation src/styles/global.css index.html
git commit -m "feat: assemble recruiter-focused portfolio"
```

- [ ] **Step 10: Confirm a clean branch before publishing**

Run: `git status --short`

Expected: no output.

Run: `git log --oneline --decorate -12`

Expected: the task commits appear after design and plan documentation commits, with no unrelated user changes included.

Do not push until the final visual review has passed and the user has explicitly authorized publishing the completed implementation.
