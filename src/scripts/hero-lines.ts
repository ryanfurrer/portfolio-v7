/**
 * Homepage headline — typographic line reveal.
 *
 * Splits the fluid headline into its visual lines and rises each out from
 * behind its own baseline (an overflow-clipped mask), top to bottom. Once the
 * last line settles the plain markup is restored, so lingering masks can't clip
 * or mis-wrap the text on later reflows. Measured after fonts load so the line
 * grouping matches what actually renders. Gated on `.reveal-init` (JS + motion
 * allowed); a CSS failsafe reveals the headline if this never runs.
 */
const title = document.querySelector<HTMLElement>("[data-hero-title]");

if (title && document.documentElement.classList.contains("reveal-init")) {
  const original = title.innerHTML;

  // Flatten the headline to per-word spans, tagging words from the muted tail so
  // their colour survives being regrouped into line masks.
  const collectWords = (
    node: Node,
    muted: boolean,
    out: (HTMLElement | Text)[],
  ) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            out.push(document.createTextNode(" "));
            return;
          }
          const word = document.createElement("span");
          word.className = muted
            ? "hero-word text-muted-foreground"
            : "hero-word";
          word.textContent = part;
          out.push(word);
        });
      } else if (child instanceof HTMLElement) {
        collectWords(
          child,
          muted || child.classList.contains("text-muted-foreground"),
          out,
        );
      }
    });
  };

  const reveal = () => {
    const words: (HTMLElement | Text)[] = [];
    collectWords(title, false, words);
    title.replaceChildren(...words);

    // Group words into visual lines by their vertical offset.
    const lines: Node[][] = [];
    let top: number | null = null;
    let current: Node[] | null = null;
    Array.from(title.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.classList.contains("hero-word")) {
        if (top === null || Math.abs(node.offsetTop - top) > 2) {
          top = node.offsetTop;
          current = [];
          lines.push(current);
        }
        current!.push(node);
      } else if (current) {
        current.push(node);
      }
    });

    const masks = lines.map((group, i) => {
      const mask = document.createElement("span");
      mask.className = "hero-line";
      const inner = document.createElement("span");
      inner.className = "hero-line-inner";
      inner.style.setProperty("--line", String(i));
      inner.append(...group);
      mask.append(inner);
      return mask;
    });
    title.replaceChildren(...masks);
    title.classList.add("is-revealed", "is-split");

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      // Drop the masks (only `is-split`); keep `is-revealed` so the plain
      // headline stays visible. The flex split matches the inline metrics, so
      // this swap doesn't shift layout.
      title.innerHTML = original;
      title.classList.remove("is-split");
    };
    masks.at(-1)?.firstElementChild?.addEventListener("animationend", restore, {
      once: true,
    });
    // Fallback if animationend never fires (e.g. the last line is interrupted).
    setTimeout(restore, 650 + lines.length * 70 + 200);
  };

  const run = () => requestAnimationFrame(reveal);
  if (document.fonts?.ready) document.fonts.ready.then(run);
  else run();
}
