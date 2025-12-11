import { useState, useEffect, useRef, memo } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2, Save, Check, FileDown } from "lucide-react";
import { DiaryEntry } from "@/hooks/useDiaryStorage";
import { MoodSelector, Mood, getMoodEmoji } from "@/components/MoodSelector";
import { InkSelector, InkColor, getInkColorClass } from "@/components/InkSelector";
import { WritingStyleSelector, WritingStyle, getStylePlaceholder } from "@/components/WritingStyleSelector";
import { FontSelector, DiaryFont, getFontClass } from "@/components/FontSelector";
import { WaxSeal } from "@/components/WaxSeal";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { MagicalBorder, PageBorderLines, DividerOrnament } from "@/components/MagicalBorder";
import { cn } from "@/lib/utils";

interface DiaryPageProps {
  selectedDate: Date;
  entry: DiaryEntry | undefined;
  onSave: (date: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => void;
  onUpdate: (id: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => void;
  onDelete: (id: string) => void;
  onDateChange: (direction: "prev" | "next") => void;
  onToggleSeal: (id: string) => void;
  onExport: () => void;
  allEntries: DiaryEntry[];
}

export const DiaryPage = memo(function DiaryPage({
  selectedDate,
  entry,
  onSave,
  onUpdate,
  onDelete,
  onDateChange,
  onToggleSeal,
  onExport,
  allEntries,
}: DiaryPageProps) {
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood);
  const [inkColor, setInkColor] = useState<InkColor>(entry?.inkColor || "brown");
  const [writingStyle, setWritingStyle] = useState<WritingStyle>(entry?.writingStyle || "reflective");
  const [diaryFont, setDiaryFont] = useState<DiaryFont>(entry?.diaryFont || "dancing");
  const [isWriting, setIsWriting] = useState(false);
  const [showInkEffect, setShowInkEffect] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const scratchSoundRef = useRef<NodeJS.Timeout>();
  
  const { playQuillScratch, playSealStamp, playInkDip } = useSoundEffects();

  useEffect(() => {
    setContent(entry?.content || "");
    setMood(entry?.mood);
    setInkColor(entry?.inkColor || "brown");
    setWritingStyle(entry?.writingStyle || "reflective");
    setDiaryFont(entry?.diaryFont || "dancing");
    setHasChanges(false);
  }, [entry, selectedDate]);

  // Auto-scroll textarea when content overflows
  useEffect(() => {
    if (textareaRef.current && isWriting) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [content, isWriting]);

  const performSave = (newContent: string, newMood?: Mood, newInkColor?: InkColor, newWritingStyle?: WritingStyle, newDiaryFont?: DiaryFont) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (entry) {
      onUpdate(entry.id, newContent, newMood, newInkColor, newWritingStyle, newDiaryFont, entry.isSealed);
    } else if (newContent.trim() || newMood) {
      onSave(dateStr, newContent, newMood, newInkColor, newWritingStyle, newDiaryFont);
    }
    setHasChanges(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsWriting(true);
    setShowInkEffect(true);
    setHasChanges(true);

    // Play quill scratch sound (debounced)
    if (scratchSoundRef.current) clearTimeout(scratchSoundRef.current);
    scratchSoundRef.current = setTimeout(() => {
      playQuillScratch();
    }, 50);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      performSave(newContent, mood, inkColor, writingStyle, diaryFont);
      setIsWriting(false);
    }, 1500);

    setTimeout(() => setShowInkEffect(false), 400);
  };

  const handleMoodChange = (newMood: Mood) => {
    setMood(newMood);
    setHasChanges(true);
  };

  const handleInkChange = (newInk: InkColor) => {
    setInkColor(newInk);
    setHasChanges(true);
    playInkDip();
  };

  const handleStyleChange = (newStyle: WritingStyle) => {
    setWritingStyle(newStyle);
    setHasChanges(true);
  };

  const handleFontChange = (newFont: DiaryFont) => {
    setDiaryFont(newFont);
    setHasChanges(true);
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    performSave(content, mood, inkColor, writingStyle, diaryFont);
    setIsWriting(false);
  };

  const handleDelete = () => {
    if (entry && confirm("Erase this entry forever?")) {
      onDelete(entry.id);
      setContent("");
      setMood(undefined);
      setInkColor("brown");
      setWritingStyle("reflective");
      setDiaryFont("dancing");
    }
  };

  const handleDateChange = (direction: "prev" | "next") => {
    onDateChange(direction);
  };

  const handleToggleSeal = () => {
    playSealStamp();
    if (entry) {
      onToggleSeal(entry.id);
    } else if (content.trim() || mood) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      onSave(dateStr, content, mood, inkColor, writingStyle, diaryFont, true);
    }
  };

  const dateFormatted = format(selectedDate, "EEEE, MMMM do, yyyy");
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const inkTextClass = getInkColorClass(inkColor);
  const fontClass = getFontClass(diaryFont);
  const placeholder = getStylePlaceholder(writingStyle);

  return (
    <div className="w-full h-full flex animate-book-open max-w-6xl mx-auto">
      {/* Book Cover - Left Side */}
      <div className="leather-texture w-3 lg:w-4 rounded-l-lg hidden sm:block flex-shrink-0" />

      {/* Open Book */}
      <div className="flex-1 flex overflow-hidden rounded-r-lg sm:rounded-l-none rounded-lg shadow-2xl min-h-0">
        
        {/* Left Page - Mood & Info */}
        <div className="page-left w-[280px] lg:w-[300px] flex-shrink-0 p-5 lg:p-6 flex flex-col border-r border-ink/10 hidden md:flex overflow-y-auto scrollbar-hide relative">
          
          {/* Decorative header */}
          <div className="text-center mb-5 relative z-10">
            <div className="font-handwriting text-2xl lg:text-3xl gold-emboss mb-1">
              ✦ Diary ✦
            </div>
            <p className="font-serif text-ink-light text-xs italic">
              A record of magical moments
            </p>
            <DividerOrnament className="mt-3" />
          </div>

          {/* Date display */}
          <div className="text-center mb-5">
            <p className="font-handwriting text-lg text-ink">
              {format(selectedDate, "MMMM")}
            </p>
            <p className="font-handwriting text-4xl lg:text-5xl gold-emboss my-1">
              {format(selectedDate, "d")}
            </p>
            <p className="font-handwriting text-base text-ink-light">
              {format(selectedDate, "yyyy")}
            </p>
            {isToday && (
              <span className="inline-block mt-2 px-3 py-0.5 bg-gold/20 rounded-full text-gold font-serif text-xs">
                ✦ Today
              </span>
            )}
          </div>

          {/* Mood Section */}
          <div className="mb-4">
            <MoodSelector selectedMood={mood} onSelect={handleMoodChange} compact />
          </div>

          <DividerOrnament />

          {/* Ink Color Section */}
          <div className="py-3">
            <InkSelector selectedInk={inkColor} onSelect={handleInkChange} />
          </div>

          <DividerOrnament />

          {/* Font Selector Section */}
          <div className="py-3">
            <FontSelector selectedFont={diaryFont} onSelect={handleFontChange} />
          </div>

          <DividerOrnament />

          {/* Writing Style Section */}
          <div className="py-3">
            <WritingStyleSelector selectedStyle={writingStyle} onSelect={handleStyleChange} />
          </div>

          <DividerOrnament />

          {/* Wax Seal Section */}
          <div className="flex flex-col items-center gap-2 py-3">
            <p className="font-serif text-xs text-ink-light italic">Mark as important</p>
            <WaxSeal 
              isSealed={entry?.isSealed || false} 
              onToggle={handleToggleSeal}
            />
          </div>

          {/* Quill decoration */}
          <div className="text-center mt-auto pt-4">
            <span className={cn(
              "text-3xl inline-block",
              isWriting && "animate-quill-write"
            )}>
              🪶
            </span>
            <p className="font-serif text-[10px] text-ink-light mt-1">
              {isWriting ? "The quill dances..." : "Ready to write"}
            </p>
          </div>
        </div>

        {/* Book Spine (center) */}
        <div className="book-spine w-2 lg:w-3 hidden md:block flex-shrink-0" />

        {/* Right Page - Writing Area */}
        <div className="page-right flex-1 p-4 sm:p-5 lg:p-6 flex flex-col relative animate-magical-glow min-w-0">
          {/* Magical Border for Right Page */}
          <MagicalBorder />
          <PageBorderLines />
          
          {/* Mobile header */}
          <div className="md:hidden mb-3 text-center relative z-10">
            <p className="font-handwriting text-xl gold-emboss">
              {dateFormatted}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              {mood && <span className="text-xl">{getMoodEmoji(mood)}</span>}
              {entry?.isSealed && <span className="text-lg">⚡</span>}
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink/15 relative z-10">
            <button
              onClick={() => handleDateChange("prev")}
              className="p-2 rounded-full hover:bg-ink/10 transition-colors text-ink"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center hidden md:block flex-1 px-2">
              <p className="font-handwriting text-lg lg:text-xl text-ink flex items-center gap-2 justify-center flex-wrap">
                <span>{dateFormatted}</span>
                {mood && <span className="text-lg">{getMoodEmoji(mood)}</span>}
                {entry?.isSealed && <span className="text-base">⚡</span>}
              </p>
            </div>

            <button
              onClick={() => handleDateChange("next")}
              className="p-2 rounded-full hover:bg-ink/10 transition-colors text-ink"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Mood & Ink Selector */}
          <div className="md:hidden mb-3 space-y-2 relative z-10">
            <MoodSelector selectedMood={mood} onSelect={handleMoodChange} compact />
            <div className="flex flex-wrap gap-2 justify-center">
              <InkSelector selectedInk={inkColor} onSelect={handleInkChange} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <FontSelector selectedFont={diaryFont} onSelect={handleFontChange} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <WritingStyleSelector selectedStyle={writingStyle} onSelect={handleStyleChange} />
            </div>
            <div className="flex justify-center pt-1">
              <WaxSeal 
                isSealed={entry?.isSealed || false} 
                onToggle={handleToggleSeal}
                size="sm"
              />
            </div>
          </div>

          {/* Writing Area */}
          <div className="relative flex-1 min-h-0 z-10">
            {/* Lined paper */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, hsl(var(--ink) / 0.08) 31px, hsl(var(--ink) / 0.08) 32px)",
                backgroundPosition: "0 10px",
              }}
            />

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "w-full h-full min-h-[300px] lg:min-h-[400px] bg-transparent resize-none",
                "text-xl sm:text-2xl lg:text-[1.7rem]",
                fontClass,
                inkTextClass,
                "quill-cursor",
                "placeholder:text-ink-light/30 placeholder:italic placeholder:text-lg",
                "focus:outline-none transition-all duration-300",
                "overflow-y-auto scrollbar-hide",
                showInkEffect && "animate-ink-spread"
              )}
              style={{ 
                lineHeight: "32px",
                textShadow: "0 0 1px currentColor",
                scrollBehavior: "smooth",
              }}
            />
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-ink/10 flex justify-between items-center relative z-10 flex-wrap gap-2">
            <span className="text-[10px] lg:text-xs text-ink-light font-serif italic">
              {entry ? `Last written: ${format(new Date(entry.updatedAt), "h:mm a")}` : "New entry"}
            </span>
            
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Export Button */}
              <button
                onClick={onExport}
                disabled={allEntries.length === 0}
                className={cn(
                  "flex items-center gap-1 transition-all text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg",
                  allEntries.length > 0
                    ? "bg-magic-glow/10 text-magic-glow hover:bg-magic-glow/20 border border-magic-glow/30"
                    : "bg-ink/5 text-ink-light/50 cursor-not-allowed"
                )}
                title="Export all entries as PDF"
              >
                <FileDown className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="font-serif hidden sm:inline">Export</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={!hasChanges && !content.trim()}
                className={cn(
                  "flex items-center gap-1 transition-all text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg",
                  justSaved 
                    ? "bg-green-500/20 text-green-700" 
                    : hasChanges
                      ? "bg-gold/20 text-gold hover:bg-gold/30 border border-gold/40"
                      : "bg-ink/5 text-ink-light/50 cursor-not-allowed"
                )}
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span className="font-serif">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span className="font-serif hidden sm:inline">Save</span>
                  </>
                )}
              </button>

              {/* Erase Button */}
              {entry && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="font-serif hidden sm:inline">Erase</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Cover - Right Side */}
      <div className="leather-texture w-3 lg:w-4 rounded-r-lg hidden sm:block flex-shrink-0" />
    </div>
  );
});
