import { useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  navItems: NavItem[];
  pathname: string;
}

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Shared so the open (hamburger) and close (X) controls occupy the exact same
// spot — top-8 right-2 matches the navbar's py-8 top padding and the trigger's
// -mr-2 nudge, so the X lands where the hamburger was.
const controlPosition = "absolute top-8 right-2";
const controlBase =
  "inline-flex size-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link";

export default function MobileNav({ navItems, pathname }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={cn("-mr-2", controlBase)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6h14M3 10h14M3 14h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-3/4 rounded-l-xl dark:shadow-none dark:inset-ring dark:inset-ring-white/5 !ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:!duration-300 data-[state=closed]:!duration-[250ms]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <SheetClose
          aria-label="Close navigation menu"
          className={cn(controlPosition, controlBase)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </SheetClose>
        <nav className="flex flex-col px-2 pb-4">
          {navItems.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-base no-underline transition-colors active:bg-surface-hover hover:bg-surface",
                  active
                    ? "font-medium text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
