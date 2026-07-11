# 008 — Unify Cta + BackLink + CompanyHeader CTA into `CtaLink`

**Batch:** 3 (engineering) · **Effort:** ~1.5 hr · **User input:** name sign-off only (default: `CtaLink.astro`)

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Diagnosis

Three "text + traveling arrow" links exist, all different:

1. **The "Cta"** = `src/components/Link.astro` (no `.cta` class exists; it's a component). Hover: `text-foreground-muted → text-foreground`, label underline **wipe** (gradient background `0%_1.5px → 100%_1.5px`, 200ms ease-out), Lucide `arrow-right` sliding `translate-x-1` (150ms `ease-ios`), `active:scale-[0.98]`, `motion-reduce` guards. Call sites: `LatestItemsSection.astro:39`, `index.astro:42`.
2. **BackLink** (`src/components/BackLink.astro`): hand-drawn **chevron-left** (not Lucide-arrow), color `text-link → text-link-hover` only (different token pair!), icon travels `-translate-x-0.5` (smaller), **no underline wipe**. Carries `data-back` + `data-back-label` consumed by the referrer-aware back script (`work/[slug].astro:148-150` — preserve that behavior). Call sites (desktop + `lg:hidden` mobile pair each): `appearances/[slug].astro:59,67`, `work/[slug].astro:71,79`, `work/companies/[company].astro:58,62`, `writing/[slug].astro:54,62`.
3. **Hand-rolled clone** in `CompanyHeader.astro:46-59` ("Visit website"): unicode `→`, `translate-x-0.5`, `text-link` tokens.

## Design decisions (approved 2026-07-11 — build to these)

- **One component, rename to `CtaLink.astro`** (delete/rename `Link.astro` — the name collides with the HTML concept anyway). If the owner objects to the name in review, `ArrowLink` is the fallback; ask only at review time, don't block.
- **`direction: "forward" | "back" | "external"`** (default `forward`) is THE api:
  - `forward` → Lucide `arrow-right`, trailing, hover `translate-x-1`
  - `back` → Lucide `arrow-left` (**arrow, not chevron** — owner decision), leading, hover `-translate-x-1` (unified magnitude with forward)
  - `external` → Lucide `arrow-up-right`, trailing, hover `translate-x-0.5 -translate-y-0.5` (the /uses diagonal spec; see plan 004)
- **One color pair for all: `text-foreground-muted → text-foreground`** (the Cta's). The `text-link`/`text-link-hover` pair drops out of these components (do not delete the tokens — body links may use them; that's plan 012's audit).
- **Underline wipe on all directions** — same component, same identity. (The wipe is what earns the "Cta" name; back links inherit it for coherence.)
- Keep: `active:scale-[0.98]`, `can-hover:` gating on all hover motion, `motion-reduce` guards, focus-visible parity with hover, auto `rel="noopener noreferrer"` when `target="_blank"`.

## Human-readability rules (owner requirement — hard constraints)

- **≤ 5 props**: `href`, `direction`, `class`, plus label via `<slot>`, plus `...rest` (typed `HTMLAttributes<'a'>`, NOT `[key: string]: any`). If you find yourself needing a 6th semantic prop, stop and keep BackLink as a thin wrapper instead.
- No icon-slot polymorphism, no factories. The three arrows are three explicit inline SVG branches a human can read top-to-bottom.
- When `direction="back"`, emit `data-back` and `data-back-label` exactly as BackLink does today (the back-script contract). A one-line comment noting the consumer (`work/[slug].astro` referrer script) is load-bearing — include it.

## Migration

1. Build `CtaLink.astro`. 2. Swap the 2 Link call sites (`direction` omitted). 3. Swap the 8 BackLink instances (`direction="back"`; keep the desktop/mobile duplication as-is — layout concern, not this plan's). 4. Replace CompanyHeader's inline CTA with `<CtaLink direction="external">` (supersedes plan 004's CompanyHeader row if not yet done). 5. Delete `BackLink.astro` and old `Link.astro`. 6. `grep -rn "BackLink\|from.*components/Link" src/` → zero hits.

## Acceptance criteria

- All 11 call sites render with unified motion/color; back-navigation still respects referrer logic on work posts (click a company page → work post → back link returns to company).
- `astro check` clean. No chevron SVG remains.

## Verify

Dev server: home ("Learn more"), a writing post (back link, both viewport sizes), a work post via company hub (referrer back behavior), company hub "Visit website" (diagonal arrow). Reduced-motion spot check (`emulate prefers-reduced-motion`): no transform motion, color still transitions.
