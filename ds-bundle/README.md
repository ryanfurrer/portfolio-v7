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

## Theme: neutral palette + one brand hue

A **neutral Apple-style palette** — near-black ink on an **off-white canvas**
(`--background`), with **white cards lifting above it** (`--surface-raised`,
`.card-raised`). Express interactivity with ink weight, faint neutral washes
(`--nav-hover`, `--nav-active`), and elevation — never color.

The one exception is **`--brand` (viridian)**: the single reserved hue, used for
the logo mark, the signature, and the text-**selection** tint. It is *never*
used for text or UI contrast (no APCA constraint) — keep it out of body/UI text.

Dark mode is a **class toggle**: add `class="dark"` to a root ancestor and every
token flips.

## Tokens

**Color** (`tokens/colors.css`)
- Ground: `--background` (off-white canvas)
- Text hierarchy: `--foreground` (headings/key copy) · `--foreground-muted`
  (body) · `--foreground-subtle` (captions/meta/markers)
- Surfaces: `--surface`, `--surface-hover` (recessed) · `--surface-raised`,
  `--surface-raised-shadow` (white rows/cards lifted above the canvas)
- Links/accent: `--link`, `--link-hover` (the ink itself)
- Brand: `--brand` (viridian — logo, signature, selection tint; not for text)
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
- `.small-heading` — small uppercase **Berkeley Mono** eyebrow label (13px).
- `.badge` — neutral metadata pill ("Updated", year chips).
- `.quiet-link` — muted nav/footer/ToC link, no underline, foreground on hover.
- `.card-raised` — white card lifted above the gray canvas (hairline ring + soft
  shadow); lifts further on hover. The signature "card on the canvas" surface.

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

Card on the canvas:
```html
<a class="card-raised no-underline" href="#"
   style="display: block; padding: 1rem 1.25rem; border-radius: var(--radius-xl);">
  <span class="small-heading">Writing</span>
  <h3 style="font-size: var(--text-xl); margin: 0.25rem 0 0;">A recent post</h3>
  <p style="color: var(--foreground-muted); margin: 0.375rem 0 0;">
    One muted line of supporting copy.</p>
</a>
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
