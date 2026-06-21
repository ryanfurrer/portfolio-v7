/**
 * Sticky site header — reveal-on-scroll chrome.
 *
 * The header is transparent at the top of the page, then gains a translucent
 * blurred background + hairline bottom border once the page scrolls. State is
 * driven by an IntersectionObserver on a 1px top sentinel (no scroll listener,
 * so no per-frame work), toggling `data-scrolled` for the CSS to react to.
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
}
