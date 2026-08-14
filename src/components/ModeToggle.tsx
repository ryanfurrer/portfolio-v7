import { MoonIcon, SunIcon } from "lucide-react";

import { setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface Props {
  /** "md" gives the mobile menu a larger label + touch-sized hit. */
  size?: "sm" | "md";
}

// The single light/dark control, shown in the footer and the mobile menu. Reads
// the shared theme store (@/lib/theme); the icon + word reflect the resolved
// theme via the `.dark` class (no hydration flash), and clicking flips to the
// other theme. The visible word is part of the accessible name (WCAG 2.5.3),
// with an sr-only "theme" naming what the control switches.
export default function ModeToggle({ size = "sm" }: Props) {
  const isDark = useTheme() === "dark";
  const iconSize = size === "md" ? "size-5" : "size-4";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center text-subtle-foreground transition-colors hover:text-foreground",
        size === "md" ? "gap-2 py-2 text-base" : "gap-1.5 text-sm",
      )}
    >
      <SunIcon aria-hidden="true" className={cn(iconSize, "dark:hidden")} />
      <MoonIcon aria-hidden="true" className={cn(iconSize, "hidden dark:block")} />
      <span className="dark:hidden">Light</span>
      <span className="hidden dark:block">Dark</span>
      <span className="sr-only"> theme</span>
    </button>
  );
}
