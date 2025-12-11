import { useState, lazy, Suspense } from "react";
import { format, addDays, subDays } from "date-fns";
import { Menu, X } from "lucide-react";
import { useDiaryStorage } from "@/hooks/useDiaryStorage";
import { Mood } from "@/components/MoodSelector";
import { InkColor } from "@/components/InkSelector";
import { WritingStyle } from "@/components/WritingStyleSelector";
import { DiaryFont } from "@/components/FontSelector";
import { exportToPDF } from "@/utils/pdfExport";
import { cn } from "@/lib/utils";
import { MusicPlayer } from "@/components/MusicPlayer";

const MagicalParticles = lazy(() => import("@/components/MagicalParticles").then(m => ({ default: m.MagicalParticles })));
const DiaryPage = lazy(() => import("@/components/DiaryPage").then(m => ({ default: m.DiaryPage })));
const EntriesSidebar = lazy(() => import("@/components/EntriesSidebar").then(m => ({ default: m.EntriesSidebar })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { entries, isLoading, addEntry, updateEntry, deleteEntry, getEntryByDate, toggleSeal } = useDiaryStorage();

  const currentEntry = getEntryByDate(format(selectedDate, "yyyy-MM-dd"));

  const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate(prev => direction === "prev" ? subDays(prev, 1) : addDays(prev, 1));
  };

  const handleSave = (date: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => {
    addEntry(date, content, mood, inkColor, writingStyle, diaryFont, isSealed);
  };

  const handleUpdate = (id: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => {
    updateEntry(id, content, mood, inkColor, writingStyle, diaryFont, isSealed);
  };

  const handleExport = () => {
    if (entries.length > 0) {
      exportToPDF(entries);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="font-handwriting text-3xl gold-emboss">Opening the ancient tome...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-background relative overflow-hidden flex">
      <Suspense fallback={null}>
        <MagicalParticles />
      </Suspense>

      <div className="fixed inset-0 bg-gradient-to-br from-leather-dark via-background to-leather/80 -z-10" />

      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-full leather-texture border-2 border-gold/40 text-foreground shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "fixed lg:relative top-0 left-0 h-full z-50 transition-transform duration-300",
        "lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-foreground/10 text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <Suspense fallback={<LoadingSpinner />}>
          <EntriesSidebar
            entries={entries}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setMobileMenuOpen(false);
            }}
          />
        </Suspense>
      </div>

      <main className="flex-1 p-4 lg:p-8 flex items-center justify-center overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <DiaryPage
            selectedDate={selectedDate}
            entry={currentEntry}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onDelete={deleteEntry}
            onDateChange={handleDateChange}
            onToggleSeal={toggleSeal}
            onExport={handleExport}
            allEntries={entries}
          />
        </Suspense>
      </main>

      <MusicPlayer />
    </div>
  );
};

export default Index;
