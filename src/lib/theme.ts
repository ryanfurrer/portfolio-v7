import { useSyncExternalStore } from "react";

/**
 * Single source of truth for the light/dark choice, shared across every island
 * that reads or sets it (the footer + mobile-menu controls). There's no explicit
 * "system" option: with nothing stored we follow the OS preference and keep
 * tracking its changes; the first explicit pick stops that and wins for good.
 * The pre-paint script in Head.astro applies the resolved theme before first
 * paint; these helpers keep it — and the address-bar color — in step at runtime.
 */
export type Theme = "light" | "dark";

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const THEME_EVENT = "themechange";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0e0e0e" : "#f5f5f5");
}

// The explicit user choice, or null when none is stored (legacy "system" and
// any stray value read as null, so those fall back to the OS preference).
function storedChoice(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return null;
}

function readTheme(): Theme {
  return storedChoice() ?? systemTheme();
}

export function setTheme(next: Theme) {
  try {
    localStorage.setItem("theme", next);
  } catch {}
  applyTheme(next);
  window.dispatchEvent(new Event(THEME_EVENT));
}

// Page-lifetime listeners that must exist exactly once no matter how many
// controls are mounted — a second "D" handler would toggle back and cancel the
// first. Idempotent so the first subscribing island wins and the rest are no-ops.
let globalsReady = false;
function initThemeGlobals() {
  if (globalsReady || typeof window === "undefined") return;
  globalsReady = true;

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!storedChoice()) applyTheme(systemTheme());
    });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "d" && e.key !== "D") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement | null;
    if (
      el &&
      (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
    ) {
      return;
    }
    e.preventDefault();
    setTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark",
    );
  });
}

function subscribe(callback: () => void) {
  initThemeGlobals();
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Reactive current theme, synced across islands. SSR/first paint reads "light". */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
