import * as React from "react";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Theme control: light / dark / system, plus a "D" shortcut that flips
 * light↔dark. The pre-paint inline script in Head.astro already resolves the
 * stored choice (or the OS preference) onto the <html> `.dark` class; this
 * island just keeps that class — and the address-bar color — in step with the
 * user's selection at runtime. Resolution logic mirrors that inline script.
 */
type Theme = "light" | "dark" | "system";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Apply a theme choice to the document (and the browser-chrome color). */
function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#1a1a1a" : "#f5f5f7");
}

export default function ModeToggle() {
  const [theme, setTheme] = React.useState<Theme>("system");

  // Adopt the choice the inline script already honored so the menu reflects it.
  React.useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
  }, []);

  const choose = React.useCallback((next: Theme) => {
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    applyTheme(next);
  }, []);

  // "D" toggles light↔dark — but not while typing or in a modifier combo.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      choose(
        document.documentElement.classList.contains("dark") ? "light" : "dark",
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  // While following the system, track live OS appearance changes.
  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Toggle theme"
        className="relative inline-flex size-10 items-center justify-center rounded-lg text-foreground-muted transition-[color,background-color,scale] duration-150 ease-out hover:bg-surface hover:text-foreground active:scale-[0.96] sm:ms-0 sm:size-8 sm:rounded-md"
      >
        <SunIcon className="size-[1.1rem] scale-100 rotate-0 opacity-100 blur-none transition-[scale,rotate,opacity,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] dark:scale-[0.25] dark:-rotate-90 dark:opacity-0 dark:blur-xs" />
        <MoonIcon className="absolute size-[1.1rem] scale-[0.25] rotate-90 opacity-0 blur-xs transition-[scale,rotate,opacity,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] dark:scale-100 dark:rotate-0 dark:opacity-100 dark:blur-none" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => choose(option.value)}
            className={cn(
              "justify-between pr-2",
              theme === option.value
                ? "text-foreground"
                : "text-foreground-muted",
            )}
          >
            {option.label}
            <CheckIcon
              className={cn(
                "size-4 text-foreground-muted",
                theme === option.value ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
