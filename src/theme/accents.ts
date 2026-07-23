import { useEffect } from "react";
import type { Accent } from "../store/types";
import { useProgress } from "../store/useProgress";

// Metadata for the four accent themes. `swatch` is the representative brand hue
// used in the picker chips; the full palette lives in tokens.css keyed by
// [data-accent]. The light/dark mode is orthogonal — each accent adapts to both.
export interface AccentMeta {
  id: Accent;
  label: string;
  swatch: string; // light-mode brand hue, for the picker chip
}

export const ACCENTS: AccentMeta[] = [
  { id: "azure", label: "Azure", swatch: "#2563eb" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "violet", label: "Violet", swatch: "#7c3aed" },
  { id: "amber", label: "Amber", swatch: "#d97706" },
];

const ACCENT_KEY = "aws-saa.accent"; // mirrored for the pre-paint script in index.html

// Reflect the chosen accent onto <html data-accent> and mirror it to
// localStorage so index.html can paint the right brand hue before React boots.
// Source of truth stays in the persisted progress store.
export function useAccentSync(): void {
  const accent = useProgress((s) => s.settings.accent);
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    try {
      localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      /* storage blocked */
    }
  }, [accent]);
}
