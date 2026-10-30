# OES public excerpt implementation plan

## Approved design
Add OES after Enjitang as a landscape commercial-delivery case. Publish product-only, silent excerpts, never the complete source or celebrity imagery/audio/name. Explain the limited public evidence and invite authorized private case discussion via WeChat. Preserve the existing style, lazy video loading, modal accessibility and GitHub Pages base.

## Implementation
- [x] Add failing integration tests for excerpt playback, contact routing, no full-version link, and six lazy previews; add WeChat copy/fallback tests.
- [x] Prepare a silent 21-second product excerpt from source ranges 6–18 and 23–32, plus poster and four-second preview; inspect exported contact sheet at two frames per second and confirm no audio stream with ffprobe.
- [x] Extend selected-film metadata with landscape/excerpt/disclosure/contact fields; render readable landscape card/modal and accurate excerpt labels. Add public WeChat qxy13123986103 using existing contact copy/fallback behavior.
- [ ] Run targeted tests, full suite, build and diff checks. Review source range and exported media (no audio, no celebrity); push verified changes and check Pages deployment.

## Constraints and review focus
No original full film in Git, no invented metrics or direct celebrity-collaboration claim, no invented process screenshots. Current source proves final product imagery only; process text describes user-confirmed responsibilities. Contact link closes modal before navigating, so inert/scroll locking cannot block contact. Existing portrait films remain portrait. Mobile landscape overrides must follow existing mobile poster rules.

## Verification
RED: four expected missing-feature failures. GREEN: 24 test files, 166 tests passed; production build and diff whitespace checks passed. Author review checked modal cleanup, base-safe excerpt paths, no original full film in the staged asset set, and landscape CSS specificity after mobile rules. Actual browser layout/interaction has not been visually verified in this session. No process screenshots were supplied, so the process disclosure is text only.
