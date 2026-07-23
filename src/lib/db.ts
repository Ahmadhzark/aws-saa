import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

// IndexedDB is the app's durable store. `kv` holds serialized app state (the
// Zustand slice); `files` is reserved for lab attachments (blobs) in a later
// phase — screenshots and .pkt files that localStorage could never hold.
interface SaaDB extends DBSchema {
  kv: { key: string; value: string };
  files: { key: string; value: Blob };
}

let dbPromise: Promise<IDBPDatabase<SaaDB>> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB<SaaDB>("aws-saa", 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("kv")) database.createObjectStore("kv");
        if (!database.objectStoreNames.contains("files")) database.createObjectStore("files");
      },
    });
  }
  return dbPromise;
}

export async function idbGet(key: string): Promise<string | null> {
  return (await (await db()).get("kv", key)) ?? null;
}

export async function idbSet(key: string, value: string): Promise<void> {
  await (await db()).put("kv", value, key);
}

export async function idbDel(key: string): Promise<void> {
  await (await db()).delete("kv", key);
}

// Lab attachments: blobs (screenshots, config/.pkt files) keyed by a generated
// id. Metadata (name, type, size) lives in the persisted state; the bytes here.
export async function fileSet(id: string, blob: Blob): Promise<void> {
  await (await db()).put("files", blob, id);
}

export async function fileGet(id: string): Promise<Blob | null> {
  return (await (await db()).get("files", id)) ?? null;
}

export async function fileDel(id: string): Promise<void> {
  await (await db()).delete("files", id);
}
