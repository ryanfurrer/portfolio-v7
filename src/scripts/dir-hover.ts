/**
 * Traveling highlight hover tracking
 *
 * Drives a smooth traveling highlight for any list of links marked with
 * `data-dir-hover` inside a `ul`. Two axes are supported:
 *   - "item" → vertical travel (stacked lists, e.g. Item rows)
 *   - "nav"  → horizontal travel (the primary navbar)
 */

const currentHovered = new WeakMap<HTMLUListElement, HTMLAnchorElement>();

const CONFIG = {
  item: { name: "items", axis: "y" as const },
  nav: { name: "nav", axis: "x" as const },
};
type Config = (typeof CONFIG)[keyof typeof CONFIG];

function findItemElement(element: unknown): HTMLAnchorElement | null {
  if (!(element instanceof Element)) return null;
  return element.closest("a[data-dir-hover]");
}

function configFor(item: HTMLAnchorElement): Config {
  const key = item.getAttribute("data-dir-hover");
  return key && key in CONFIG ? CONFIG[key as keyof typeof CONFIG] : CONFIG.item;
}

function findListContainer(element: HTMLAnchorElement): HTMLUListElement | null {
  return element.closest("ul");
}

/**
 * Update the highlight position and visibility for a list.
 *
 * When the highlight was hidden, it first snaps (without transition) to the
 * pointer's entry point along the travel axis — then transitions to the hovered
 * item, so it appears to grow out of wherever the cursor crossed into the list
 * (directional entry). When already visible, it simply slides.
 */
function updateHighlight(
  item: HTMLAnchorElement,
  list: HTMLUListElement,
  cfg: Config,
  entryClient?: number,
): void {
  const itemRect = item.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();

  list.setAttribute("data-dir-hover-list", cfg.name);

  const horizontal = cfg.axis === "x";
  const pos = horizontal
    ? itemRect.left - listRect.left
    : itemRect.top - listRect.top;
  const size = horizontal ? itemRect.width : itemRect.height;
  const extent = horizontal ? listRect.width : listRect.height;
  const listStart = horizontal ? listRect.left : listRect.top;
  const posVar = horizontal ? "--dir-hover-x" : "--dir-hover-y";
  const sizeVar = horizontal ? "--dir-hover-w" : "--dir-hover-h";

  const wasHidden = !currentHovered.has(list);
  if (wasHidden) {
    const rawStart = entryClient != null ? entryClient - listStart : pos + size / 2;
    const startPos = Math.max(0, Math.min(rawStart, extent));
    list.setAttribute("data-dir-snap", "");
    list.style.setProperty(posVar, `${startPos}px`);
    list.style.setProperty(sizeVar, "0px");
    list.style.setProperty("--dir-hover-opacity", "1");
    void list.offsetHeight;
    list.removeAttribute("data-dir-snap");
  }

  list.style.setProperty(posVar, `${pos}px`);
  list.style.setProperty(sizeVar, `${size}px`);
  list.style.setProperty("--dir-hover-opacity", "1");
}

function hideHighlight(list: HTMLUListElement): void {
  list.style.setProperty("--dir-hover-opacity", "0");
}

function handlePointerOver(e: PointerEvent): void {
  // Only respond to mouse/pen, not touch (avoids hover on mobile tap).
  if (e.pointerType === "touch") return;

  const item = findItemElement(e.target);
  if (!item) return;

  const list = findListContainer(item);
  if (!list) return;

  if (currentHovered.get(list) === item) return;

  const cfg = configFor(item);
  const entry = cfg.axis === "x" ? e.clientX : e.clientY;
  updateHighlight(item, list, cfg, entry);
  currentHovered.set(list, item);
}

function handlePointerLeave(e: PointerEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest("ul[data-dir-hover-list]");
  if (!list) return;

  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list as HTMLUListElement);
    currentHovered.delete(list as HTMLUListElement);
  }
}

function handleFocusIn(e: FocusEvent): void {
  const item = findItemElement(e.target);
  if (!item) return;

  const list = findListContainer(item);
  if (!list) return;

  updateHighlight(item, list, configFor(item));
  currentHovered.set(list, item);
}

function handleFocusOut(e: FocusEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest("ul[data-dir-hover-list]");
  if (!list) return;

  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list as HTMLUListElement);
    currentHovered.delete(list as HTMLUListElement);
  }
}

let initialized = false;

function initializeListeners(): void {
  document.body.setAttribute("data-dir-hover-active", "");

  document.addEventListener("pointerover", handlePointerOver, true);
  document.addEventListener("pointerleave", handlePointerLeave, true);
  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("focusout", handleFocusOut, true);
}

/**
 * Initialize the traveling hover effect once the DOM is ready (idempotent).
 */
export function initDirHoverOnce(): void {
  if (initialized) return;
  initialized = true;

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initializeListeners();
  } else {
    document.addEventListener("DOMContentLoaded", initializeListeners, {
      once: true,
    });
  }
}

initDirHoverOnce();
