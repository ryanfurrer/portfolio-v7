import { segmentedItem } from "@/lib/segmented";
import { THEME_OPTIONS, setTheme, useTheme } from "@/lib/theme";

interface Props {
  /** "md" gives touch-sized hits for the mobile menu; "sm" is the compact footer size. */
  size?: "sm" | "md";
  /** "plain" drops the filled active chip for a quieter, text-only selection. */
  variant?: "boxed" | "plain";
}

// Inline light/dark/system control — no popover, unlike the dropdown ModeToggle.
// Shares the single theme store (@/lib/theme), so it stays in sync with every
// other control on the page.
export default function ThemeSegmented({
  size = "sm",
  variant = "boxed",
}: Props) {
  const theme = useTheme();

  return (
    <div role="group" aria-label="Theme" className="flex items-center gap-0.5">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={theme === option.value}
          className={segmentedItem({
            active: theme === option.value,
            size,
            variant,
          })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
