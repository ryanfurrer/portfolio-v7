/**
 * Click-to-zoom for content images, built on the native `<dialog>` element so
 * focus trapping, Esc-to-close, the inert background and focus return come for
 * free. Progressive enhancement: without JS the image still renders inline, and
 * the enter/exit animation is pure CSS (see `.image-zoom-dialog` in global.css),
 * so `prefers-reduced-motion` is honoured by the global reduced-motion rule
 * rather than any logic here.
 *
 * One dialog is created lazily and reused for every image; clicks are delegated
 * from the document so images added later (e.g. live draft preview) still work.
 */

const ZOOM_ATTR = "data-zoom-src";

let dialog: HTMLDialogElement | null = null;
let dialogImg: HTMLImageElement | null = null;
let initialized = false;

const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;

  dialog = document.createElement("dialog");
  dialog.className = "image-zoom-dialog";
  dialog.innerHTML = `
    <img class="image-zoom-dialog__img" alt="" decoding="async" />
    <button type="button" class="image-zoom-dialog__close" aria-label="Close">${CLOSE_ICON}</button>
  `;
  dialogImg = dialog.querySelector("img");

  // A click on the dialog itself (the padding around the image) is a click on
  // the backdrop as far as the reader is concerned — close on it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog?.close();
  });
  dialog
    .querySelector(".image-zoom-dialog__close")
    ?.addEventListener("click", () => dialog?.close());

  // The modal doesn't lock body scroll on its own; pin it while open.
  dialog.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
  });

  document.body.append(dialog);
  return dialog;
}

function openZoom(trigger: HTMLElement): void {
  const src = trigger.getAttribute(ZOOM_ATTR);
  if (!src) return;

  const active = ensureDialog();
  const thumb = trigger.querySelector("img");

  // Paint instantly by reusing the already-decoded inline image, then swap in
  // the hi-res variant once it loads so the view sharpens without a blank flash.
  active.dataset.pendingSrc = src;
  dialogImg!.src = thumb?.currentSrc || thumb?.src || src;
  dialogImg!.alt = trigger.getAttribute("data-zoom-alt") ?? "";

  document.documentElement.style.overflow = "hidden";
  active.showModal();

  const hires = new Image();
  hires.onload = () => {
    // Ignore a late load if the reader has since closed or opened another image.
    if (active.open && active.dataset.pendingSrc === src) dialogImg!.src = src;
  };
  hires.src = src;
}

export function initImageZoom(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", (event) => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      ".zoomable-image",
    );
    if (trigger) openZoom(trigger);
  });
}
