import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";
import { ThemeToggle } from "../components/ThemeToggle";
import { Toaster } from "../components/Toaster";
import { ExamCountdown } from "../components/ExamCountdown";
import { daysLeft } from "../lib/time";
import { EXAM } from "../data/curriculum";
import { useProgress } from "../store/useProgress";
import styles from "./AppShell.module.css";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/topics", label: "Topics", icon: "topics" },
  { to: "/labs", label: "Labs", icon: "labs" },
  { to: "/log", label: "Log", icon: "clock" },
  { to: "/analytics", label: "Analytics", icon: "analytics" },
  { to: "/goals", label: "Goals", icon: "target" },
];

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/topics": "Topics",
  "/labs": "Labs",
  "/log": "Log",
  "/analytics": "Analytics",
  "/goals": "Goals",
  "/settings": "Settings",
};

export function AppShell() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "AWS SAA";
  const examDate = useProgress((s) => s.settings.profile.examDate);
  const left = daysLeft(undefined, examDate ?? EXAM);

  // Click-to-focus: magnify the live countdown and blur everything behind it.
  const [focusCountdown, setFocusCountdown] = useState(false);
  useEffect(() => {
    if (!focusCountdown) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocusCountdown(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusCountdown]);

  return (
    <div className={styles.shell}>
      <div className={styles.brandCell}>
        <div className={styles.mark}>
          <Icon name="labs" size={17} strokeWidth={2.25} />
        </div>
        <div className={styles.brandText}>
          <b>AWS SAA</b>
          <span>SAA-C03</span>
        </div>
      </div>

      <header className={styles.topbar}>
        <div className={styles.pageTitle}>{title}</div>
        <div className={styles.spacer} />
        <button
          type="button"
          className={styles.countdown}
          onClick={() => setFocusCountdown(true)}
          title="Focus the countdown"
          aria-label="Open full-screen countdown"
        >
          <b>{left}</b>
          <span>days to exam</span>
        </button>
        <span className={styles.topThemeToggle}><ThemeToggle /></span>
        <NavLink
          to="/settings"
          className={({ isActive }) => clsx(styles.iconBtn, isActive && styles.iconBtnActive)}
          title="Settings"
          aria-label="Settings"
        >
          <Icon name="settings" size={18} />
        </NavLink>
      </header>

      <nav className={styles.nav} aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.navActive)}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
        <div className={styles.navSpacer} />
        <NavLink to="/settings" className={({ isActive }) => clsx(styles.navLink, isActive && styles.navActive)}>
          <Icon name="settings" size={18} />
          Settings
        </NavLink>
        <div className={styles.navFoot}>Preview build · v0</div>
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <nav className={styles.tabbar} aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => clsx(styles.tab, isActive && styles.tabActive)}
          >
            <Icon name={item.icon} size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {focusCountdown && (
        <div
          className={styles.cdOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Exam countdown"
          onClick={() => setFocusCountdown(false)}
        >
          <button className={styles.cdClose} onClick={() => setFocusCountdown(false)} aria-label="Close countdown">
            <Icon name="close" size={20} />
          </button>
          <div className={styles.cdModal} onClick={(e) => e.stopPropagation()}>
            <ExamCountdown big />
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
