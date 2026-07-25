import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import { idbDel, idbGet, idbSet } from "../lib/db";
import { todayISO } from "../lib/time";
import type { Accent, FileRef, LabProgress, LabStatus, Note, Profile, ProgressData, Resource, Settings, TopicTag } from "./types";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Async storage adapter so the whole progress slice persists to IndexedDB.
const idbStorage: StateStorage = {
  getItem: (name) => idbGet(name),
  setItem: (name, value) => idbSet(name, value),
  removeItem: (name) => idbDel(name),
};

interface ProgressStore extends ProgressData {
  settings: Settings;
  notes: Note[];
  resources: Resource[];
  addNote: () => string;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "body">>) => void;
  deleteNote: (id: string) => void;
  addResource: (r: Pick<Resource, "title" | "url" | "note">) => void;
  deleteResource: (id: string) => void;
  setWeeklyTarget: (hours: number) => void;
  setAccent: (accent: Accent) => void;
  setProfile: (patch: Partial<Profile>) => void;
  completeOnboarding: (profile: Profile) => void;
  toggleTopic: (id: string) => void;
  setConfidence: (id: string, value: number | null) => void;
  setTopicNotes: (id: string, notes: string) => void;
  setTopicTag: (id: string, tag: TopicTag | null) => void;
  toggleBookmark: (id: string) => void;
  bumpRevision: (id: string) => void;
  setLabStatus: (id: string, status: LabStatus) => void;
  updateLab: (id: string, patch: Partial<LabProgress>) => void;
  addLabAttachment: (id: string, ref: FileRef) => void;
  removeLabAttachment: (id: string, refId: string) => void;
  logSession: (hours: number, note?: string, date?: string) => void;
  removeSession: (date: string) => void;
  resetAll: () => void;
}

const EMPTY: ProgressData = { topics: {}, labs: {}, sessions: {} };

const DEFAULT_SETTINGS: Settings = {
  weeklyHoursTarget: 10,
  accent: "aurora",
  profile: { name: "", age: null, examDate: null },
  onboarded: false,
};

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      settings: DEFAULT_SETTINGS,
      notes: [],
      resources: [],

      addNote: () => {
        const id = uid();
        const now = new Date().toISOString();
        set((s) => ({ notes: [{ id, title: "", body: "", createdAt: now, updatedAt: now }, ...s.notes] }));
        return id;
      },

      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)),
        })),

      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addResource: (r) =>
        set((s) => ({ resources: [{ id: uid(), createdAt: new Date().toISOString(), ...r }, ...s.resources] })),

      deleteResource: (id) => set((s) => ({ resources: s.resources.filter((r) => r.id !== id) })),

      setWeeklyTarget: (hours) =>
        set((s) => ({ settings: { ...s.settings, weeklyHoursTarget: Math.max(1, Math.min(60, Math.round(hours))) } })),

      setAccent: (accent) => set((s) => ({ settings: { ...s.settings, accent } })),

      setProfile: (patch) =>
        set((s) => ({ settings: { ...s.settings, profile: { ...s.settings.profile, ...patch } } })),

      completeOnboarding: (profile) =>
        set((s) => ({ settings: { ...s.settings, profile, onboarded: true } })),

      toggleTopic: (id) =>
        set((s) => {
          const cur = s.topics[id] ?? {};
          const done = !cur.done;
          return {
            topics: {
              ...s.topics,
              [id]: { ...cur, done, doneAt: done ? cur.doneAt ?? todayISO() : null, lastStudied: todayISO() },
            },
          };
        }),

      setConfidence: (id, value) =>
        set((s) => ({ topics: { ...s.topics, [id]: { ...s.topics[id], confidence: value } } })),

      setTopicNotes: (id, notes) =>
        set((s) => ({ topics: { ...s.topics, [id]: { ...s.topics[id], notes } } })),

      setTopicTag: (id, tag) =>
        set((s) => ({ topics: { ...s.topics, [id]: { ...s.topics[id], tag } } })),

      toggleBookmark: (id) =>
        set((s) => ({ topics: { ...s.topics, [id]: { ...s.topics[id], bookmarked: !s.topics[id]?.bookmarked } } })),

      bumpRevision: (id) =>
        set((s) => ({
          topics: { ...s.topics, [id]: { ...s.topics[id], revisions: (s.topics[id]?.revisions ?? 0) + 1, lastStudied: todayISO() } },
        })),

      setLabStatus: (id, status) =>
        set((s) => ({
          labs: { ...s.labs, [id]: { ...s.labs[id], status, doneAt: status === "done" ? s.labs[id]?.doneAt ?? todayISO() : null } },
        })),

      updateLab: (id, patch) =>
        set((s) => ({ labs: { ...s.labs, [id]: { ...s.labs[id], ...patch } } })),

      addLabAttachment: (id, ref) =>
        set((s) => ({
          labs: { ...s.labs, [id]: { ...s.labs[id], attachments: [...(s.labs[id]?.attachments ?? []), ref] } },
        })),

      removeLabAttachment: (id, refId) =>
        set((s) => ({
          labs: { ...s.labs, [id]: { ...s.labs[id], attachments: (s.labs[id]?.attachments ?? []).filter((a) => a.id !== refId) } },
        })),

      logSession: (hours, note, date = todayISO()) =>
        set((s) => {
          const prev = s.sessions[date];
          // Additive within a day: three 1h sessions read as 3h.
          const total = Math.round(((prev?.hours ?? 0) + hours) * 100) / 100;
          return { sessions: { ...s.sessions, [date]: { date, hours: total, note: note ?? prev?.note } } };
        }),

      removeSession: (date) =>
        set((s) => {
          const next = { ...s.sessions };
          delete next[date];
          return { sessions: next };
        }),

      resetAll: () => set({ ...EMPTY }),
    }),
    {
      name: "aws-saa.progress",
      version: 2,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({ topics: s.topics, labs: s.labs, sessions: s.sessions, settings: s.settings, notes: s.notes, resources: s.resources }),
      // Persisted state may predate the profile/accent/onboarding fields — backfill
      // defaults so a stored `settings` object never clobbers them with undefined.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressStore>;
        return {
          ...current,
          ...p,
          notes: p.notes ?? [],
          resources: p.resources ?? [],
          settings: {
            ...DEFAULT_SETTINGS,
            ...p.settings,
            profile: { ...DEFAULT_SETTINGS.profile, ...p.settings?.profile },
          },
        };
      },
    },
  ),
);

/// True once the store has finished rehydrating from IndexedDB — gate initial
/// UI on this so we never flash 0% before real data loads.
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useProgress.persist.hasHydrated());
  useEffect(() => {
    const unsub = useProgress.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useProgress.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
