import { cn } from "@/lib/utils";

export type DiaryFont = "dancing" | "caveat" | "great-vibes" | "indie-flower" | "satisfy";

interface FontOption {
  value: DiaryFont;
  label: string;
  fontClass: string;
  preview: string;
}

const fontOptions: FontOption[] = [
  { value: "dancing", label: "Elegant", fontClass: "font-handwriting", preview: "Aa" },
  { value: "caveat", label: "Casual", fontClass: "font-caveat", preview: "Aa" },
  { value: "great-vibes", label: "Fancy", fontClass: "font-great-vibes", preview: "Aa" },
  { value: "indie-flower", label: "Playful", fontClass: "font-indie-flower", preview: "Aa" },
  { value: "satisfy", label: "Classic", fontClass: "font-satisfy", preview: "Aa" },
];

interface FontSelectorProps {
  selectedFont: DiaryFont;
  onSelect: (font: DiaryFont) => void;
}

export function FontSelector({ selectedFont, onSelect }: FontSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="font-serif text-xs text-ink-light italic">Choose your font</p>
      
      <div className="flex gap-1.5 flex-wrap justify-center">
        {fontOptions.map((font) => (
          <button
            key={font.value}
            onClick={() => onSelect(font.value)}
            title={font.label}
            className={cn(
              "group flex flex-col items-center gap-0.5 transition-all duration-300",
              "hover:scale-110 p-1 rounded-lg",
              selectedFont === font.value 
                ? "bg-gold/20 border border-gold/50 scale-105" 
                : "hover:bg-ink/5 border border-transparent"
            )}
          >
            {/* Font preview card */}
            <div className={cn(
              "w-8 h-8 rounded-md relative transition-all flex items-center justify-center",
              "border bg-parchment/50",
              selectedFont === font.value 
                ? "border-gold shadow-md" 
                : "border-ink/30 hover:border-ink/50",
            )}>
              {/* Quill decoration on top */}
              <div className={cn(
                "absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]",
                selectedFont === font.value ? "opacity-100" : "opacity-40"
              )}>
                ✒️
              </div>
              {/* Font preview */}
              <span className={cn(
                "text-sm text-ink transition-transform",
                font.fontClass,
                selectedFont === font.value && "scale-110"
              )}>
                {font.preview}
              </span>
            </div>
            <span className={cn(
              "text-[8px] font-serif transition-colors",
              selectedFont === font.value ? "text-gold" : "text-ink-light"
            )}>
              {font.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getFontClass(font: DiaryFont): string {
  return fontOptions.find(f => f.value === font)?.fontClass || "font-handwriting";
}
