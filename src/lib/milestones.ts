// Achievements = derived milestones. No extra persistence: each is a threshold
// over the same stats the rest of the app already computes, so they unlock
// automatically and can never drift out of sync with real progress.

import type { IconName } from "../components/Icon";
import type { Analytics } from "./analytics";
import type { Stats } from "./stats";

export interface Milestone {
  id: string;
  group: string;
  icon: IconName;
  label: string;
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
}

interface Tier {
  group: string;
  icon: IconName;
  unit: string;
  current: number;
  tiers: { target: number; label: string }[];
}

export function computeMilestones(stats: Stats, analytics: Analytics): Milestone[] {
  const specs: Tier[] = [
    {
      group: "Overall progress", icon: "target", unit: "%", current: stats.overall,
      tiers: [
        { target: 25, label: "Off the Ground" },
        { target: 50, label: "Cruising Altitude" },
        { target: 75, label: "Final Approach" },
        { target: 100, label: "Well-Architected" },
      ],
    },
    {
      group: "Topics", icon: "topics", unit: "", current: stats.topicsDone,
      tiers: [
        { target: 10, label: "Getting Traction" },
        { target: 25, label: "Deep in the Docs" },
        { target: 44, label: "No Topic Left Behind" },
      ],
    },
    {
      group: "Labs", icon: "labs", unit: "", current: stats.labsDone,
      tiers: [
        { target: 5, label: "Hands on the Console" },
        { target: 15, label: "Builder Mode" },
        { target: 24, label: "Master Builder" },
      ],
    },
    {
      group: "Study hours", icon: "clock", unit: "h", current: analytics.totalHours,
      tiers: [
        { target: 25, label: "Warmed Up" },
        { target: 60, label: "In the Zone" },
        { target: 90, label: "Grind Mode" },
        { target: 120, label: "Full Send" },
      ],
    },
    {
      group: "Streak", icon: "flame", unit: "d", current: stats.streak.best,
      tiers: [
        { target: 3, label: "On a Roll" },
        { target: 7, label: "Week Warrior" },
        { target: 14, label: "Unstoppable" },
        { target: 30, label: "Iron Discipline" },
      ],
    },
  ];

  const out: Milestone[] = [];
  for (const s of specs) {
    for (const t of s.tiers) {
      out.push({
        id: `${s.group}-${t.target}`,
        group: s.group,
        icon: s.icon,
        label: t.label,
        current: s.current,
        target: t.target,
        unit: s.unit,
        unlocked: s.current >= t.target,
      });
    }
  }
  return out;
}
