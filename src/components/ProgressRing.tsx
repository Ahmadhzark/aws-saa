import { useId } from "react";
import styles from "./ProgressRing.module.css";

interface ProgressRingProps {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  valueSize?: number;
}

export function ProgressRing({ value, size = 132, stroke = 11, label, valueSize = 30 }: ProgressRingProps) {
  // useId() yields colon-wrapped ids (":r0:") that are unsafe in url(#…) refs.
  const gradId = "ring" + useId().replace(/:/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c * (1 - clamped / 100);

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg className={styles.svg} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--brand-2)" />
            <stop offset="1" stopColor="var(--brand)" />
          </linearGradient>
        </defs>
        <circle className={styles.track} cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className={styles.fill}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ stroke: `url(#${gradId})` }}
        />
      </svg>
      <div className={styles.center}>
        <div className={styles.value} style={{ fontSize: valueSize }}>
          {Math.round(clamped)}
          <small>%</small>
        </div>
        {label && <div className={styles.label}>{label}</div>}
      </div>
    </div>
  );
}
