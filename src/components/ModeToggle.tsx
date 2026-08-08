import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_OPTIONS, setTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Desktop/footer theme control: light / dark / system as a dropdown. State and
 * the "D" shortcut live in @/lib/theme so this and the mobile-menu control share
 * one source of truth (see that module).
 */
export default function ModeToggle() {
  const theme = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Toggle theme"
        className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out  hover:text-foreground active:scale-[0.96] sm:ms-0 sm:size-8 sm:rounded-md"
      >
        <SunIcon className="size-[1.1rem] scale-100 rotate-0 opacity-100 blur-none transition-[scale,rotate,opacity,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] dark:scale-[0.25] dark:-rotate-90 dark:opacity-0 dark:blur-xs" />
        <MoonIcon className="absolute size-[1.1rem] scale-[0.25] rotate-90 opacity-0 blur-xs transition-[scale,rotate,opacity,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] dark:scale-100 dark:rotate-0 dark:opacity-100 dark:blur-none" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "justify-between pe-2",
              theme === option.value
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {option.label}
            <CheckIcon
              className={cn(
                "size-4 text-muted-foreground",
                theme === option.value ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
