/**
 * Traveling highlight hover tracking for Item components
 *
 * Enables a smooth traveling highlight when hovering over items marked with
 * `data-dir-hover="item"` within list containers.
 */

const currentHovered = new WeakMap<HTMLUListElement, HTMLAnchorElement>();

function findItemElement(element: unknown): HTMLAnchorElement | null {
  if (!(element instanceof Element)) return null;
  return element.closest('a[data-dir-hover="item"]');
}

function findListContainer(element: HTMLAnchorElement): HTMLUListElement | null {
  return element.closest("ul");
}

/**
 * Update the highlight position and visibility for a list.
 *
 * When the highlight was hidden, it first snaps (without transition) to the
 * pointer's entry point — `entryClientY` — then transitions to the hovered
 * item, so it appears to grow out of wherever the cursor crossed into the
 * list (directional entry). When already visible, it simply slides.
 */
function updateHighlight(
  item: HTMLAnchorElement,
  list: HTMLUListElement,
  entryClientY?: number,
): void {
  const itemRect = item.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();

  const y = itemRect.top - listRect.top;
  const h = itemRect.height;

  list.setAttribute("data-dir-hover-list", "items");

  const wasHidden = !currentHovered.has(list);
  if (wasHidden) {
    // Clamp the entry point within the list so the seed never starts outside.
    const rawStart =
      entryClientY != null ? entryClientY - listRect.top : y + h / 2;
    const startY = Math.max(0, Math.min(rawStart, listRect.height));
    list.setAttribute("data-dir-snap", "");
    list.style.setProperty("--dir-hover-y", `${startY}px`);
    list.style.setProperty("--dir-hover-h", "0px");
    list.style.setProperty("--dir-hover-opacity", "1");
    // Force a reflow so the seeded position applies before we re-enable the
    // transition and move to the target.
    void list.offsetHeight;
    list.removeAttribute("data-dir-snap");
  }

  list.style.setProperty("--dir-hover-y", `${y}px`);
  list.style.setProperty("--dir-hover-h", `${h}px`);
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

  updateHighlight(item, list, e.clientY);
  currentHovered.set(list, item);
}

function handlePointerLeave(e: PointerEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest('ul[data-dir-hover-list="items"]');
  if (!list) return;

  // Only hide once the pointer leaves the list entirely.
  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list);
    currentHovered.delete(list);
  }
}

function handleFocusIn(e: FocusEvent): void {
  const item = findItemElement(e.target);
  if (!item) return;

  const list = findListContainer(item);
  if (!list) return;

  updateHighlight(item, list);
  currentHovered.set(list, item);
}

function handleFocusOut(e: FocusEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest('ul[data-dir-hover-list="items"]');
  if (!list) return;

  // Only hide once focus leaves the list entirely.
  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list);
    currentHovered.delete(list);
  }
}

let initialized = false;

function initializeListeners(): void {
  // Mark body so the CSS hover fallback doesn't apply when JS is active.
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
