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
 * (--nav-active) states — so it reads as a peer of the dir-hover items.
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
    <NavigationMenu aria-label="Personal">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "hover:bg-nav-hover hover:text-foreground data-[state=open]:bg-nav-hover data-[state=open]:text-foreground [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out data-[state=open]:[&>svg]:rotate-180",
              groupActive
                ? "bg-nav-active text-foreground"
                : "text-foreground-muted",
            )}
          >
            {label}
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="right-0">
            {items.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <NavigationMenuLink
                  key={item.href}
                  href={item.href}
                  active={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    active ? "text-foreground" : "text-foreground-muted",
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
