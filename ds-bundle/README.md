# portfolio-v7 — Design System (tokens + patterns)

The design language of Ryan Furrer's portfolio, extracted so the design agent
builds UI that is **1:1 with the live site**. Everything here is plain,
self-contained CSS — no Tailwind build is required for it to render exactly as
it does on the site.

## The idiom

Style with the **`var(--*)` tokens** and the **named pattern classes** below —
that is how the site itself is built. There is no component bundle; compose
layout with your own flexbox/grid and reach for these tokens and classes for
anything brand-specific. The site sizes type with the **default utility scale**
(no custom `--text-*` tokens) and only overrides the specifics noted below, so
use ordinary font-size utilities/values for scale. (If Tailwind is available,
its arbitrary-value syntax works too, e.g. `bg-[var(--muted)]`,
`text-[var(--foreground)]`, `rounded-[var(--radius-lg)]`.)

Read the source before styling — the files ARE the spec:
`styles.css` (entry) → `tokens/*.css` and `patterns/*.css`.

## Theme: cool-neutral shadcn palette + one brand hue

A **shadcn-based neutral palette** with slightly **cool** neutrals (hue 286 — a
faint blue undertone, not dead gray). In **light**, the page and cards are
**pure white**; separation comes from a **recessed `--muted` container** step,
translucent **hairlines** (`--border`/`--input`), and a soft **`--shadow-elevated`**
(a light-mode device — flattened in dark). Express interactivity with ink weight,
faint neutral washes, and elevation — **never color**.

Elevation reads relative to each element's own background: a row inside a
`--muted` container lifts to a white `--card` (`--item-hover`); a nav item on the
page recesses to a `--muted` chip (`--nav-hover`).

The one hue is **`--brand` — orange `#F05A29`** (same in both themes): the logo
mark, signature, tints, and the text-**selection** fill (a *solid* brand fill
with dark ink). It is *never* used for text or UI contrast — keep it out of
body/UI text.

Dark mode is a **class toggle**: add `class="dark"` to a root ancestor and every
token flips.

## Tokens

**Color** (`tokens/colors.css`)
- Ground / raised: `--background`, `--card`, `--popover` (all white in light)
- Text tiers (three): `--foreground` (strong) · `--subtle-foreground` (mid —
  body/descriptions, clears AA at small sizes) · `--muted-foreground` (light —
  large/secondary text only; deliberately sub-AA at small sizes)
- Action fills: `--primary` / `--primary-foreground` / `--primary-hover` ·
  `--secondary` / `--secondary-foreground` / `--secondary-hover`
- Surfaces: `--muted` (recessed container) · `--accent` / `--accent-foreground`
  (the neutral hover/focus/active surface — ghost buttons, hovered rows, menus) ·
  `--destructive`
- Brand: `--brand` (orange — mark, signature, tints, selection; not for text)
- Elevation helpers: `--item-hover`, `--nav-hover`, `--surface-raised-shadow`,
  `--nav-hover-shadow`
- Hairlines (translucent, never tinted): `--border`, `--input` · Focus: `--ring`

**Type** (`tokens/typography.css`)
- Families: `--font-sans` (**Google Sans**) · `--font-mono` (**Berkeley Mono**) ·
  `--font-cursive` (**Permanent Marker** — signature only, use sparingly)
- No `--text-*` scale token: use the default size scale. The site's specifics:
  headings weigh **600** with **-0.022em** tracking (display H1 tightens to
  **-0.03em**); body is **1rem**; the standfirst `.lead` is **1.2rem**; small
  mono eyebrows (`.small-heading`) are **13px**.

**Radius / elevation / motion** (`tokens/radius-elevation.css`)
- Radius derives from `--radius` (**0.5rem / 8px**): `--radius-sm … --radius-4xl`.
- `--shadow-elevated` is a **light-mode** device — pair with a hairline ring,
  never a solid border; flattens to `none` in dark.
- Two motion curves only: `--ease-out-curve` (entrances/exits, micro
  press/hover) · `--ease-ios-curve` (playful zoom/overlay settle).
- Corners are **superellipse site-wide** (`corner-shape: squircle` on
  everything; `.rounded-full` stays truly round). Progressive — ignored where
  unsupported.

## Patterns

**Base** (`patterns/base.css`) — applied by element, no class needed:
- Headings `h1–h6`: weight 600, -0.022em tracking, balanced wrap.
- Body links `a` (opt out with `class="no-underline"`): inherit the surrounding
  ink + a faint underline, deepening on hover.
- One keyboard **focus ring** (2px gap + 2px solid `--ring`) on every
  interactive element.
- `.font-mono-custom` (tabular mono label) · `.squircle` (squircle corners).

**Named classes** (`patterns/components.css`):
- `.lead` — standfirst / dek: the one larger, mid-ink editorial step above body.
- `.small-heading` — small uppercase **Berkeley Mono** eyebrow label (13px).
- `.quiet-link` — muted nav/footer/ToC link, no underline, foreground on hover.
- `.card-raised` — white card lifted above the canvas (hairline ring + soft
  shadow); lifts further on hover. The signature "card on the canvas" surface.

**Article body** (`patterns/prose.css`) — wrap long-form content in
`<div class="prose">` for the full writing/work/about typography: rhythm,
heading scale, lists, inline-code pills, recessed code blocks, upright
blockquotes, hairline-bordered media, rules, and tables — all tokenized and
dark-mode aware.

## Idiomatic snippets

Page header:
```html
<header style="max-width: 46ch;">
  <h1 style="font-size: 2.25rem; letter-spacing: -0.03em;">Ryan Furrer</h1>
  <p class="lead">I feel at home where design and engineering meet. Crafting
    interfaces down to the last detail.</p>
  <span class="small-heading">Find me elsewhere:</span>
</header>
```

Card on the canvas (page → muted container → white card):
```html
<section style="background: var(--muted); padding: 1.5rem; border-radius: var(--radius-2xl);">
  <a class="card-raised no-underline" href="#"
     style="display: block; padding: 1rem 1.25rem; border-radius: var(--radius-xl);">
    <span class="small-heading">Writing</span>
    <h3 style="font-size: 1.25rem; margin: 0.25rem 0 0;">A recent post</h3>
    <p style="color: var(--subtle-foreground); margin: 0.375rem 0 0;">
      One line of supporting copy.</p>
  </a>
</section>
```

Article body:
```html
<article class="prose">
  <h1>Building interfaces that feel alive</h1>
  <p class="lead">A larger, mid-ink standfirst that sets the piece up.</p>
  <p>Body copy at the subtle step, with an <a href="#">inline link</a> and some
    <code>inline code</code>.</p>
  <blockquote>A quiet, upright pull-quote.</blockquote>
</article>
```

## Not included (needs JS / React, out of scope for CSS tokens)

The site's entrance reveal (`[data-reveal]`), hero line-reveal, and traveling-
highlight hover (dir-hover) are script-driven and intentionally omitted — designs
render fully visible without them. shadcn React components (buttons, nav menu,
dropdown, sheet, tooltip) are not shipped here; build those with the tokens above
so they match. The dormant `--chart-*` / `--sidebar-*` token sets exist in the
site's source but render on no surface, so they are omitted too.
