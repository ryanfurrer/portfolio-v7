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

- [ ] Chosen accent (oklch + hex, light + dark values) — or "stay neutral"
- [ ] Signature `-Ryan`: brand or stay ink?
- [ ] `::selection`: brand-tinted or keep current translucent gray?

## Finalize (once picked)

- Keep `--brand` token; wire logo (+ signature/selection per decisions); remove any unchosen scaffolding.
- If the choice is "stay neutral," delete the provisional token and close this plan — that is a valid outcome.

## Verify

Screenshots light + dark of navbar, selection, and any other wired consumer; owner sign-off in chat before commit.
