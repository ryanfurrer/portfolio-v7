/**
 * Click-to-zoom for content images, built on the native `<dialog>` element so
 * focus trapping, Esc-to-close, the inert background and focus return come for
 * free. Progressive enhancement: without JS the image still renders inline.
 *
 * Where the thumbnail and the enlarged image share framing (body images, marked
 * `data-zoom-flip`), the enlarged image is FLIP-animated so it grows out of the
 * clicked thumbnail and collapses back onto it — object permanence. Elsewhere
 * (the cropped article header, whose zoom reveals a differently-framed photo) and
 * under `prefers-reduced-motion`, it falls back to the pure-CSS centre fade in
 * `.image-zoom-dialog` (global.css).
 *
 * One dialog is created lazily and reused for every image; clicks are delegated
 * from the document so images added later (e.g. live draft preview) still work.
 */

const ZOOM_ATTR = "data-zoom-src";
const FLIP_ATTR = "data-zoom-flip";
const ENTER_MS = 240;
const EXIT_MS = 160;
// --ease-ios: a strong asymmetric ease-out, matching the CSS lightbox timing.
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

let dialog: HTMLDialogElement | null = null;
let dialogImg: HTMLImageElement | null = null;
let dialogCaption: HTMLElement | null = null;
let initialized = false;
let openRequest = 0;

// The thumbnail the current zoom grew from (hidden while open so there's only
// one copy on screen) and the in-flight FLIP animation, kept so the exit can
// collapse the image back onto the thumbnail and so opens/closes interrupt cleanly.
let activeThumb: HTMLElement | null = null;
let currentAnim: Animation | null = null;
let pendingFrame: number | null = null;
let flipActive = false;

const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

interface Box {
  width: number;
  height: number;
  left: number;
  top: number;
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cancelPendingFrame(): void {
  if (pendingFrame === null) return;
  cancelAnimationFrame(pendingFrame);
  pendingFrame = null;
}

function finishReveal(trigger: HTMLElement): void {
  const reveal = trigger.closest<HTMLElement>("[data-reveal]");
  if (!reveal || getComputedStyle(reveal).animationName !== "reveal-rise")
    return;

  // The zoom becomes this image's entrance once the reader clicks it. Finish the
  // load reveal first so two independent transforms cannot compete for its origin.
  reveal.getAnimations().forEach((animation) => animation.finish());
}

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;

  dialog = document.createElement("dialog");
  dialog.className = "image-zoom-dialog";
  dialog.innerHTML = `
    <img class="image-zoom-dialog__img" alt="" decoding="async" />
    <p class="image-zoom-dialog__caption"></p>
    <button type="button" class="image-zoom-dialog__close" aria-label="Close">${CLOSE_ICON}</button>
  `;
  dialogImg = dialog.querySelector("img");
  dialogCaption = dialog.querySelector(".image-zoom-dialog__caption");

  // A click on the dialog itself (the area around the image) reads as a click on
  // the backdrop — close on it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) requestClose();
  });
  dialog
    .querySelector(".image-zoom-dialog__close")
    ?.addEventListener("click", () => requestClose());

  // Esc dispatches a native cancel→close; intercept so the collapse can play.
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });

  dialog.addEventListener("close", cleanupAfterClose);

  document.body.append(dialog);
  return dialog;
}

// contain-fit an aspect ratio inside the dialog's padded viewport box. Derived
// from the thumbnail's own aspect (identical to the zoom image for FLIP triggers),
// so it never depends on the enlarged image having laid out yet.
function finalBox(aspect: number): Box {
  const cs = getComputedStyle(dialog!);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const availW = window.innerWidth - padX;
  const availH = window.innerHeight - padY;

  let width = availW;
  let height = width / aspect;
  if (height > availH) {
    height = availH;
    width = height * aspect;
  }
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

// The transform that maps `to` back onto `from` (FLIP "invert"), from a top-left
// origin. Uniform scale — only used where from/to share an aspect ratio.
function invert(from: DOMRect | Box, to: Box): string {
  const scale = from.width / to.width;
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}

async function openZoom(trigger: HTMLElement): Promise<void> {
  const src = trigger.getAttribute(ZOOM_ATTR);
  if (!src) return;

  const request = ++openRequest;
  const active = ensureDialog();
  const thumb = trigger.querySelector("img");

  // FLIP images are already served at their intrinsic size, so reuse the exact
  // decoded resource on screen. Fetching their equivalent zoom URL on click can
  // leave the new <img> empty for one paint when the cache is cold.
  const displaySrc =
    trigger.hasAttribute(FLIP_ATTR) && thumb
      ? thumb.currentSrc || thumb.src
      : src;
  dialogImg!.src = displaySrc;
  const resolvedSrc = dialogImg!.src;
  dialogImg!.alt = trigger.getAttribute("data-zoom-alt") ?? "";

  const caption = trigger.getAttribute("data-zoom-caption") ?? "";
  dialogCaption!.textContent = caption;
  active.classList.toggle("has-caption", caption.length > 0);

  flipActive = false;
  activeThumb = null;
  cancelPendingFrame();
  currentAnim?.cancel();
  currentAnim = null;

  try {
    await dialogImg!.decode();
  } catch {
    // A failed decode still falls through so the browser can render its normal
    // broken-image state instead of leaving the click inert.
  }
  if (request !== openRequest || dialogImg!.src !== resolvedSrc) return;

  finishReveal(trigger);
  document.documentElement.style.overflow = "hidden";

  const firstRect = thumb?.getBoundingClientRect();
  const canFlip =
    trigger.hasAttribute(FLIP_ATTR) &&
    !reducedMotion() &&
    !!firstRect &&
    firstRect.width > 0 &&
    firstRect.height > 0;

  if (canFlip) {
    flipActive = true;
    activeThumb = thumb!;
    // JS owns the image transform here — neutralise the CSS centre-fade enter so
    // the two don't compose, and hide the source so only one copy is on screen.
    dialogImg!.style.opacity = "1";
    dialogImg!.style.scale = "1";
    dialogImg!.style.transformOrigin = "top left";

    const last = finalBox(firstRect!.width / firstRect!.height);
    const startTransform = invert(firstRect!, last);
    // Keep the thumbnail painted until its dialog copy has joined the top layer.
    // Their first frame overlaps exactly, avoiding a blank handoff frame.
    dialogImg!.style.transform = startTransform;
    active.showModal();
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = null;
      if (
        !active.open ||
        active.classList.contains("is-closing") ||
        activeThumb !== thumb
      )
        return;

      thumb!.style.visibility = "hidden";
      currentAnim = dialogImg!.animate(
        [{ transform: startTransform }, { transform: "none" }],
        { duration: ENTER_MS, easing: EASE },
      );
      dialogImg!.style.transform = "";
    });
  } else {
    active.showModal();
  }
}

function requestClose(): void {
  const active = dialog;
  if (!active || !active.open || active.classList.contains("is-closing"))
    return;

  cancelPendingFrame();

  if (flipActive && activeThumb) {
    const firstRect = activeThumb.getBoundingClientRect();
    const lastRect = dialogImg!.getBoundingClientRect();
    // Only collapse back if the thumbnail is still on screen (the reader may have
    // scrolled it away); otherwise a plain fade reads better than flying off.
    const onScreen =
      firstRect.width > 0 &&
      firstRect.bottom > 0 &&
      firstRect.top < window.innerHeight;

    if (onScreen && lastRect.width > 0) {
      const startTransform = getComputedStyle(dialogImg!).transform;
      active.classList.add("is-closing");
      currentAnim?.cancel();
      currentAnim = dialogImg!.animate(
        [
          { transform: startTransform === "none" ? "none" : startTransform },
          { transform: invert(firstRect, lastRect) },
        ],
        { duration: EXIT_MS, easing: EASE, fill: "forwards" },
      );
      currentAnim.onfinish = () => {
        // Repaint the thumbnail beneath its overlapping dialog copy before the
        // top layer is removed, so closing cannot expose a blank frame.
        activeThumb!.style.visibility = "";
        pendingFrame = requestAnimationFrame(() => {
          pendingFrame = null;
          if (!active.open || !active.classList.contains("is-closing")) return;
          active.style.transition = "none";
          active.close();
        });
      };
      return;
    }
  }

  active.close();
}

function cleanupAfterClose(): void {
  const active = dialog!;
  openRequest += 1;
  document.documentElement.style.overflow = "";
  active.classList.remove("is-closing", "has-caption");
  active.style.transition = "";
  cancelPendingFrame();
  currentAnim?.cancel();
  currentAnim = null;
  if (activeThumb) activeThumb.style.visibility = "";
  activeThumb = null;
  flipActive = false;
  // Drop the inline overrides so the CSS fallback governs the next open.
  dialogImg!.style.opacity = "";
  dialogImg!.style.scale = "";
  dialogImg!.style.transform = "";
  dialogImg!.style.transformOrigin = "";
}

export function initImageZoom(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", (event) => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      ".zoomable-image",
    );
    if (trigger) void openZoom(trigger);
  });
}
