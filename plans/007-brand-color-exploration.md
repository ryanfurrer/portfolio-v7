# 007 — Brand accent exploration (interactive; owner picks)

**Batch:** 2, user-gated · **Effort:** ~1 hr session WITH the owner · **User input:** REQUIRED — this is the taste decision

## Context (read before proposing anything)

- The accent was vermilion `#ed3f1c` (logo stroke, commit `2129f89`), then an "indigo rebrand" (`b01256f`) swapped it to neutral `var(--link)`. This is **attempt three** — the owner is leaning toward possibly a *different brand color entirely* and explicitly wants to **see options in context** before deciding. Do not just recommend a hex.
- The neutral system is Apple's literal palette (`#1d1d1f` ink on `#f5f5f7`). The accent's surface area is tiny: logo stroke (`Navbar.astro:51`), `::selection` (`global.css:151-156`), possibly the `-Ryan` signature (`Signature.astro:5`, currently `text-primary` = neutral). Because the accent never carries text contrast, almost any high-chroma hue is viable — no APCA constraint. This is a pure personality choice.
- There is currently **no brand token** — `#ed3f1c` appears nowhere in the codebase.

## Approach: live in-context comparison

1. Add a provisional token in `global.css`: `--brand` in `:root` and `.dark` (dark variant: raise L ~+0.08, trim C slightly).
2. Temporarily wire consumers: logo `stroke="var(--brand)"`; `::selection` `color-mix(in oklch, var(--brand) 22%, transparent)` (32% dark); optionally a second variant with the signature also on `var(--brand)`.
3. Candidates at **matched perceptual weight** so the comparison is hue-vs-hue, not brightness accidents. Base: `oklch(0.62 0.21 H)` (≈ the old vermilion's weight; verify `#ed3f1c` conversion first):
   - H≈32 vermilion (the original), H≈65 amber, H≈145 moss, H≈195 teal, H≈275 indigo (the abandoned rebrand — include for closure), H≈345 magenta. Gamut-check each (clamp C if outside sRGB; keep the same C% of max across hues for equal vividness).
4. Run the dev server; flip `--brand` live via browser `javascript_tool` (`document.documentElement.style.setProperty('--brand', …)`), screenshot the navbar + a text selection + /links in **light and dark** for each candidate. Present the grid; consider the `ideas` skill picker if a side-by-side page works better.
5. The owner may also bring their own hue — support arbitrary values, don't railroad the six.

## Decisions to capture (write them into this file when made)

- [x] **Chosen accent: VIRIDIAN** — light `oklch(0.64 0.135 164.8)` `#00a577`, dark `oklch(0.71 0.124 164.8)` `#44b98e`. Jewel green with a faint blue lean. Picked via an in-browser live picker (a temp `BrandPicker.astro` widget drove `--brand` across logo/signature/selection in both modes; owner compared 12 crafted, named hues + a custom well, then chose).
- [x] **Signature `-Ryan`: BRAND** (`style="color: var(--brand)"`).
- [x] **`::selection`: BRAND-tinted** (`color-mix(in oklch, var(--brand) 22%/32%, transparent)`).

**DONE + committed to `main` (`4a34916`, unpushed).** Consumers: `Navbar.astro` logo stroke, `Signature.astro`, `global.css` `::selection`. All picker scaffolding (`BrandPicker.astro`, Layout import/tag, `--selection-color`/`--signature-color` indirection vars) removed. astro check 0/0/0, build clean.

## Finalize (once picked)

- Keep `--brand` token; wire logo (+ signature/selection per decisions); remove any unchosen scaffolding.
- If the choice is "stay neutral," delete the provisional token and close this plan — that is a valid outcome.

## Verify

Screenshots light + dark of navbar, selection, and any other wired consumer; owner sign-off in chat before commit.
