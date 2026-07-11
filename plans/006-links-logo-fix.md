# 006 — /links logo consistency (LinkedIn odd-one-out)

**Batch:** 2 · **Effort:** ~15 min · **User input:** only if adding NEW logos (ask before expanding scope)

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Diagnosis

`src/pages/links/index.astro:2-7` imports six SVGs from `src/assets/icons/`, rendered as `<IconComponent class="squircle size-10 rounded-xl p-2.5">` inside colored tiles (lines 136-142).

Five are **simple-icons brand glyphs** — solid single-path `fill` marks, `viewBox="0 0 24 24"`, `role="img"` + `<title>`: `bluesky.svg`, `github.svg`, `x.svg`, `youtube.svg`, `twitch.svg`. Styled `fill-white`.

The sixth, `linkedin2.svg`, is a **Lucide outline icon** (`fill="none" stroke="currentColor" stroke-width="2"`) — a stroked icon among five solid marks. Its config fights the source: `iconFill: "fill-white stroke-none"` (line ~51). The `2` in the filename suggests a prior failed swap. Note: "all icons from Lucide" does NOT apply here — brand logos are exempt, and Lucide's `linkedin` is the wrong *style* for this tile row.

## Change

1. Replace the file with the **simple-icons LinkedIn glyph**: create `src/assets/icons/linkedin.svg` matching the other five exactly in structure — `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="…"/></svg>`. Get the path from https://simpleicons.org/icons/linkedin.svg (WebFetch) or copy the structural pattern from `github.svg` with the fetched path data. simple-icons is not an installed dependency — embed the SVG file like the others.
2. Update the import in `links/index.astro` to the new filename; delete `linkedin2.svg`.
3. Fix the config entry (~line 51): `iconFill: "fill-white"` — drop the `stroke-none` hack.

## Acceptance criteria

- All six tiles render visually consistent solid white glyphs on their brand-colored squircles.
- `linkedin2.svg` gone; no import errors; `astro check` clean.

## Verify

Dev server → /links, light + dark. Zoom on the LinkedIn tile vs GitHub tile — same solid weight.
