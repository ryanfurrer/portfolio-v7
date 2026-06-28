import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const EASE_IOS: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  // Appear once the end of the content scrolls into view, and stay visible
  // through to the bottom of the page.
  useEffect(() => {
    const sentinel = document.getElementById("content-end");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // True once the content end reaches the viewport bottom and stays true
        // as it scrolls higher. Guard on scrollY so short, unscrolled pages
        // (sentinel already on screen) don't trigger it.
        const reachedEnd = entry.boundingClientRect.top < window.innerHeight;
        setVisible(reachedEnd && window.scrollY > 200);
      },
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    // Wrapper pins to the page container's end edge (not the raw viewport edge),
    // so on wide screens the button hugs the content column instead of floating
    // out in the far margin. pointer-events pass through everywhere but the button.
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-280 justify-end px-4">
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Back to top"
        inert={!visible}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: reduce ? 0 : visible ? 0 : 8 }}
        transition={reduce ? { duration: 0.2 } : { duration: 0.3, ease: EASE_IOS }}
        className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-xl transition-[scale] duration-150 ease-out hover:bg-secondary/60 active:scale-[0.96] dark:shadow-none dark:inset-ring dark:inset-ring-white/10"
      >
        Back to top
        <svg
          viewBox="0 0 24 24"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </motion.button>
    </div>
  );
}
