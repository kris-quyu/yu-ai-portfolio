# Bilingual Capability Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render every capability growth item as a consistent Chinese primary line with an English secondary line.

**Architecture:** Extend the centralized content model with a small `BilingualCopy` value object and keep all approved translations in `siteContent.ts`. Update `CapabilityGrid` to render the two language lines semantically inside the existing growth description, with CSS controlling hierarchy while leaving flip state and responsive layout unchanged.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, Testing Library, Vite.

## Global Constraints

- Each growth item uses “中文主标题 + 英文副标题”.
- Chinese appears above English with the existing primary weight and size.
- English is one size smaller, lighter in weight, and lower in contrast.
- Card palette, dividers, flip animation, card height, and responsive grid remain unchanged.
- Front-card content and all other site sections remain unchanged.
- Existing click, keyboard, multi-card flip, and accessible-description behavior remain functional.
- `vite.config.ts` must keep `base: "/yu-ai-portfolio/"`.

---

### Task 1: Render bilingual growth content across all six cards

**Files:**
- Modify: `src/content/siteContent.ts`
- Modify: `src/content/siteContent.test.ts`
- Modify: `src/features/capabilities/CapabilityGrid.tsx`
- Modify: `src/features/capabilities/CapabilityGrid.module.css`
- Modify: `src/features/capabilities/CapabilityGrid.test.tsx`
- Verify: `src/App.integration.test.tsx`

**Interfaces:**
- Produces: `BilingualCopy = { readonly zh: string; readonly en: string }`
- Produces: `Capability.mastered`, `Capability.growing`, and `Capability.next` as `BilingualCopy`
- Consumes: the existing `CapabilityGrid` flip state and front/back face structure without altering their public behavior

- [ ] **Step 1: Write failing content-model tests**

Update `src/content/siteContent.test.ts` to assert the exact bilingual values for all six capabilities. The expected value for the first capability must begin:

```ts
expect(siteContent.capabilities[0].mastered).toEqual({
  zh: 'AI 工作流搭建与自动化',
  en: 'AI workflow setup and automation',
});
```

Add equivalent exact assertions for all 18 pairs from:
`docs/superpowers/specs/2026-07-29-bilingual-capability-growth-design.md`.

- [ ] **Step 2: Write failing component tests**

Update `src/features/capabilities/CapabilityGrid.test.tsx` so a flipped card exposes both language lines:

```ts
expect(within(backFace).getByText('AI 工作流搭建与自动化')).toBeVisible();
expect(within(backFace).getByText('AI workflow setup and automation')).toBeVisible();
```

Add a six-card assertion that every back face contains three elements with the primary class and three with the secondary class. Preserve the existing keyboard, independent multi-card flip, palette, and reduced-motion tests.

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```powershell
npm.cmd run test:run -- src/content/siteContent.test.ts src/features/capabilities/CapabilityGrid.test.tsx
```

Expected: FAIL because growth fields are strings and the bilingual line elements/classes do not exist.

- [ ] **Step 4: Add the bilingual content type and exact copy**

In `src/content/siteContent.ts`, add:

```ts
export interface BilingualCopy {
  readonly zh: string;
  readonly en: string;
}
```

Change:

```ts
mastered: string;
growing: string;
next: string;
```

to:

```ts
mastered: BilingualCopy;
growing: BilingualCopy;
next: BilingualCopy;
```

Replace all 18 string values with the exact `zh` and `en` pairs from the approved design specification.

- [ ] **Step 5: Render both language lines**

In each `CapabilityGrid` growth description, render:

```tsx
<dd className={styles.growthCopy}>
  <span className={styles.growthPrimary}>{capability.mastered.zh}</span>
  <span className={styles.growthSecondary} lang="en">
    {capability.mastered.en}
  </span>
</dd>
```

Repeat for `growing` and `next`. Keep the existing `<dl>`, `<dt>`, face IDs, `aria-hidden`, `aria-describedby`, and button state.

- [ ] **Step 6: Apply the approved hierarchy**

Update `CapabilityGrid.module.css`:

```css
.growthCopy {
  display: grid;
  gap: 0.3rem;
  margin: 0;
  color: var(--forest);
}

.growthPrimary {
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 700;
  line-height: 1.35;
}

.growthSecondary {
  color: color-mix(in srgb, var(--forest) 62%, var(--sage));
  font-size: clamp(0.74rem, 1.1vw, 0.86rem);
  font-weight: 500;
  line-height: 1.4;
}
```

Do not modify `.back`, `.cardInner`, `.flipped`, grid breakpoints, or reduced-motion rules.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```powershell
npm.cmd run test:run -- src/content/siteContent.test.ts src/features/capabilities/CapabilityGrid.test.tsx src/App.integration.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 8: Run full verification**

Run:

```powershell
npm.cmd run test:run
npm.cmd run build
git diff --check
```

Expected: all tests pass, Vite production build succeeds, and `git diff --check` exits 0.

- [ ] **Step 9: Commit**

```powershell
git add src/content/siteContent.ts src/content/siteContent.test.ts src/features/capabilities/CapabilityGrid.tsx src/features/capabilities/CapabilityGrid.module.css src/features/capabilities/CapabilityGrid.test.tsx
git commit -m "feat: add bilingual capability growth copy"
```
