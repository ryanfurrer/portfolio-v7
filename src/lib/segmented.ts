import { cn } from "@/lib/utils";

type Size = "sm" | "md";
type Variant = "boxed" | "plain" | "raised";

// One source of truth for segmented-control item styling (the /brand
// colour-format switch), so any future segmented picker matches it instead of
// drifting into a look-alike. "md" gives touch-sized hits; "plain" drops the
// filled active chip for a quieter, text-only selection.
export function segmentedItem({
  active,
  size = "sm",
  variant = "boxed",
}: {
  active: boolean;
  size?: Size;
  variant?: Variant;
}): string {
  return cn(
    "rounded-md text-sm transition-colors",
    size === "md" ? "px-3 py-2" : "px-2.5 py-1",
    variant === "plain" &&
      (active
        ? "font-medium text-foreground"
        : "text-subtle-foreground hover:text-foreground"),
    variant === "raised" && cn("text-foreground", active && "bg-card"),
    variant === "boxed" &&
      (active
        ? "bg-foreground/10 text-foreground"
        : "text-subtle-foreground hover:text-foreground"),
  );
}
