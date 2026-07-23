import { useMemo } from "react";
import { computeAnalytics } from "../lib/analytics";
import type { Analytics } from "../lib/analytics";
import { useProgress } from "./useProgress";

export function useAnalytics(): Analytics {
  const topics = useProgress((s) => s.topics);
  const labs = useProgress((s) => s.labs);
  const sessions = useProgress((s) => s.sessions);
  return useMemo(() => computeAnalytics({ topics, labs, sessions }), [topics, labs, sessions]);
}
