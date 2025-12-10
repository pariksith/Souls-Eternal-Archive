import { cn } from "@/lib/utils";

export type Mood = "magical" | "happy" | "calm" | "thoughtful" | "stormy" | "mysterious";

interface MoodOption {
  value: Mood;
  emoji: string;
  label: string;
  color: string;
}

const moods: MoodOption[] = [
  { value: "magical", emoji: "✨", label: "Magical", color: "bg-gold/30 border-gold" },
  { value: "happy", emoji: "☀️", label: "Radiant", color: "bg-amber-400/30 border-amber-400" },
  { value: "calm", emoji: "🌙", label: "Serene", color: "bg-indigo-400/30 border-indigo-400" },
  { value: "thoughtful", emoji: "🦉", label: "Wise", color: "bg-purple-400/30 border-purple-400" },
  { value: "stormy", emoji: "⚡", label: "Stormy", color: "bg-slate-400/30 border-slate-400" },
  { value: "mysterious", emoji: "🔮", label: "Mysterious", color: "bg-violet-500/30 border-violet-500" },
];

interface MoodSelectorProps {
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
  compact?: boolean;
}

export function MoodSelector({ selectedMood, onSelect, compact }: MoodSelectorProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <p className="font-serif text-xs text-ink-light italic">Today's essence</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onSelect(mood.value)}
              title={mood.label}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all duration-300",
                "flex items-center justify-center text-base",
                "hover:scale-110 hover:shadow-lg",
                selectedMood === mood.value
                  ? `${mood.color} shadow-md scale-105`
                  : "bg-parchment-dark/50 border-ink/20 hover:border-ink/40"
              )}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={cn(
            "px-3 py-1.5 rounded-full border-2 transition-all duration-300",
            "font-serif text-sm flex items-center gap-1.5",
            "hover:scale-110 hover:shadow-lg",
            selectedMood === mood.value
              ? `${mood.color} shadow-md scale-105`
              : "bg-parchment-dark/50 border-ink/20 hover:border-ink/40"
          )}
        >
          <span className="text-lg">{mood.emoji}</span>
          <span className="text-ink">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

export function getMoodEmoji(mood?: Mood): string {
  return moods.find(m => m.value === mood)?.emoji || "";
}
