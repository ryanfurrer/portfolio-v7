import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageOption {
  id: string;
  label: string;
}

interface Props {
  initialValue: string;
  options: LanguageOption[];
}

export default function HearthLanguageSelect({ initialValue, options }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(initialValue);
  const selectedLabel = options.find((option) => option.id === value)?.label;

  const selectLanguage = (nextValue: string) => {
    setValue(nextValue);
    root.current?.closest<HTMLElement>("[data-hearth-editor]")?.dispatchEvent(
      new CustomEvent("hearth:language-change", {
        detail: { value: nextValue },
      }),
    );
  };

  const setOpen = (open: boolean) => {
    document.body.toggleAttribute("data-hearth-select-open", open);
  };

  useEffect(
    () => () => document.body.removeAttribute("data-hearth-select-open"),
    [],
  );

  return (
    <div ref={root} className="min-w-0">
      <Select
        value={value}
        onValueChange={selectLanguage}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          size="xs"
          aria-label="Code sample language"
          className="relative w-full border-border bg-muted px-2.5 font-mono text-xs before:absolute before:[inset-inline:0] before:[inset-block:-0.5rem] sm:w-28"
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="min-w-28 font-mono">
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
