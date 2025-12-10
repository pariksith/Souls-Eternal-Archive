import { memo } from "react";
import { format } from "date-fns";
import { BookMarked, Calendar, Scroll } from "lucide-react";
import { DiaryEntry } from "@/hooks/useDiaryStorage";
import { getMoodEmoji } from "@/components/MoodSelector";
import { cn } from "@/lib/utils";

interface EntriesSidebarProps {
  entries: DiaryEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const EntriesSidebar = memo(function EntriesSidebar({
  entries,
  selectedDate,
  onSelectDate,
}: EntriesSidebarProps) {
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  return (
    <aside className="entries-sidebar w-72 lg:w-80 h-full flex flex-col border-r-4 border-gold/30 shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-gold/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Scroll className="w-6 h-6 text-gold" />
          <h1 className="font-handwriting text-3xl gold-emboss">Past Entries</h1>
        </div>
        <p className="text-center font-serif text-foreground/60 text-sm italic">
          Your magical memories
        </p>
      </div>

      {/* Today Button */}
      <div className="p-4">
        <button
          onClick={() => onSelectDate(new Date())}
          className={cn(
            "w-full p-4 rounded-lg flex items-center gap-3 transition-all",
            "bg-gold/20 hover:bg-gold/30 border-2 border-gold/50",
            "font-serif text-foreground hover:scale-[1.02]",
            "shadow-lg hover:shadow-xl"
          )}
        >
          <Calendar className="w-6 h-6 text-gold" />
          <div className="text-left">
            <span className="font-handwriting text-xl">Today</span>
            <p className="text-xs text-foreground/60">{format(new Date(), "MMM d, yyyy")}</p>
          </div>
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/50 font-serif italic">
              No entries yet...
            </p>
            <p className="text-foreground/40 font-serif text-sm mt-1">
              Begin your magical journey
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const isSelected = entry.date === selectedDateStr;
            const entryDate = new Date(entry.date);
            const preview = entry.content.slice(0, 60) + (entry.content.length > 60 ? "..." : "");

            return (
              <button
                key={entry.id}
                onClick={() => onSelectDate(entryDate)}
                className={cn(
                  "w-full p-4 rounded-lg text-left transition-all",
                  "border-2 hover:scale-[1.01]",
                  isSelected
                    ? "bg-gold/25 border-gold/60 shadow-lg"
                    : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10 hover:border-gold/30"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-handwriting text-xl text-foreground">
                    {format(entryDate, "MMMM d")}
                  </p>
                  <div className="flex items-center gap-1">
                    {entry.isSealed && <span className="text-sm">⚡</span>}
                    {entry.mood && <span className="text-lg">{getMoodEmoji(entry.mood)}</span>}
                    <span className="text-xs text-foreground/40 font-serif">
                      {format(entryDate, "yyyy")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 font-serif italic line-clamp-2">
                  {preview || "Empty entry..."}
                </p>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gold/20 text-center">
        <p className="text-sm text-foreground/50 font-serif">
          ✦ {entries.length} {entries.length === 1 ? "memory" : "memories"} preserved ✦
        </p>
        <p className="text-xs text-foreground/40 mt-1 flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500/80" />
          Stored safely offline
        </p>
      </div>
    </aside>
  );
});
