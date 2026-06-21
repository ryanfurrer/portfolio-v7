/**
 * Traveling highlight hover tracking for Item components
 *
 * This script enables a smooth traveling highlight effect when hovering over
 * items marked with `data-dir-hover="item"` within list containers.
 */

const currentHovered = new WeakMap<HTMLUListElement, HTMLAnchorElement>();

/**
 * Find the closest item element from a given element
 */
function findItemElement(element: unknown): HTMLAnchorElement | null {
  if (!(element instanceof Element)) return null;
  return element.closest('a[data-dir-hover="item"]');
}

/**
 * Find the closest list container from an item element
 */
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

/**
 * Hide the highlight for a list
 */
function hideHighlight(list: HTMLUListElement): void {
  list.style.setProperty("--dir-hover-opacity", "0");
}

/**
 * Handle pointer over events
 */
function handlePointerOver(e: PointerEvent): void {
  // Only respond to mouse/pen, not touch (avoids hover on mobile tap)
  if (e.pointerType === "touch") return;

  const item = findItemElement(e.target);
  if (!item) return;

  const list = findListContainer(item);
  if (!list) return;

  // Skip if we're already hovering this item
  const currentlyHovered = currentHovered.get(list);
  if (currentlyHovered === item) return;

  updateHighlight(item, list, e.clientY);
  currentHovered.set(list, item);
}

/**
 * Handle pointer leave events
 */
function handlePointerLeave(e: PointerEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest('ul[data-dir-hover-list="items"]');
  if (!list) return;

  // Check if we're leaving the list entirely
  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list);
    currentHovered.delete(list);
  }
}

/**
 * Handle focus in events
 */
function handleFocusIn(e: FocusEvent): void {
  const item = findItemElement(e.target);
  if (!item) return;

  const list = findListContainer(item);
  if (!list) return;

  updateHighlight(item, list);
  currentHovered.set(list, item);
}

/**
 * Handle focus out events
 */
function handleFocusOut(e: FocusEvent): void {
  if (!(e.target instanceof Element)) return;
  const list = e.target.closest('ul[data-dir-hover-list="items"]');
  if (!list) return;

  // Check if focus is leaving the list entirely
  const relatedTarget = e.relatedTarget;
  if (!relatedTarget || !list.contains(relatedTarget)) {
    hideHighlight(list);
    currentHovered.delete(list);
  }
}

let initialized = false;

/**
 * Actually initialize the event listeners
 */
function initializeListeners(): void {
  // Mark body so CSS fallback doesn't apply when JS is active
  document.body.setAttribute("data-dir-hover-active", "");

  document.addEventListener("pointerover", handlePointerOver, true);
  document.addEventListener("pointerleave", handlePointerLeave, true);
  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("focusout", handleFocusOut, true);
}

/**
 * Initialize the traveling hover effect (idempotent)
 *
 * Sets up event listeners for pointer and focus events to enable
 * the traveling highlight effect on items with `data-dir-hover="item"`.
 * Waits for DOM to be ready before initializing.
 */
export function initDirHoverOnce(): void {
  if (initialized) return;
  initialized = true;

  // Check if DOM is already ready
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // DOM is ready, initialize immediately
    initializeListeners();
  } else {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", initializeListeners, {
      once: true,
    });
  }
}

// Self-initialize when module is loaded
initDirHoverOnce();

