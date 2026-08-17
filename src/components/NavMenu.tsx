import { ChevronDown } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/**
 * Desktop-only grouped nav item: a hover-to-open dropdown gathering the
 * "personal/meta" pages (About, Uses, Links) under one trigger. Built on Radix
 * NavigationMenu so hover-open, close-intent, and keyboard support come for
 * free (no focus-steal on hover, unlike a DropdownMenu). The trigger mirrors the
 * server-rendered nav anchors — same neutral hover (--nav-hover) and active
 * (ghost ring) states — so it reads as a peer of the dir-hover items.
 */
interface NavMenuItem {
  label: string;
  href: string;
}

interface Props {
  label: string;
  items: NavMenuItem[];
  pathname: string;
}

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavMenu({ label, items, pathname }: Props) {
  const groupActive = items.some((item) => isActive(item.href, pathname));

  return (
    <NavigationMenu aria-label="Personal" delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            // Radix toggles the menu on click, so a mouse click while it's
            // already hover-open closes it — a race visitors hit when they
            // click "Me" expecting a page nav during the hover-open delay.
            // Suppress only the pointer-driven close (detail > 0); keyboard
            // activation (detail === 0) and open-on-click stay intact.
            onClick={(event) => {
              if (
                event.detail > 0 &&
                event.currentTarget.dataset.state === "open"
              ) {
                event.preventDefault();
              }
            }}
            className={cn(
              "transition-[color,background-color,scale] active:scale-[0.97] [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out data-[state=open]:[&>svg]:rotate-180",
              // Active (a sub-item is the current route) → ghost ring, matching
              // the primary nav; the ring persists on hover/open (only the
              // chevron rotates). Inactive → muted with the nav-hover lift.
              groupActive
                ? "text-foreground ring-1 ring-inset ring-border"
                : "text-subtle-foreground hover:bg-nav-hover hover:text-foreground hover:[box-shadow:var(--nav-hover-shadow)] data-[state=open]:bg-nav-hover data-[state=open]:text-foreground data-[state=open]:[box-shadow:var(--nav-hover-shadow)]",
            )}
          >
            {label}
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="right-0 origin-top-right">
            {items.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <NavigationMenuLink
                  key={item.href}
                  href={item.href}
                  active={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    active ? "text-foreground" : "text-subtle-foreground",
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              );
            })}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
