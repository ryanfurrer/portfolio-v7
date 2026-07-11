# 001 — Fix "Me" nav item hover (missing shadow, light mode)

**Batch:** 1 (mechanical) · **Effort:** ~5 min · **User input:** none

> Line refs are from `main` @ `e647f5e` (2026-07-11). Re-grep before editing if the tree has moved.

## Diagnosis

The primary nav items (`Navbar.astro:68-86`) are plain `<a>` elements whose light-mode hover pill is drawn by the shared dir-hover pseudo-element (`ul[data-dir-hover-list="nav"]::before`, `global.css:750-768`), which applies **both** `background-color: var(--nav-hover)` **and** `box-shadow: var(--nav-hover-shadow)` (a whisper shadow + hairline inset ring, defined `global.css:324`).

The "Me" item is a Radix `NavigationMenuTrigger` (`NavMenu.tsx:43-53`), not an `<a data-dir-hover>`, so the pseudo-element never covers it. It paints its own hover via `hover:bg-nav-hover` (`NavMenu.tsx:51`) — background only, **no shadow**. Result: in light mode "Me" hovers flat while siblings get the raised pill. Dark mode matches by accident because `--nav-hover-shadow: none` there (`global.css:401`).

## Change

In `src/components/NavMenu.tsx` (~line 51), add the shadow to the trigger's hover and open states, alongside the existing `hover:bg-nav-hover` / `data-[state=open]:bg-nav-hover`:

```
hover:[box-shadow:var(--nav-hover-shadow)]
data-[state=open]:[box-shadow:var(--nav-hover-shadow)]
```

Notes:
- Use the arbitrary-property form `[box-shadow:var(--nav-hover-shadow)]` (there is no shadow utility mapped to this token).
- If plan 003 has already collapsed `--nav-hover-shadow` into `--surface-raised-shadow`, reference the surviving token.
- Dark mode needs no gating — the token is `none` in `.dark`.
- Do NOT try to fold the trigger into the dir-hover system; it's a Radix component and the pseudo-element travel logic assumes anchors. The token-based shadow keeps them visually identical without coupling.

## Acceptance criteria

- Light mode: hovering "Me" shows the identical white pill + subtle shadow + hairline inset ring as hovering "Writing"/"Work"/etc.
- Open state (`data-[state=open]`) shows the same treatment.
- Dark mode unchanged.

## Verify

Start the dev server (`.claude/launch.json`; binds IPv6 `[::1]`), browser: hover "Me" vs a sibling item in light mode; screenshot both states. Toggle `.dark` and confirm no regression.
