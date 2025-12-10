import { useState } from "react";
import { cn } from "@/lib/utils";

export type InkColor = "brown" | "blue" | "purple";

interface InkOption {
  value: InkColor;
  label: string;
  colorClass: string;
  bgClass: string;
}

const inkColors: InkOption[] = [
  { value: "brown", label: "Classic", colorClass: "text-ink-brown", bgClass: "bg-ink-brown" },
  { value: "blue", label: "Royal", colorClass: "text-ink-blue", bgClass: "bg-ink-blue" },
  { value: "purple", label: "Enchanted", colorClass: "text-ink-purple", bgClass: "bg-ink-purple" },
];

interface InkSelectorProps {
  selectedInk: InkColor;
  onSelect: (ink: InkColor) => void;
}

export function InkSelector({ selectedInk, onSelect }: InkSelectorProps) {
  const [isDipping, setIsDipping] = useState(false);
  const [dippingInk, setDippingInk] = useState<InkColor | null>(null);

  const handleInkSelect = (ink: InkColor) => {
    if (ink === selectedInk) return;
    
    setDippingInk(ink);
    setIsDipping(true);
    
    // Trigger the dip animation, then change ink
    setTimeout(() => {
      onSelect(ink);
      setTimeout(() => {
        setIsDipping(false);
        setDippingInk(null);
      }, 400);
    }, 400);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="font-serif text-xs text-ink-light italic">Choose your ink</p>
      
      {/* Quill with dip animation */}
      <div className="relative h-8 mb-0.5">
        <span className={cn(
          "text-2xl inline-block transition-all",
          isDipping && "animate-quill-dip"
        )}>
          🪶
        </span>
        {/* Ink drip effect */}
        {isDipping && dippingInk && (
          <div className={cn(
            "absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-b-full animate-ink-drip",
            inkColors.find(i => i.value === dippingInk)?.bgClass
          )} />
        )}
      </div>
      
      <div className="flex gap-2.5">
        {inkColors.map((ink) => (
          <button
            key={ink.value}
            onClick={() => handleInkSelect(ink.value)}
            title={ink.label}
            className={cn(
              "group flex flex-col items-center gap-0.5 transition-all duration-300",
              "hover:scale-110",
              dippingInk === ink.value && "scale-110"
            )}
          >
            {/* Ink bottle */}
            <div className={cn(
              "w-6 h-8 rounded-b-lg rounded-t-sm relative transition-all",
              "border-2",
              selectedInk === ink.value 
                ? "border-gold shadow-lg scale-110" 
                : "border-ink/30 hover:border-ink/50",
              dippingInk === ink.value && "animate-pulse"
            )}>
              {/* Bottle neck */}
              <div className={cn(
                "absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 rounded-t-sm",
                ink.bgClass
              )} />
              {/* Ink fill */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 rounded-b-md transition-all duration-300",
                ink.bgClass,
                "opacity-90",
                dippingInk === ink.value ? "h-1/2" : "h-3/4"
              )} />
              {/* Shine */}
              <div className="absolute top-1.5 left-0.5 w-0.5 h-2 bg-white/20 rounded-full" />
              {/* Ripple effect when dipping */}
              {dippingInk === ink.value && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white/30 rounded-full animate-pulse" />
              )}
            </div>
            <span className={cn(
              "text-[9px] font-serif transition-colors",
              selectedInk === ink.value ? "text-gold" : "text-ink-light"
            )}>
              {ink.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getInkColorClass(ink: InkColor): string {
  return inkColors.find(i => i.value === ink)?.colorClass || "text-ink-brown";
}
