// Analytics derivations over sessions + topic progress. Pure and typed, like
// lib/stats — no React, no store access.

import { EXAM, START, TOPICS, WEEKS } from "../data/curriculum";
import type { ProgressData } from "../store/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface WeekHours { week: number; hours: number; focus: string; }
export interface MonthHours { key: string; label: string; hours: number; }
export interface HardTopic { id: string; name: string; confidence: number | null; tag: "weak" | "strong" | null; }

export interface Analytics {
  totalHours: number;
  activeDays: number;
  avgSession: number;
  mostActiveWeek: { week: number; hours: number; focus: string } | null;
  hoursByWeek: WeekHours[];
  hoursByMonth: MonthHours[];
  confidenceDist: { score: number; count: number }[];
  rated: number;
  hardest: HardTopic[];
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeAnalytics(p: ProgressData): Analytics {
  const sessions = Object.values(p.sessions).filter((s) => s.hours > 0);
  const totalHours = round1(sessions.reduce((a, s) => a + s.hours, 0));
  const activeDays = sessions.length;

  // Hours per program week (each week's inclusive ISO date range).
  const hoursByWeek: WeekHours[] = WEEKS.map((w) => {
    const hours = sessions
      .filter((s) => s.date >= w.starts && s.date <= w.ends)
      .reduce((a, s) => a + s.hours, 0);
    return { week: w.id, hours: round1(hours), focus: w.focus };
  });

  const mostActive = hoursByWeek.reduce<WeekHours | null>((best, w) => (w.hours > (best?.hours ?? 0) ? w : best), null);

  // Hours per calendar month across the program span.
  const monthKeys: string[] = [];
  {
    const start = new Date(START + "T00:00:00Z");
    const end = new Date(EXAM + "T00:00:00Z");
    const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    while (cur <= end) {
      monthKeys.push(`${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}`);
      cur.setUTCMonth(cur.getUTCMonth() + 1);
    }
  }
  const hoursByMonth: MonthHours[] = monthKeys.map((key) => {
    const hours = sessions.filter((s) => s.date.slice(0, 7) === key).reduce((a, s) => a + s.hours, 0);
    return { key, label: MONTHS[Number(key.slice(5, 7)) - 1], hours: round1(hours) };
  });

  // Confidence distribution across all topics that carry a rating.
  const confidenceDist = [1, 2, 3, 4, 5].map((score) => ({
    score,
    count: TOPICS.filter((t) => p.topics[t.id]?.confidence === score).length,
  }));
  const rated = confidenceDist.reduce((a, d) => a + d.count, 0);

  // Hardest = weak-tagged first, then lowest confidence. Only rated/tagged topics.
  const hardest: HardTopic[] = TOPICS.map((t) => {
    const pr = p.topics[t.id];
    return { id: t.id, name: t.name, confidence: pr?.confidence ?? null, tag: pr?.tag ?? null };
  })
    .filter((t) => t.tag === "weak" || (t.confidence != null && t.confidence <= 3))
    .sort((a, b) => {
      if ((a.tag === "weak" ? 0 : 1) !== (b.tag === "weak" ? 0 : 1)) return a.tag === "weak" ? -1 : 1;
      return (a.confidence ?? 0) - (b.confidence ?? 0);
    })
    .slice(0, 6);

  return {
    totalHours,
    activeDays,
    avgSession: activeDays ? round1(totalHours / activeDays) : 0,
    mostActiveWeek: mostActive && mostActive.hours > 0 ? mostActive : null,
    hoursByWeek,
    hoursByMonth,
    confidenceDist,
    rated,
    hardest,
  };
}
