import { useMemo } from "react";
import { computeStats } from "../lib/stats";
import type { Stats } from "../lib/stats";
import { useProgress } from "./useProgress";

/// Live derived stats. Recomputes only when a progress slice actually changes.
export function useStats(): Stats {
  const topics = useProgress((s) => s.topics);
  const labs = useProgress((s) => s.labs);
  const sessions = useProgress((s) => s.sessions);
  return useMemo(() => computeStats({ topics, labs, sessions }), [topics, labs, sessions]);
}
