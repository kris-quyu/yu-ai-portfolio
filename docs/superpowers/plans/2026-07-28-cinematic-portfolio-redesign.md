# Cinematic Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real loading sequence, pointer-following introduction, stage-synchronised character story, and accessible flip cards while preserving the existing film, workflow, contact, media, and GitHub Pages behavior.

**Architecture:** Keep the existing React/Vite single page and its focused feature folders. Add a shared boot-loading layer and a self-contained pointer intro, derive hero copy from scroll progress with pure functions, and model card fronts/backs from centralized content. Existing sections remain independent and are integrated through `App` and `Navigation`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, GSAP ScrollTrigger, CSS Modules, Vitest, Testing Library.

## Global Constraints

- Preserve `base: "/yu-ai-portfolio/"` in `vite.config.ts`.
- Preserve exactly one AI film, one ComfyUI workflow proof, three capability cards, and the contact section.
- Page order must be `home → profile → film → system → capabilities → contact`.
- Use `HELLO, I'M YU`, `AI CONTENT CREATOR / HANGZHOU`, and `你好，我是宇` verbatim on the intro.
- Pointer-driven title tilt must clamp to approximately `20deg`.
- Loading must last at least `1200ms`, stop blocking at `6000ms`, and never strand the visitor.
- Hero phase boundaries remain `0.2`, `0.55`, and `0.82`; the final view remains the source material’s half-body composition.
- Capability cards flip only on click/keyboard activation; hover may lift the card but must not flip it.
- Use `#E7EBDD`, `#07160F`, `#123326`, `#B7FF2A`, `#89958A`, and `#F3F1E8`; do not introduce pure black or pure white.
- Do not show “4 年工作经验”, do not add a résumé download, and do not add a second AI video.
- All new behavior must respect `prefers-reduced-motion`.
- Follow test-driven development: each production behavior is preceded by a failing focused test.

---

## File Map

**Create**

- `src/features/loader/loadPortfolio.ts` — timed critical-asset loading and progress.
- `src/features/loader/loadPortfolio.test.ts` — loader timing/progress/failure tests.
- `src/features/loader/PortfolioLoader.tsx` — full-screen loading UI and reveal lifecycle.
- `src/features/loader/PortfolioLoader.test.tsx` — overlay, copy, timeout, and exit tests.
- `src/features/loader/PortfolioLoader.module.css` — loader visual system and reduced-motion fallback.
- `src/features/hero/portraitSequenceCache.ts` — shared in-flight/current-device frame cache.
- `src/features/hero/portraitSequenceCache.test.ts` — cache de-duplication and progress tests.
- `src/features/intro/introMath.ts` — pointer normalization and clamped title rotation.
- `src/features/intro/introMath.test.ts` — center, edge, and clamp tests.
- `src/features/intro/PointerIntro.tsx` — independent pointer/touch homepage.
- `src/features/intro/PointerIntro.test.tsx` — content, pointer, touch, and reduced-motion tests.
- `src/features/intro/PointerIntro.module.css` — warm sage homepage, mask, title, and responsive layout.
- `src/noscript.test.ts` — source-level fallback contract.

**Modify**

- `src/App.tsx` / `src/App.test.tsx` — loading overlay and six-section order.
- `src/App.integration.test.tsx` — complete assembled-page contract.
- `src/content/siteContent.ts` / `src/content/siteContent.test.ts` — intro, four hero stages, and capability back content.
- `src/features/navigation/Navigation.tsx` / tests / CSS — HOME entry and light/dark section treatment.
- `src/features/hero/heroMath.ts` / tests — derive phase and stage index.
- `src/features/hero/HeroScrollSequence.tsx` / tests / CSS — consume the shared frame cache, stage copy transitions, and progress metadata.
- `src/features/capabilities/CapabilityGrid.tsx` / tests / CSS — independent accessible flip state and sage backs.
- `src/styles/global.css` — approved tokens and page-level transitions.
- `index.html` — update the no-JavaScript fallback for the new order and messaging.
- `README.md` — describe the new interaction flow and verification commands.

---

### Task 1: Centralize the new narrative content

**Files:**
- Modify: `src/content/siteContent.ts`
- Modify: `src/content/siteContent.test.ts`

**Interfaces:**
- Produces: `SectionId = 'home' | 'profile' | 'film' | 'system' | 'capabilities' | 'contact'`.
- Produces: `HeroStage` with `id`, `phase`, `eyebrow`, `title`, `label`, and `summary`.
- Produces: capability fields `mastered`, `growing`, and `next`.

- [ ] **Step 1: Write the failing content tests**

```ts
it('defines the approved intro and six-section navigation', () => {
  expect(siteContent.intro).toEqual({
    title: "HELLO, I'M YU",
    reveal: '你好，我是宇',
    subtitle: 'AI CONTENT CREATOR / HANGZHOU',
    hint: '移动鼠标探索 · 向下滚动查看更多',
  });
  expect(siteContent.navigation.map(({ id }) => id)).toEqual([
    'home', 'profile', 'film', 'system', 'capabilities', 'contact',
  ]);
});

it('defines the four capability-growth stages verbatim', () => {
  expect(siteContent.hero.stages.map(({ title, label }) => [title, label])).toEqual([
    ['THINK WITH AI.', '理解工具'],
    ['SHAPE THE STORY.', '形成内容'],
    ['BUILD THE WORKFLOW.', '串联流程'],
    ['DELIVER THE RESULT.', '服务转化'],
  ]);
});

it('defines growth copy for every capability back', () => {
  siteContent.capabilities.forEach((capability) => {
    expect(capability.mastered).not.toBe('');
    expect(capability.growing).not.toBe('');
    expect(capability.next).not.toBe('');
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd run test:run -- src/content/siteContent.test.ts`  
Expected: FAIL because `intro`, `hero.stages`, the `home` section, and capability growth fields do not exist.

- [ ] **Step 3: Add the exact content model**

```ts
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

intro: {
  title: "HELLO, I'M YU",
  reveal: '你好，我是宇',
  subtitle: 'AI CONTENT CREATOR / HANGZHOU',
  hint: '移动鼠标探索 · 向下滚动查看更多',
},
```

Populate `hero.stages` with the four approved titles and concise summaries:

```ts
[
  ['think', 'push-in', '01 · THINK', 'THINK WITH AI.', '理解工具',
   '理解 ComfyUI、n8n、Codex 等 AI 工具。'],
  ['shape', 'pull-back', '02 · SHAPE', 'SHAPE THE STORY.', '形成内容',
   '把产品卖点转成脚本、分镜和画面。'],
  ['build', 'turn', '03 · BUILD', 'BUILD THE WORKFLOW.', '串联流程',
   '将生成、剪辑和自动化串成稳定流程。'],
  ['deliver', 'hold', '04 · DELIVER', 'DELIVER THE RESULT.', '服务转化',
   '让内容最终服务用户理解与电商转化。'],
]
```

For each capability, add truthful short strings under `mastered`, `growing`, and `next`; keep all existing tools.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm.cmd run test:run -- src/content/siteContent.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/content/siteContent.ts src/content/siteContent.test.ts
git commit -m "feat: define cinematic portfolio narrative"
```

---

### Task 2: Build a real, bounded loading sequence

**Files:**
- Create: `src/features/loader/loadPortfolio.ts`
- Create: `src/features/loader/loadPortfolio.test.ts`
- Create: `src/features/loader/PortfolioLoader.tsx`
- Create: `src/features/loader/PortfolioLoader.test.tsx`
- Create: `src/features/loader/PortfolioLoader.module.css`
- Create: `src/features/hero/portraitSequenceCache.ts`
- Create: `src/features/hero/portraitSequenceCache.test.ts`
- Modify: `src/features/hero/HeroScrollSequence.tsx`
- Modify: `src/features/hero/HeroScrollSequence.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces: `LoadPortfolioOptions { minimumMs; maximumMs; onProgress; loadCritical }`.
- Produces: `loadPortfolio(options): Promise<'ready' | 'degraded'>`.
- Produces: `loadPortraitSequenceCached(options): Promise<HTMLImageElement[]>`.
- Produces: `<PortfolioLoader loadCritical? />`, rendered once beside `Navigation` and `main`.

- [ ] **Step 1: Write failing utility tests**

```ts
it('reports real critical progress and respects the minimum duration', async () => {
  vi.useFakeTimers();
  const onProgress = vi.fn();
  const result = loadPortfolio({
    minimumMs: 1200,
    maximumMs: 6000,
    onProgress,
    loadCritical: (report) => {
      report(1, 3);
      report(2, 3);
      report(3, 3);
      return Promise.resolve();
    },
  });
  await vi.advanceTimersByTimeAsync(1199);
  expect(onProgress).toHaveBeenLastCalledWith(100);
  await vi.advanceTimersByTimeAsync(1);
  await expect(result).resolves.toBe('ready');
});

it('returns degraded after the maximum duration instead of blocking forever', async () => {
  vi.useFakeTimers();
  const result = loadPortfolio({
    minimumMs: 1200,
    maximumMs: 6000,
    onProgress: vi.fn(),
    loadCritical: () => new Promise(() => undefined),
  });
  await vi.advanceTimersByTimeAsync(6000);
  await expect(result).resolves.toBe('degraded');
});
```

- [ ] **Step 2: Run utility tests and verify RED**

Run: `npm.cmd run test:run -- src/features/loader/loadPortfolio.test.ts`  
Expected: FAIL because `loadPortfolio` does not exist.

- [ ] **Step 3: Implement the bounded loader**

Implement `loadPortfolio` with:

```ts
export type PortfolioLoadResult = 'ready' | 'degraded';

export interface LoadPortfolioOptions {
  minimumMs: number;
  maximumMs: number;
  onProgress: (percent: number) => void;
  loadCritical: (report: (loaded: number, total: number) => void) => Promise<void>;
}
```

Use `Promise.race` for the maximum bound and `Promise.all` for the minimum delay. Clamp reported progress to `0..100`; emit `100` only after critical loading resolves. Rejecting critical assets returns `degraded`, never an unhandled rejection.

- [ ] **Step 4: Verify utility tests GREEN**

Run: `npm.cmd run test:run -- src/features/loader/loadPortfolio.test.ts`  
Expected: PASS.

- [ ] **Step 5: Write failing component tests**

```tsx
it('shows the approved loading copy and percentage on every mount', () => {
  render(<PortfolioLoader loadCritical={() => new Promise(() => undefined)} />);
  expect(screen.getByText('LOADING CREATIVE SYSTEM')).toBeInTheDocument();
  expect(screen.getByText('0%')).toBeInTheDocument();
  expect(screen.getByText(/AI 内容/)).toBeInTheDocument();
});

it('becomes non-modal after loading and then unmounts the overlay', async () => {
  vi.useFakeTimers();
  render(<PortfolioLoader loadCritical={() => Promise.resolve()} />);
  await vi.advanceTimersByTimeAsync(1200);
  expect(screen.getByTestId('portfolio-loader')).toHaveAttribute('data-state', 'revealing');
  await vi.advanceTimersByTimeAsync(700);
  expect(screen.queryByTestId('portfolio-loader')).not.toBeInTheDocument();
});
```

- [ ] **Step 6: Write the failing shared-frame-cache test**

```ts
it('shares one in-flight frame request between loader and hero consumers', async () => {
  const pending = Promise.resolve([{ width: 1600, height: 900 } as HTMLImageElement]);
  vi.mocked(loadFrameSequence).mockReturnValue(pending);
  const options = {
    posterUrl: '/poster.webp',
    pattern: '/frame-%04d.webp',
    count: 120,
  };

  const first = loadPortraitSequenceCached(options);
  const second = loadPortraitSequenceCached(options);

  expect(loadFrameSequence).toHaveBeenCalledTimes(1);
  await expect(first).resolves.toHaveLength(1);
  await expect(second).resolves.toHaveLength(1);
});
```

- [ ] **Step 7: Run component/cache tests and verify RED**

Run: `npm.cmd run test:run -- src/features/loader/PortfolioLoader.test.tsx src/features/hero/portraitSequenceCache.test.ts`  
Expected: FAIL because `PortfolioLoader` and the shared cache do not exist.

- [ ] **Step 8: Implement the shared frame cache**

`loadPortraitSequenceCached` accepts the same poster/pattern/count inputs as `loadFrameSequence`, plus optional `signal` and `onProgress`. Cache by `pattern + count`; concurrent callers share one promise. Progress listeners receive the latest `(loaded, total)` value. Keep a completed result for later Hero reuse. Remove failed/aborted entries so retry remains possible.

Replace Hero’s direct `loadFrameSequence` call with `loadPortraitSequenceCached`; preserve abort handling, progress display, fallback thresholds, and existing Canvas behavior.

- [ ] **Step 9: Implement loader UI and critical asset function**

`PortfolioLoader` must:

- start at `0%`;
- call `loadPortfolio({ minimumMs: 1200, maximumMs: 6000, ... })`;
- cycle `AI 内容 / 视频工作流 / 电商转化`;
- load `document.fonts.ready`, the media manifest, portrait poster, and the complete current-device portrait sequence through `loadPortraitSequenceCached`;
- create a metadata-only `HTMLVideoElement` warm-up for the film without waiting past the maximum;
- set `data-state="revealing"` at completion and remove itself after `700ms`;
- set `aria-busy`, `role="status"`, and a polite live region;
- lock body scrolling only while the overlay is modal and restore the previous value.

Render it in `App`:

```tsx
<>
  <PortfolioLoader />
  <Navigation />
  <main>{/* sections */}</main>
</>
```

The CSS uses deep forest `#07160F`, acid lime `#B7FF2A`, a large centered percentage, a soft central orb, and a scale-based reveal. Reduced motion uses opacity only.

- [ ] **Step 10: Verify Task 2 GREEN**

Run: `npm.cmd run test:run -- src/features/loader src/features/hero src/App.test.tsx`  
Expected: PASS.

- [ ] **Step 11: Commit**

```powershell
git add src/features/loader src/features/hero src/App.tsx src/App.test.tsx
git commit -m "feat: add bounded portfolio loading sequence"
```

---

### Task 3: Add the pointer-following intro homepage

**Files:**
- Create: `src/features/intro/introMath.ts`
- Create: `src/features/intro/introMath.test.ts`
- Create: `src/features/intro/PointerIntro.tsx`
- Create: `src/features/intro/PointerIntro.test.tsx`
- Create: `src/features/intro/PointerIntro.module.css`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/features/navigation/Navigation.tsx`
- Modify: `src/features/navigation/Navigation.test.tsx`
- Modify: `src/features/navigation/Navigation.module.css`

**Interfaces:**
- Produces: `getIntroTransform(pointerX, pointerY, width, height, maxTilt = 20)`.
- Produces: `<PointerIntro />` with section id `home`.

- [ ] **Step 1: Write failing intro-math tests**

```ts
expect(getIntroTransform(500, 300, 1000, 600)).toEqual({
  rotateX: 0, rotateY: 0, normalizedX: 0, normalizedY: 0,
});
expect(getIntroTransform(1000, 0, 1000, 600)).toMatchObject({
  rotateX: 20, rotateY: 20,
});
expect(getIntroTransform(2000, -1000, 1000, 600)).toMatchObject({
  rotateX: 20, rotateY: 20,
});
```

- [ ] **Step 2: Run math tests and verify RED**

Run: `npm.cmd run test:run -- src/features/intro/introMath.test.ts`  
Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement clamped pointer math**

```ts
const clamp = (value: number) => Math.min(1, Math.max(-1, value));

export function getIntroTransform(
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
  maxTilt = 20,
) {
  const normalizedX = clamp(((pointerX / Math.max(width, 1)) - 0.5) * 2);
  const normalizedY = clamp(((pointerY / Math.max(height, 1)) - 0.5) * 2);
  return {
    normalizedX,
    normalizedY,
    rotateX: -normalizedY * maxTilt,
    rotateY: normalizedX * maxTilt,
  };
}
```

- [ ] **Step 4: Verify math tests GREEN**

Run: `npm.cmd run test:run -- src/features/intro/introMath.test.ts`  
Expected: PASS.

- [ ] **Step 5: Write failing component and navigation tests**

```tsx
it('renders the approved bilingual intro', () => {
  render(<PointerIntro />);
  expect(screen.getByRole('heading', { name: "HELLO, I'M YU" })).toBeInTheDocument();
  expect(screen.getByText('你好，我是宇')).toBeInTheDocument();
  expect(screen.getByText('AI CONTENT CREATOR / HANGZHOU')).toBeInTheDocument();
});

it('updates CSS variables from pointer movement', () => {
  const { container } = render(<PointerIntro />);
  const section = container.querySelector('#home')!;
  fireEvent.pointerMove(section, { clientX: 900, clientY: 100 });
  expect(section).toHaveStyle({
    '--intro-pointer-x': '900px',
    '--intro-pointer-y': '100px',
  });
});
```

Update navigation expectations to include `HOME → #home`, make the brand link `#home`, and expect six navigation links.

- [ ] **Step 6: Run component/navigation tests and verify RED**

Run: `npm.cmd run test:run -- src/features/intro src/features/navigation src/App.test.tsx`  
Expected: FAIL because the component and HOME integration are missing.

- [ ] **Step 7: Implement intro and navigation integration**

`PointerIntro` uses one `requestAnimationFrame` loop:

- pointer events update target coordinates;
- rendered coordinates ease toward target with factor `0.12`;
- transforms are written as CSS custom properties;
- title uses `rotateX(var(--intro-rotate-x)) rotateY(var(--intro-rotate-y))`;
- the circle uses `translate3d` and contains the Chinese reveal;
- touch/pointer capture permits dragging;
- mobile with no active pointer uses a low-amplitude deterministic drift;
- reduced motion keeps a static centered circle and zero tilt.

Place `<PointerIntro />` before `<HeroScrollSequence />`. Add HOME to Navigation and ensure IntersectionObserver observes six sections.

Use the approved palette and real CSS gradients/lines only; do not invent an image asset.

- [ ] **Step 8: Verify Task 3 GREEN**

Run: `npm.cmd run test:run -- src/features/intro src/features/navigation src/App.test.tsx`  
Expected: PASS.

- [ ] **Step 9: Commit**

```powershell
git add src/features/intro src/features/navigation src/App.tsx src/App.test.tsx
git commit -m "feat: add pointer-following portfolio introduction"
```

---

### Task 4: Synchronize hero capability copy with the four character phases

**Files:**
- Modify: `src/features/hero/heroMath.ts`
- Modify: `src/features/hero/heroMath.test.ts`
- Modify: `src/features/hero/HeroScrollSequence.tsx`
- Modify: `src/features/hero/HeroScrollSequence.test.tsx`
- Modify: `src/features/hero/HeroScrollSequence.module.css`

**Interfaces:**
- Produces: `getHeroStageIndex(progress): 0 | 1 | 2 | 3`.
- Consumes: `siteContent.hero.stages`.

- [ ] **Step 1: Write failing pure-function tests**

```ts
expect(getHeroStageIndex(-1)).toBe(0);
expect(getHeroStageIndex(0.199)).toBe(0);
expect(getHeroStageIndex(0.2)).toBe(1);
expect(getHeroStageIndex(0.549)).toBe(1);
expect(getHeroStageIndex(0.55)).toBe(2);
expect(getHeroStageIndex(0.819)).toBe(2);
expect(getHeroStageIndex(0.82)).toBe(3);
expect(getHeroStageIndex(2)).toBe(3);
```

- [ ] **Step 2: Run math tests and verify RED**

Run: `npm.cmd run test:run -- src/features/hero/heroMath.test.ts`  
Expected: FAIL because `getHeroStageIndex` is missing.

- [ ] **Step 3: Implement direct phase mapping**

```ts
export function getHeroStageIndex(progress: number): 0 | 1 | 2 | 3 {
  const p = clamp01(progress);
  if (p < 0.2) return 0;
  if (p < 0.55) return 1;
  if (p < 0.82) return 2;
  return 3;
}
```

- [ ] **Step 4: Verify math tests GREEN**

Run: `npm.cmd run test:run -- src/features/hero/heroMath.test.ts`  
Expected: PASS.

- [ ] **Step 5: Write failing component tests**

Capture the `ScrollTrigger.create` configuration and invoke `onUpdate`:

```tsx
act(() => onUpdate({ progress: 0.56 }));
expect(screen.getByRole('heading', { name: 'BUILD THE WORKFLOW.' })).toBeInTheDocument();
expect(screen.getByText('串联流程')).toBeInTheDocument();

act(() => onUpdate({ progress: 0.9 }));
expect(screen.getByRole('heading', { name: 'DELIVER THE RESULT.' })).toBeInTheDocument();
expect(screen.getByText('服务转化')).toBeInTheDocument();
```

Reduced motion must render the final stage plus a semantic list of all four stage summaries.

- [ ] **Step 6: Run hero component tests and verify RED**

Run: `npm.cmd run test:run -- src/features/hero/HeroScrollSequence.test.tsx`  
Expected: FAIL because the current copy is static.

- [ ] **Step 7: Implement synchronized copy**

- Add `activeStage` state.
- In `onUpdate`, compute `const nextStage = getHeroStageIndex(progress)` and update only when it changes.
- Render a keyed stage copy block so CSS can animate old content upward and new content from below.
- Keep the loading/status text and Canvas logic unchanged.
- Update the progress metadata with `0${activeStage + 1} / 04`.
- On reduced motion, render the final poster and an accessible list containing all four stages.
- Use `aria-live="polite"` only on the concise stage label, not the entire heading block.

CSS must preserve the approved overlap without covering the face and disable the text transition under reduced motion.

- [ ] **Step 8: Verify Task 4 GREEN**

Run: `npm.cmd run test:run -- src/features/hero`  
Expected: PASS.

- [ ] **Step 9: Commit**

```powershell
git add src/features/hero
git commit -m "feat: sync capability story with hero motion"
```

---

### Task 5: Convert capabilities into independent accessible flip cards

**Files:**
- Modify: `src/features/capabilities/CapabilityGrid.tsx`
- Modify: `src/features/capabilities/CapabilityGrid.test.tsx`
- Modify: `src/features/capabilities/CapabilityGrid.module.css`

**Interfaces:**
- Consumes: capability `mastered`, `growing`, `next`, and `tools`.
- Produces: independent `Set<Capability['id']>` flip state.

- [ ] **Step 1: Replace the old expansion tests with failing flip tests**

```tsx
it('allows multiple cards to remain flipped', async () => {
  const user = userEvent.setup();
  render(<CapabilityGrid />);
  const buttons = screen.getAllByRole('button', { name: /翻转/ });
  await user.click(buttons[0]);
  await user.click(buttons[1]);
  expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
  expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
});

it('exposes growth copy only on the active back face', async () => {
  const user = userEvent.setup();
  render(<CapabilityGrid />);
  const first = screen.getAllByRole('button', { name: /翻转/ })[0];
  await user.click(first);
  expect(screen.getByText('已能独立完成')).toBeVisible();
  expect(screen.getByText('正在持续强化')).toBeVisible();
  expect(screen.getByText('下一阶段目标')).toBeVisible();
});

it('uses click state rather than hover selectors for flipping', () => {
  expect(capabilityCss).toMatch(/\.flipped\s+\.cardInner/s);
  expect(capabilityCss).not.toMatch(/:hover[^,{]*\.cardInner[^}]*rotateY/s);
});
```

- [ ] **Step 2: Run capability tests and verify RED**

Run: `npm.cmd run test:run -- src/features/capabilities/CapabilityGrid.test.tsx`  
Expected: FAIL because cards currently expand a single tool list.

- [ ] **Step 3: Implement the card structure and state**

Use:

```ts
const [flippedCards, setFlippedCards] = useState<Set<Capability['id']>>(
  () => new Set(),
);

function toggleCard(id: Capability['id']) {
  setFlippedCards((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}
```

Each article contains a full-size button with:

- `aria-pressed={flipped}`;
- an accessible name `翻转${capability.title}技能卡`;
- `.cardInner`, `.front`, and `.back`;
- front content: index/title/summary/tools;
- back content: three labelled growth statements and a “返回正面” cue.

Hide the inactive face from assistive technology with `aria-hidden`.

CSS:

- perspective on `.card`;
- `.flipped .cardInner { transform: rotateY(180deg); }`;
- front uses deep forest/ivory/acid lime;
- back uses `#E7EBDD`, `#07160F`, `#123326`, `#B7FF2A`;
- hover only translates the outer card upward and strengthens the outline;
- reduced motion swaps face visibility without 3D rotation.

- [ ] **Step 4: Run capability tests and verify GREEN**

Run: `npm.cmd run test:run -- src/features/capabilities/CapabilityGrid.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/capabilities
git commit -m "feat: add accessible capability flip cards"
```

---

### Task 6: Integrate the approved palette, page transitions, and responsive behavior

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/features/intro/PointerIntro.module.css`
- Modify: `src/features/loader/PortfolioLoader.module.css`
- Modify: `src/features/navigation/Navigation.module.css`
- Modify: `src/features/hero/HeroScrollSequence.module.css`
- Modify: `src/features/film/FeaturedFilm.module.css`
- Modify: `src/features/workflow/WorkflowProof.module.css`
- Modify: `src/features/capabilities/CapabilityGrid.module.css`
- Modify: `src/features/contact/ContactSection.module.css`
- Modify: `src/App.integration.test.tsx`

**Interfaces:**
- Produces global tokens `--sage`, `--forest`, `--pine`, `--acid`, `--muted-sage`, `--ivory`.

- [ ] **Step 1: Add failing CSS-contract and integration tests**

Import the stylesheet source in `App.integration.test.tsx`:

```ts
import globalCss from './styles/global.css?raw';
```

```ts
expect(globalCss).toContain('--sage: #e7ebdd');
expect(globalCss).toContain('--forest: #07160f');
expect(globalCss).toContain('--pine: #123326');
expect(globalCss).toContain('--acid: #b7ff2a');
expect(globalCss).toContain('--muted-sage: #89958a');
expect(globalCss).toContain('--ivory: #f3f1e8');
expect(globalCss).not.toMatch(/#000(?:000)?\b|#fff(?:fff)?\b/i);
```

Update the assembled section-order assertion to:

```ts
['home', 'profile', 'film', 'system', 'capabilities', 'contact']
```

Assert six navigation links, one film, one workflow image, three capability articles, and absence of rejected résumé/work-year text.

- [ ] **Step 2: Run integration tests and verify RED**

Run: `npm.cmd run test:run -- src/App.integration.test.tsx`  
Expected: FAIL until all six sections and tokens are integrated.

- [ ] **Step 3: Apply the unified visual system**

Add exact lowercase tokens:

```css
:root {
  --sage: #e7ebdd;
  --forest: #07160f;
  --pine: #123326;
  --acid: #b7ff2a;
  --muted-sage: #89958a;
  --ivory: #f3f1e8;
}
```

Then:

- map the existing `--bg`, `--panel`, `--line`, `--text`, `--muted`, and `--accent` aliases to the new tokens;
- make the intro a true warm-sage full viewport;
- transition navigation foreground/background according to the active section without flashing;
- keep profile/film/workflow/capabilities/contact in the dark family;
- use different restrained reveal treatments for film, workflow, capabilities, and contact;
- prevent any 3D title/card backface bleed;
- preserve 44px interactive targets;
- at 360/390px prevent horizontal overflow and facial obstruction;
- at 768px keep readable tablet proportions;
- at 1440px preserve strong poster overlap and whitespace;
- do not add pure black or pure white literals.

- [ ] **Step 4: Run integration and all focused component tests**

Run: `npm.cmd run test:run -- src/App.integration.test.tsx src/features`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/styles src/features src/App.integration.test.tsx
git commit -m "style: unify cinematic portfolio visual system"
```

---

### Task 7: Complete fallback, accessibility, and production verification

**Files:**
- Create: `src/noscript.test.ts`
- Modify: `index.html`
- Modify: `src/App.integration.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes all completed sections.
- Produces a production-ready static fallback and documented verification procedure.

- [ ] **Step 1: Write the failing no-JavaScript and accessibility assertions**

Add/update a source test that reads `index.html` and asserts the `<noscript>` includes:

```ts
expect(html).toContain("HELLO, I'M YU");
expect(html).toContain('你好，我是宇');
expect(html).toContain('THINK WITH AI.');
expect(html).toContain('AI PRODUCT FILM');
expect(html).toContain('TOOLS INTO SYSTEMS.');
expect(html).toContain('mailto:1282736393@qq.com');
expect(html).toContain('tel:13123986103');
```

In the app integration test, assert:

- loader status is labelled;
- HOME is first;
- each section has an accessible heading;
- capability buttons expose `aria-pressed`;
- film dialog trigger, email, telephone, and copy buttons remain usable;
- rejected résumé/work-year content remains absent.

- [ ] **Step 2: Run the targeted tests and verify RED**

Run: `npm.cmd run test:run -- src/noscript.test.ts src/App.integration.test.tsx`  
Expected: FAIL because the current no-script fallback and assembled assertions do not contain the new intro/narrative.

- [ ] **Step 3: Update fallback and documentation**

In `index.html`, provide a styled `<noscript>` article containing:

- intro name and positioning;
- the four capability-growth titles and Chinese labels;
- one direct film link and poster;
- the ComfyUI workflow image;
- the three capability titles;
- mail and telephone links.

Use only base-safe `/yu-ai-portfolio/` asset paths.

Update README with:

```md
页面流程：加载系统 → 鼠标跟随首页 → 滚动人物能力成长 → AI 作品 →
AI 工作流 → 点击翻转技能 → 联系方式

npm run test:run
npm run build
```

- [ ] **Step 4: Run the complete verification suite**

Run:

```powershell
npm.cmd run test:run
npm.cmd run build
git diff --check
```

Expected:

- all Vitest files pass;
- TypeScript and Vite production build pass;
- generated URLs retain `/yu-ai-portfolio/`;
- `git diff --check` prints no errors.

- [ ] **Step 5: Inspect responsive output in the user’s chosen browser**

Start `npm.cmd run dev -- --host 127.0.0.1` and inspect:

- `360x800`
- `390x844`
- `768x1024`
- `1440x900`

Check loading exit, intro pointer/touch behavior, 20-degree clamp, forward/reverse hero phase changes, film dialog, workflow reveal, multi-card flip, contact controls, reduced motion, and zero horizontal overflow. Do not use a different browser without user authorization.

- [ ] **Step 6: Commit**

```powershell
git add index.html src README.md
git commit -m "test: verify cinematic portfolio experience"
```

---

## Final Review Gate

After Tasks 1–7:

1. Dispatch a whole-branch reviewer against this plan and the approved design spec.
2. Fix all critical/important findings and re-review the fix diff.
3. Re-run `npm.cmd run test:run`, `npm.cmd run build`, and `git diff --check`.
4. Use `superpowers:finishing-a-development-branch`.
5. Push only after the branch is clean and verified; then confirm the GitHub Pages workflow succeeds.
