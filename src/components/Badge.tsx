import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type Tone = "neutral" | "brand" | "ok" | "warn" | "bad";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, tone = "neutral", dot, className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
