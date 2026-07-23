import clsx from "clsx";
import styles from "./ConfidenceDots.module.css";

interface ConfidenceDotsProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  id: string;
  showLabel?: boolean;
}

export function ConfidenceDots({ value, onChange, id, showLabel = true }: ConfidenceDotsProps) {
  const v = value ?? 0;
  return (
    <div className={styles.wrap}>
      {showLabel && <span className={styles.label}>conf</span>}
      <div className={styles.dots}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={clsx(styles.dot, v >= n && styles.on)}
            aria-label={`Confidence ${n} of 5 for ${id}`}
            aria-pressed={v >= n}
            // Re-tapping the current value clears it, so a rating is never a one-way door.
            onClick={() => onChange(v === n ? null : n)}
          >
            <i />
          </button>
        ))}
      </div>
    </div>
  );
}
