import { THEME_OPTIONS, setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface Props {
  /** "md" gives touch-sized hits for the mobile menu; "sm" is the compact footer size. */
  size?: "sm" | "md";
}

// Inline light/dark/system control — no popover, unlike the dropdown ModeToggle.
// Shares the single theme store (@/lib/theme), so it stays in sync with every
// other control on the page.
export default function ThemeSegmented({ size = "sm" }: Props) {
  const theme = useTheme();

  return (
    <div role="group" aria-label="Theme" className="flex items-center gap-0.5">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={theme === option.value}
          className={cn(
            "rounded-md text-sm transition-colors",
            size === "md" ? "px-3 py-2" : "px-2.5 py-1",
            theme === option.value
              ? "bg-foreground/10 text-foreground"
              : "text-body hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
