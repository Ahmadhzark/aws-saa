// User-progress shapes, stored separately from the static curriculum and keyed
// by topic/lab id and session date. Fields are optional so records stay sparse
// — an untouched topic has no entry at all.

export type LabStatus = "todo" | "doing" | "done";
export type TopicTag = "weak" | "strong";

export interface TopicProgress {
  done?: boolean;
  doneAt?: string | null; // ISO date first completed
  confidence?: number | null; // 1..5
  notes?: string;
  revisions?: number;
  lastStudied?: string | null;
  tag?: TopicTag | null;
  bookmarked?: boolean;
}

export interface FileRef {
  id: string; // key into the IndexedDB `files` blob store
  name: string;
  type: string; // MIME
  size: number; // bytes
  addedAt: string; // ISO date
}

export interface LabProgress {
  status?: LabStatus;
  doneAt?: string | null;
  minutesTaken?: number | null;
  skills?: string;
  mistakes?: string;
  reflection?: string;
  notes?: string;
  attachments?: FileRef[];
}

export interface Session {
  date: string; // "YYYY-MM-DD"
  hours: number;
  note?: string;
}

// The 4 selectable accent themes. Each adapts to both light & dark modes.
export type Accent = "aurora" | "azure" | "emerald" | "violet" | "amber";

export interface Profile {
  name: string;
  age: number | null;
  examDate: string | null; // ISO "YYYY-MM-DD" — when the user plans to sit the exam
}

export interface Settings {
  weeklyHoursTarget: number;
  accent: Accent;
  profile: Profile;
  onboarded: boolean; // false until the first-run flow is completed
}

export interface ProgressData {
  topics: Record<string, TopicProgress>;
  labs: Record<string, LabProgress>;
  sessions: Record<string, Session>; // keyed by date
}
