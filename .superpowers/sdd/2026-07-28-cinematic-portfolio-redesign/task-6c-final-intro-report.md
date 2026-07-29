# Task 6C final intro implementation report

## Result

Implemented the approved final intro composition without changing any
non-intro feature:

- restored pointer-eased `rotateX` / `rotateY` 3D treatment on the English
  headline only, with a perspective title stage and exact ±20° clamps;
- retained the Task 6B safe single-line headline sizing contract;
- replaced the decorated reveal with an empty, solid `var(--pine)` circle;
- added a separate, fixed Chinese headline layer clipped by the moving
  screen-space circle;
- placed `AI AGENT PORTFOLIO / CREATIVE WORKFLOW SHOWCASE` directly below
  the English title;
- removed `AI CONTENT CREATOR / HANGZHOU`, leaving only the bottom scroll
  hint;
- preserved pointer easing, touch capture/release, mobile idle drift, resize
  recentering, offscreen RAF pause/resume, and reduced-motion behavior.

The English title, flat circle, and Chinese mask are sibling layers. The
Chinese text is not nested in the circle and neither the circle nor Chinese
layer consumes the title's rotation variables.

## TDD evidence

RED was recorded before production edits:

- focused run: 3 test files failed, 19 tests failed and 9 passed;
- failures were the expected missing behaviors: no `rotateX` / `rotateY`,
  no perspective title stage, no independent circular mask, missing new
  annotation, retained old subtitle, and old decorated/nested reveal.

GREEN after the minimal implementation:

- focused run: 3 test files passed, 30 tests passed.

Added or updated coverage for:

- centered zero-angle math and independent ±20° X/Y clamps;
- perspective parent and English-only 3D transform variables;
- the existing safe responsive size/width contract;
- an empty solid circle with no decorative children;
- a fixed sibling Chinese layer using the exact literal and pointer-positioned
  circular clip;
- annotation association and old intro subtitle removal;
- desktop 220–320px and mobile 160–220px circle ranges;
- all pre-existing lifecycle, touch, drift, resize, offscreen, and
  reduced-motion behavior.

## Verification

Commands run from the worktree:

```text
npm.cmd run test:run -- src/features/intro src/content/siteContent.test.ts
  3 files passed; 30 tests passed

npm.cmd run test:run
  18 files passed; 116 tests passed

npm.cmd run build
  TypeScript and Vite build succeeded; 59 modules transformed

git diff --check
  exit 0
```

The full Vitest run emits the repository's existing jsdom
`HTMLMediaElement.load()` notices; there were no test failures.

## Rendered geometry

Verified the built production preview in headless Chrome at a 900px viewport
height. Each width was checked with the pointer/touch away from the headline
and crossing its left, center, and right portions.

| Width | Circle size | Away overlap | Left / center / right overlap | English fully visible |
| ---: | ---: | :---: | :---: | :---: |
| 360px | 160px | none | yes / yes / yes | yes |
| 390px | 163.8px | none | yes / yes / yes | yes |
| 768px | 220px | none | yes / yes / yes | yes |
| 1024px | 220px | none | yes / yes / yes | yes |
| 1428px | 257.03px | none | yes / yes / yes | yes |
| 1440px | 259.19px | none | yes / yes / yes | yes |

Computed `clip-path` radii matched half the rendered circle size at every
width. Circle and clip centers converged within 0.76px on active mobile touch
checks and within 0.05px on desktop checks. Non-centered headline states
rendered as 3D transform matrices. Mobile crossings were exercised with an
active touch, preserving the intentional idle-drift behavior when no touch is
active.

## Scope and self-review

Reviewed the complete diff and confirmed:

- no circle pseudo-elements, borders, gradients, text, rings, or pattern
  children remain;
- only the English `h1` receives 3D rotation;
- the circle is outside the perspective stage and uses translation only;
- the fixed Chinese layer and English title share the same absolute centered
  stage geometry;
- reduced motion keeps a centered static circle/mask, a readable untransformed
  English title, and starts no RAF;
- no film, workflow, hero, capabilities, contact, asset, route, or Vite base
  files changed.
