/**
 * Entrance reveal — fades + rises content in on page load.
 *
 * Elements marked [data-reveal] start hidden (via the `reveal-init` class the
 * inline head script adds before paint) and cascade in once, top to bottom.
 * On article pages the prose body blocks are folded into the same cascade so
 * the whole page enters together — not just the header. Purely load-driven;
 * nothing waits for scroll. Skipped under prefers-reduced-motion (the class is
 * never added), and a CSS failsafe reveals everything if this never runs.
 */
const root = document.documentElement;

if (root.classList.contains("reveal-init")) {
  const STAGGER = 55; // ms between items
  const MAX_STEPS = 10; // cap the cumulative delay so long pages don't drag

  // Article pages: fold the prose body blocks into the cascade (the header and
  // hero image are already marked; skip the back-link anchor).
  const prose = document.querySelector(".prose");
  if (prose) {
    prose
      .querySelectorAll(":scope > *:not(a)")
      .forEach((el) => el.setAttribute("data-reveal", ""));
  }

  // querySelectorAll returns document order, so the cascade follows the page.
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
    el.style.animationDelay = `${Math.min(i, MAX_STEPS) * STAGGER}ms`;
    el.classList.add("is-revealed");
  });
}
