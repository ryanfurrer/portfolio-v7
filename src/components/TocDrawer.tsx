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

  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
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
        className="fixed bottom-6 right-6 z-30 lg:hidden bg-foreground text-background text-sm font-medium px-4 py-2 rounded-full shadow-lg dark:shadow-none hover:opacity-90 transition-opacity"
      >
        Table of Contents
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[60vh] overflow-y-auto overscroll-contain rounded-t-xl !ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:!duration-300 data-[state=closed]:!duration-[250ms]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold">On this page</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 text-sm px-4 pb-4">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => handleHeadingClick(e, h.id)}
              className={`block text-foreground-muted hover:text-foreground transition-colors no-underline ${h.level === 3 ? "pl-3" : h.level === 4 ? "pl-6" : ""
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
