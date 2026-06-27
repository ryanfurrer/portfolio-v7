/**
 * Sticky site header — reveal-on-scroll chrome.
 *
 * The header is transparent at the top of the page, then gains a translucent
 * blurred background + hairline bottom border once the page scrolls. The
 * `data-scrolled` state is driven by an IntersectionObserver on a 1px top
 * sentinel (no scroll listener for that part).
 *
 * It also auto-hides: scrolling down slides the header out of view, scrolling
 * up brings it back. That part needs scroll direction, so it uses a passive,
 * rAF-throttled scroll listener toggling `data-hidden`.
 */
const header = document.querySelector<HTMLElement>("[data-site-header]");

if (header) {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText =
    "position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;";
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.toggleAttribute("data-scrolled", !entry.isIntersecting);
    },
    { threshold: 0 },
  );
  observer.observe(sentinel);

  // Auto-hide on scroll down, reveal on scroll up.
  const DELTA = 6; // ignore sub-pixel jitter
  const REVEAL_AT = 80; // always show this close to the top
  const UP_THRESHOLD = 32; // deadspace: must scroll up this far before revealing
  let lastY = window.scrollY;
  let upDistance = 0; // cumulative upward scroll since last downward move
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const diff = y - lastY;
    lastY = y;
    if (Math.abs(diff) <= DELTA) return;
    if (diff > 0) {
      // Scrolling down: hide, and reset the upward accumulator.
      upDistance = 0;
      if (y > REVEAL_AT) header.toggleAttribute("data-hidden", true);
    } else {
      // Scrolling up: only reveal once enough deadspace has accumulated.
      upDistance -= diff;
      if (upDistance > UP_THRESHOLD || y <= REVEAL_AT) {
        header.toggleAttribute("data-hidden", false);
      }
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}
