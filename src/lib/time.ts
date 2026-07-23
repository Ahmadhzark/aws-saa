import { EXAM, START, TOTAL_WEEKS } from "../data/curriculum";

export function todayISO(now = new Date()): string {
  // Local calendar day (not UTC): a late-night session belongs to that day.
  const d = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

export function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);
}

export function daysLeft(today = todayISO()): number {
  return Math.max(0, dayDiff(today, EXAM));
}

export function elapsedDays(today = todayISO()): number {
  return Math.max(0, dayDiff(START, today));
}

export function currentWeek(today = todayISO()): number {
  return Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(elapsedDays(today) / 7) + 1));
}
