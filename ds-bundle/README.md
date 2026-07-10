# portfolio-v7 — Design System (tokens + patterns)

The design language of Ryan Furrer's portfolio, extracted so the design agent
builds UI that is **1:1 with the live site**. Everything here is plain,
self-contained CSS — no Tailwind build is required for it to render exactly as
it does on the site.

## The idiom

Style with the **`var(--*)` tokens** and the **named pattern classes** below —
that is how the site itself is built. There is no component bundle; compose
layout with your own flexbox/grid and reach for these tokens and classes for
anything brand-specific. (If Tailwind is available in your environment, its
arbitrary-value syntax works too, e.g. `bg-[var(--surface)]`,
`text-[var(--foreground)]`, `rounded-[var(--radius-lg)]`.)

Read the source before styling — the files ARE the spec:
`styles.css` (entry) → `tokens/*.css` and `patterns/*.css`.

## Theme: neutral ink

There is **no brand hue**. The accent *is* the foreground — near-black in
light, near-white in dark. Express interactivity with ink weight and faint
neutral washes (`--nav-hover`, `--nav-active`), never with color. Dark mode is
a **class toggle**: add `class="dark"` to a root ancestor and every token flips.

## Tokens

**Color** (`tokens/colors.css`)
- Ground: `--background`
- Text hierarchy: `--foreground` (headings/key copy) · `--foreground-muted`
  (body) · `--foreground-subtle` (captions/meta/markers)
- Surfaces: `--surface`, `--surface-hover`
- Links/accent: `--link`, `--link-hover` (the ink itself)
- Nav washes: `--nav-active`, `--nav-hover` · Pill: `--badge`, `--badge-foreground`
- shadcn set: `--card`, `--popover`, `--primary`, `--secondary`, `--muted`,
  `--accent`, `--destructive` (+ `-foreground` pairs)
- Hairlines: `--border`, `--input` · Focus: `--ring`

**Type** (`tokens/typography.css`)
- Families: `--font-sans` (Geist) · `--font-mono` (Berkeley Mono) ·
  `--font-cursive` (Permanent Marker — accent only, use sparingly)
- Scale: `--text-xs … --text-4xl`, plus `--text-lead` (the standfirst step)
- Leading: `--leading-tight/snug/normal/lead`
- Tracking is **size-specific**: `--tracking-display` / `--tracking-heading`
  (negative, headings) · `--tracking-lead` · `--tracking-normal` (body) ·
  `--tracking-label` (positive, small uppercase eyebrows)

**Radius / elevation / motion** (`tokens/radius-elevation.css`)
- Radius derives from `--radius` (0.375rem): `--radius-sm … --radius-4xl`.
- `--shadow-elevated` is a **light-mode** device — pair with a hairline ring,
  never a solid border; flattens to `none` in dark.
- Two motion curves only: `--ease-out-curve` (150ms micro press/hover) ·
  `--ease-ios-curve` (250–340ms overlay/drawer settle).

## Patterns

**Base** (`patterns/base.css`) — applied by element, no class needed:
- Headings `h1–h6`: extrabold (800), tight tracking, balanced wrap.
- Body links `a` (opt out with `class="no-underline"`): foreground ink + faint
  underline, deepening on hover.
- One keyboard **focus ring** (2px gap + 2px `--ring`) on every interactive el.
- `.font-mono-custom` (tabular mono label) · `.squircle` (squircle corners).

**Named classes** (`patterns/components.css`):
- `.lead` — standfirst / dek: the one larger, muted editorial step above body.
- `.small-heading` — small uppercase eyebrow label.
- `.badge` — neutral metadata pill ("Updated", year chips).
- `.quiet-link` — muted nav/footer/ToC link, no underline, foreground on hover.

**Article body** (`patterns/prose.css`) — wrap long-form content in
`<div class="prose">` for the full writing/work/about typography: rhythm,
heading scale, lists, inline-code pills, fenced code blocks, upright
blockquotes, hairline-bordered media, rules, and tables — all tokenized and
dark-mode aware.

## Idiomatic snippets

Page header:
```html
<header style="max-width: 46ch;">
  <h1 style="font-size: var(--text-4xl); letter-spacing: var(--tracking-display);">
    Ryan Furrer
  </h1>
  <p class="lead">I feel at home where design and engineering meet. Crafting
    interfaces down to the last detail.</p>
  <span class="small-heading">Find me elsewhere:</span>
</header>
```

Article body:
```html
<article class="prose">
  <h1>Building interfaces that feel alive</h1>
  <p class="lead">A larger, muted standfirst that sets the piece up.</p>
  <p>Body copy at the muted step, with an <a href="#">inline link</a> and some
    <code>inline code</code>.</p>
  <blockquote>A quiet, upright pull-quote.</blockquote>
  <span class="badge">Updated Jul 2026</span>
</article>
```

## Not included (needs JS / React, out of scope for CSS tokens)

The site's entrance reveal (`[data-reveal]`) and traveling-highlight hover
(`[data-dir-hover-list]`) are script-driven and intentionally omitted — designs
render fully visible without them. shadcn components (buttons, nav menu,
dropdown, sheet, tooltip) are React and not shipped here; build those with the
tokens above so they match.
