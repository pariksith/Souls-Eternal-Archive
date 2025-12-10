import { useState, useEffect, useCallback } from "react";
import { Mood } from "@/components/MoodSelector";
import { InkColor } from "@/components/InkSelector";
import { WritingStyle } from "@/components/WritingStyleSelector";
import { DiaryFont } from "@/components/FontSelector";

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: Mood;
  inkColor?: InkColor;
  writingStyle?: WritingStyle;
  diaryFont?: DiaryFont;
  isSealed?: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "magical_diary_entries";

export function useDiaryStorage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
      }
    } catch (error) {
      console.error("Failed to load diary entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEntries = useCallback((newEntries: DiaryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error("Failed to save diary entries:", error);
    }
  }, []);

  const addEntry = useCallback((date: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => {
    const now = Date.now();
    const newEntry: DiaryEntry = {
      id: `entry_${now}`,
      date,
      content,
      mood,
      inkColor,
      writingStyle,
      diaryFont,
      isSealed,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...entries, newEntry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    saveEntries(updated);
    return newEntry;
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, content: string, mood?: Mood, inkColor?: InkColor, writingStyle?: WritingStyle, diaryFont?: DiaryFont, isSealed?: boolean) => {
    const updated = entries.map(entry =>
      entry.id === id
        ? { ...entry, content, mood, inkColor, writingStyle, diaryFont, isSealed, updatedAt: Date.now() }
        : entry
    );
    saveEntries(updated);
  }, [entries, saveEntries]);

  const toggleSeal = useCallback((id: string) => {
    const updated = entries.map(entry =>
      entry.id === id
        ? { ...entry, isSealed: !entry.isSealed, updatedAt: Date.now() }
        : entry
    );
    saveEntries(updated);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    const updated = entries.filter(entry => entry.id !== id);
    saveEntries(updated);
  }, [entries, saveEntries]);

  const getEntryByDate = useCallback((date: string) => {
    return entries.find(entry => entry.date === date);
  }, [entries]);

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
    toggleSeal,
  };
}
