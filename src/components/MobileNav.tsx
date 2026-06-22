import { type CSSProperties, useState } from "react";

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
// spot — top-4 end-2 matches the navbar's py-4 top padding and the trigger's
// -me-2 nudge, so the X lands where the hamburger was.
const controlPosition = "absolute top-4 end-2";
const controlBase =
  "inline-flex size-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link";

export default function MobileNav({ navItems, pathname }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={cn("-me-2", controlBase)}
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
        side="top"
        showCloseButton={false}
        className="menu-grow h-dvh ease-ios! data-[state=closed]:duration-300! data-[state=open]:duration-420! dark:shadow-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
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
        <nav className="flex flex-col items-end pe-2 pt-20 pb-4 text-end">
          {navItems.map((item, i) => {
            const active = isActive(item.href, pathname);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{ "--index": i } as CSSProperties}
                className={cn(
                  "menu-item rounded-lg px-2 py-2 text-2xl font-semibold tracking-tight no-underline transition-colors hover:bg-surface active:bg-surface-hover",
                  active
                    ? "text-foreground"
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
