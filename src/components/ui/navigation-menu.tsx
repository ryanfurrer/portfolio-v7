import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Navigation menu (Radix) — used for hover-to-open nav dropdowns. Rendered
 * *without* a shared Viewport, so each Content panel positions itself directly
 * under its own item (simple dropdown, not the morphing mega-menu). Styling is
 * aligned to the site's popover tokens to match DropdownMenu.
 */
function NavigationMenu({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex max-w-max flex-1 items-center", className)}
      {...props}
    />
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-1 list-none items-center gap-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

// Layout only — colour/state styling is supplied by the call site so it can
// mirror the surrounding nav items.
const navigationMenuTriggerStyle = cva(
  "group inline-flex w-max items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none select-none disabled:pointer-events-none disabled:opacity-50",
);

function NavigationMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    />
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Translucent "glass" material to match the sticky header; solid
        // fallback where backdrop-filter is unsupported (and under
        // prefers-reduced-transparency, see global.css). origin-top so the
        // open/close zoom scales out of the trigger, not the panel's center.
        "absolute top-full z-50 mt-1.5 min-w-40 origin-top rounded-lg border border-border bg-popover supports-[backdrop-filter]:bg-popover/75 p-1 text-popover-foreground shadow-elevated backdrop-blur-xl",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ease-out",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm no-underline outline-hidden transition-colors select-none hover:bg-surface hover:text-foreground focus:bg-surface focus:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
};
