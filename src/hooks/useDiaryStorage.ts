import { useState, useEffect, useCallback } from "react";
import { Mood } from "@/components/MoodSelector";
import { InkColor } from "@/components/InkSelector";
import { WritingStyle } from "@/components/WritingStyleSelector";
import { DiaryFont } from "@/components/FontSelector";

import {
  getAllEntries,
  addEntry as dbAddEntry,
  updateEntry as dbUpdateEntry,
  deleteEntry as dbDeleteEntry,
} from "@/lib/indexedDB";

/* =========================
   TYPES
========================= */

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

/* =========================
   HOOK
========================= */

export function useDiaryStorage(password: string) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* 🔹 LOAD ENTRIES (decrypts using password) */
  const loadEntries = async () => {
    if (!password) return;

    try {
      const data = await getAllEntries(password);
      const sorted = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sorted);
    } catch (err) {
      console.error("Failed to decrypt entries (wrong password?)", err);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔹 INITIAL LOAD */
  useEffect(() => {
    loadEntries();
  }, [password]);

  /* =========================
     CRUD OPERATIONS
  ========================= */

  const addEntry = useCallback(
    async (
      date: string,
      content: string,
      mood?: Mood,
      inkColor?: InkColor,
      writingStyle?: WritingStyle,
      diaryFont?: DiaryFont,
      isSealed?: boolean
    ) => {
      if (!password) return;

      const now = Date.now();

      const entry: DiaryEntry = {
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

      await dbAddEntry(entry, password);
      await loadEntries();
      return entry;
    },
    [password]
  );

  const updateEntry = useCallback(
    async (
      id: string,
      content: string,
      mood?: Mood,
      inkColor?: InkColor,
      writingStyle?: WritingStyle,
      diaryFont?: DiaryFont,
      isSealed?: boolean
    ) => {
      if (!password) return;

      await dbUpdateEntry(
        id,
        {
          content,
          mood,
          inkColor,
          writingStyle,
          diaryFont,
          isSealed,
          updatedAt: Date.now(),
        },
        password
      );

      await loadEntries();
    },
    [password]
  );

  const toggleSeal = useCallback(
    async (id: string) => {
      if (!password) return;

      const entry = entries.find((e) => e.id === id);
      if (!entry) return;

      await dbUpdateEntry(
        id,
        {
          isSealed: !entry.isSealed,
          updatedAt: Date.now(),
        },
        password
      );

      await loadEntries();
    },
    [entries, password]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!password) return;

      await dbDeleteEntry(id);
      await loadEntries();
    },
    [password]
  );

  const getEntryByDate = useCallback(
    (date: string) => entries.find((e) => e.date === date),
    [entries]
  );

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleSeal,
    getEntryByDate,
  };
}
