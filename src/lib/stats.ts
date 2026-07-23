// Pure derivations over curriculum + user progress. No React, no store access —
// takes plain data so it stays trivially testable and cheap to memoize.

import { DOMAINS, EXAM, LABS, TOPICS, TOTAL_HOURS, TOTAL_LABS, TOTAL_TOPICS, TOTAL_WEEKS } from "../data/curriculum";
import type { ProgressData } from "../store/types";
import { currentWeek, dayDiff, daysLeft, elapsedDays, todayISO } from "./time";

export interface DomainStat {
  id: string;
  name: string;
  weight: number;
  done: number;
  total: number;
  percent: number;
}

export interface PaceStat {
  perWeekActual: number;
  perWeekNeeded: number;
  hoursLeft: number;
  projectedFinish: string | null;
  slack: number | null; // days early (+) / late (-) vs exam
  level: "ok" | "warn" | "bad";
}

export interface Stats {
  overall: number; // weighted %
  topicsDone: number;
  labsDone: number;
  hoursDone: number;
  hoursToday: number;
  week: number;
  daysLeft: number;
  streak: { current: number; best: number };
  avgConfidence: number | null;
  schedule: { level: "ok" | "warn" | "bad"; label: string };
  domains: DomainStat[];
  pace: PaceStat;
}

function weightedPercent(p: ProgressData): number {
  let pct = 0;
  for (const d of DOMAINS) {
    const ts = TOPICS.filter((t) => t.domainId === d.id);
    if (!ts.length) continue;
    const done = ts.filter((t) => p.topics[t.id]?.done).length;
    pct += (done / ts.length) * d.weight;
  }
  return Math.round(pct);
}

function streaks(p: ProgressData, today = todayISO()): { current: number; best: number } {
  const days = Object.values(p.sessions).filter((s) => s.hours > 0).map((s) => s.date).sort();
  if (!days.length) return { current: 0, best: 0 };
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = dayDiff(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  const has = (d: string) => (p.sessions[d]?.hours ?? 0) > 0;
  const shift = (d: string, n: number) => {
    const t = new Date(Date.parse(d + "T00:00:00Z") + n * 86400000);
    return t.toISOString().slice(0, 10);
  };
  let cursor = has(today) ? today : shift(today, -1);
  let current = 0;
  while (has(cursor)) {
    current++;
    cursor = shift(cursor, -1);
  }
  return { current, best };
}

function pace(hoursDone: number, today = todayISO()): PaceStat {
  const elapsed = Math.max(1, elapsedDays(today));
  const left = daysLeft(today);
  const hoursLeft = Math.max(0, TOTAL_HOURS - hoursDone);
  const perDay = hoursDone / elapsed;
  const perWeekActual = Math.round(perDay * 7 * 10) / 10;
  const perWeekNeeded = left > 0 ? Math.round((hoursLeft / (left / 7)) * 10) / 10 : 0;

  let projectedFinish: string | null = null;
  if (hoursLeft === 0) projectedFinish = today;
  else if (perDay > 0) {
    const days = Math.ceil(hoursLeft / perDay);
    projectedFinish = new Date(Date.parse(today + "T00:00:00Z") + days * 86400000).toISOString().slice(0, 10);
  }
  const slack = projectedFinish ? dayDiff(projectedFinish, EXAM) : null;
  const level = hoursLeft === 0 ? "ok" : projectedFinish == null ? "bad" : projectedFinish <= EXAM ? "ok" : "warn";
  return { perWeekActual, perWeekNeeded, hoursLeft: Math.round(hoursLeft * 10) / 10, projectedFinish, slack, level };
}

function schedule(topicsDone: number, today = todayISO()): { level: "ok" | "warn" | "bad"; label: string } {
  // Expected completions scale with elapsed weeks over the whole program.
  const expected = Math.min(TOTAL_TOPICS, Math.round(((currentWeek(today) - 1) / TOTAL_WEEKS) * TOTAL_TOPICS));
  const delta = topicsDone - expected;
  if (delta >= 0) return { level: "ok", label: "on track" };
  if (delta >= -2) return { level: "warn", label: `${delta} topics` };
  return { level: "bad", label: `${delta} topics` };
}

export function computeStats(p: ProgressData, today = todayISO()): Stats {
  const hoursDone = Math.round(Object.values(p.sessions).reduce((s, x) => s + x.hours, 0) * 10) / 10;
  const topicsDone = TOPICS.filter((t) => p.topics[t.id]?.done).length;
  const labsDone = LABS.filter((l) => p.labs[l.id]?.status === "done").length;
  const rated = TOPICS.map((t) => p.topics[t.id]?.confidence).filter((c): c is number => c != null);

  return {
    overall: weightedPercent(p),
    topicsDone,
    labsDone,
    hoursDone,
    hoursToday: Math.round((p.sessions[today]?.hours ?? 0) * 10) / 10,
    week: currentWeek(today),
    daysLeft: daysLeft(today),
    streak: streaks(p, today),
    avgConfidence: rated.length ? Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10 : null,
    schedule: schedule(topicsDone, today),
    domains: DOMAINS.map((d) => {
      const ts = TOPICS.filter((t) => t.domainId === d.id);
      const done = ts.filter((t) => p.topics[t.id]?.done).length;
      return { id: d.id, name: d.name, weight: d.weight, done, total: ts.length, percent: ts.length ? Math.round((done / ts.length) * 100) : 0 };
    }),
    pace: pace(hoursDone, today),
  };
}

export { TOTAL_LABS, TOTAL_TOPICS, TOTAL_HOURS };
