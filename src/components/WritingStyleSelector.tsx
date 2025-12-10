import { cn } from "@/lib/utils";

export type WritingStyle = "poetic" | "reflective" | "storytelling" | "brief";

interface StyleOption {
  value: WritingStyle;
  label: string;
  icon: string;
  description: string;
}

const writingStyles: StyleOption[] = [
  { value: "poetic", label: "Poetic", icon: "🌙", description: "Lyrical" },
  { value: "reflective", label: "Reflective", icon: "🔮", description: "Thoughtful" },
  { value: "storytelling", label: "Storytelling", icon: "📜", description: "Narrative" },
  { value: "brief", label: "Brief", icon: "⚡", description: "Concise" },
];

interface WritingStyleSelectorProps {
  selectedStyle: WritingStyle;
  onSelect: (style: WritingStyle) => void;
}

export function WritingStyleSelector({ selectedStyle, onSelect }: WritingStyleSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="font-serif text-xs text-ink-light italic">Choose your style</p>
      
      <div className="flex gap-1.5">
        {writingStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => onSelect(style.value)}
            title={style.description}
            className={cn(
              "group flex flex-col items-center gap-0.5 transition-all duration-300",
              "hover:scale-110 p-1.5 rounded-lg",
              selectedStyle === style.value 
                ? "bg-gold/20 border border-gold/50 scale-105" 
                : "hover:bg-ink/5 border border-transparent"
            )}
          >
            {/* Style icon - styled like ink bottle */}
            <div className={cn(
              "w-7 h-8 rounded-md relative transition-all flex items-center justify-center",
              "border",
              selectedStyle === style.value 
                ? "border-gold shadow-md" 
                : "border-ink/30 hover:border-ink/50",
            )}>
              {/* Scroll/book decoration */}
              <div className={cn(
                "absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-t-sm",
                selectedStyle === style.value ? "bg-gold/60" : "bg-ink/20"
              )} />
              {/* Icon */}
              <span className={cn(
                "text-sm transition-transform",
                selectedStyle === style.value && "animate-pulse"
              )}>
                {style.icon}
              </span>
              {/* Shine effect */}
              <div className="absolute top-1.5 left-0.5 w-0.5 h-1.5 bg-white/20 rounded-full" />
            </div>
            <span className={cn(
              "text-[8px] font-serif transition-colors",
              selectedStyle === style.value ? "text-gold" : "text-ink-light"
            )}>
              {style.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getStylePlaceholder(style: WritingStyle): string {
  switch (style) {
    case "poetic":
      return "Let verses flow like moonlight on water...";
    case "reflective":
      return "What thoughts stir within your mind today...";
    case "storytelling":
      return "Once upon a time, in a world of wonder...";
    case "brief":
      return "Capture the essence in few words...";
    default:
      return "Begin your tale here...";
  }
}
