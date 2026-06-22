import { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
}

export default function TocDrawer({ headings }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (headings.length === 0) return null;

  const handleHeadingClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        ref={triggerRef}
        className="fixed end-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 transform-[translateZ(0)] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-opacity will-change-transform hover:opacity-90 lg:hidden dark:shadow-none"
      >
        Table of Contents
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[60dvh] overflow-y-auto overscroll-contain rounded-t-xl ease-ios! data-[state=closed]:duration-250! data-[state=open]:duration-300!"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold">
            On this page
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 px-4 pb-4 text-sm">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => handleHeadingClick(e, h.id)}
              className={`block text-foreground-muted no-underline transition-colors hover:text-foreground ${
                h.level === 3 ? "ps-3" : h.level === 4 ? "ps-6" : ""
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
