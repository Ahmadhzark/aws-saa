// Domain types shared across the app. The curriculum is static reference data;
// user progress is layered on top separately (see the store), so these stay
// free of any completion/progress fields.

export type DomainId = `${number}.0`;
export type Difficulty = "E" | "M" | "H";

export interface Domain {
  id: string; // "3.0"
  name: string;
  weight: number; // percent share of the exam
  order: number;
}

export interface Week {
  id: number; // 1..24
  focus: string;
  starts: string; // ISO date
  ends: string; // ISO date
  label: string; // "Jul 16 – Jul 22"
}

export interface Topic {
  id: string; // "3.1"
  name: string;
  hours: number;
  week: number;
  domainId: string; // derived, e.g. "3.0"
  blurb: string; // the exam angle
}

export interface Lab {
  id: string; // "L001"
  name: string;
  difficulty: Difficulty;
  minutes: number;
  tech: string;
  week: number;
  topic: string;
}
