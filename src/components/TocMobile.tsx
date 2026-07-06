import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
  title: string;
}

// Site motion language: iOS overlay curve for the disclosure + reveal.
const EASE_IOS: [number, number, number, number] = [0.23, 1, 0.32, 1];
const REVEAL_AFTER = 240; // px scrolled before the pill appears
const NAV_SHIFT = 72; // px the pill rises when the navbar hides (≈ 4.5rem)
const SLIDE_IN = 12; // px the pill slides down from when revealing

export default function TocMobile({ headings, title }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [activeId, setActiveId] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Reveal only after the reader has scrolled into the page.
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > REVEAL_AFTER;
      setScrolled(past);
      if (!past) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mirror the navbar's auto-hide: rise to the top edge when it slides away,
  // tuck back under it when it returns, so they move as one unit.
  useEffect(() => {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;
    const sync = () => setNavHidden(header.hasAttribute("data-hidden"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(header, { attributes: true, attributeFilter: ["data-hidden"] });
    return () => mo.disconnect();
  }, []);

  // Close on outside click / Escape while open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // Return focus to the trigger so keyboard users aren't dropped to <body>
      // when Escape unmounts the panel from under their focused heading link.
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Scroll-spy: mark the heading currently in the upper viewport band.
  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleHeadingClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <motion.div
      ref={containerRef}
      inert={!scrolled}
      initial={false}
      animate={{
        opacity: scrolled ? 1 : 0,
        y: reduce
          ? 0
          : (navHidden ? -NAV_SHIFT : 0) - (scrolled ? 0 : SLIDE_IN),
      }}
      transition={
        reduce ? { duration: 0.2 } : { duration: 0.3, ease: EASE_IOS }
      }
      style={{ x: "-50%" }}
      className="fixed inset-s-1/2 top-[calc(env(safe-area-inset-top)+5.5rem)] z-30 w-[65vw] overflow-hidden rounded-xl border border-border bg-background/70 shadow-lg backdrop-blur-xl lg:hidden dark:shadow-none dark:inset-ring dark:inset-ring-white/10"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="toc-mobile-panel"
        onClick={() => setOpen((v) => !v)}
        className="touch-hitbox flex w-full items-center gap-3 px-4 py-3 text-start text-sm font-semibold text-foreground transition-[scale] duration-150 ease-out active:scale-[0.98]"
      >
        <span className="min-w-0 flex-1 truncate">{title}</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="size-4 shrink-0 text-foreground-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_IOS }
          }
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              transition: reduce
                ? { height: { duration: 0 }, opacity: { duration: 0.12 } }
                : {
                    height: { duration: 0.2, ease: EASE_IOS },
                    opacity: { duration: 0.15 },
                  },
            }}
            transition={
              reduce
                ? { height: { duration: 0 }, opacity: { duration: 0.15 } }
                : {
                    height: { duration: 0.3, ease: EASE_IOS },
                    opacity: { duration: 0.2, ease: EASE_IOS },
                  }
            }
            className="overflow-hidden"
          >
            <nav
              id="toc-mobile-panel"
              className="max-h-[60dvh] space-y-0.5 overflow-y-auto overscroll-contain px-2 pb-2 text-sm"
            >
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => handleHeadingClick(e, h.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 no-underline transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "quiet-link"
                    } ${h.level === 3 ? "ps-4" : h.level === 4 ? "ps-6" : ""}`}
                  >
                    <span
                      className={`size-1.5 shrink-0 rounded-full bg-foreground transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 truncate">{h.text}</span>
                  </a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
