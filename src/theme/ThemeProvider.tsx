import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemePref = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const KEY = "aws-saa.theme"; // kept in sync with the pre-paint script in index.html

interface ThemeContextValue {
  pref: ThemePref;
  resolved: Resolved;
  setPref: (p: ThemePref) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemDark(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(pref: ThemePref): Resolved {
  if (pref === "system") return systemDark() ? "dark" : "light";
  return pref;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) as ThemePref | null;
    return stored ?? "system";
  });
  const [resolved, setResolved] = useState<Resolved>(() => resolve(pref));

  // Apply the resolved theme to <html> and remember the preference.
  useEffect(() => {
    const r = resolve(pref);
    setResolved(r);
    document.documentElement.dataset.theme = r;
    try { localStorage.setItem(KEY, pref); } catch { /* storage blocked */ }
  }, [pref]);

  // Follow the OS when the preference is "system".
  useEffect(() => {
    if (pref !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r = systemDark() ? "dark" : "light";
      setResolved(r);
      document.documentElement.dataset.theme = r;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const setPref = useCallback((p: ThemePref) => setPrefState(p), []);
  const cycle = useCallback(
    () => setPrefState((p) => (p === "system" ? "light" : p === "light" ? "dark" : "system")),
    [],
  );

  const value = useMemo(() => ({ pref, resolved, setPref, cycle }), [pref, resolved, setPref, cycle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
