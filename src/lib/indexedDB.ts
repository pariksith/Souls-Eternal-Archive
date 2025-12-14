import { openDB } from "idb";
import type { DiaryEntry } from "@/hooks/useDiaryStorage";
import { encryptText, decryptText } from "@/lib/crypto";

const DB_NAME = "souls-eternal-archive-db";
const STORE_NAME = "entries";
const DB_VERSION = 1;

/**
 * IndexedDB initialization
 * This runs as soon as ANY db function is called
 */
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

/* =========================
   DB OPERATIONS
========================= */

export async function getAllEntries(password: string): Promise<DiaryEntry[]> {
  const db = await dbPromise;
  const raw = await db.getAll(STORE_NAME);

  const decrypted = [];

  for (const entry of raw) {
    decrypted.push({
      ...entry,
      content: await decryptText(entry.content, password),
    });
  }

  return decrypted;
}

export async function addEntry(entry: DiaryEntry, password: string) {
  const db = await dbPromise;

  const encrypted = await encryptText(entry.content, password);

  await db.put(STORE_NAME, {
    ...entry,
    content: encrypted, // 🔒 encrypted object
  });
}

export async function updateEntry(
  id: string,
  data: Partial<DiaryEntry>,
  password: string
) {
  const db = await dbPromise;
  const existing = await db.get(STORE_NAME, id);
  if (!existing) return;

  const encrypted =
    data.content !== undefined
      ? await encryptText(data.content, password)
      : existing.content;

  await db.put(STORE_NAME, {
    ...existing,
    ...data,
    content: encrypted,
  });
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
}
