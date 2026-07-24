import clsx from "clsx";
import { START, TOTAL_WEEKS, shiftDate } from "../data/curriculum";
import type { Session } from "../store/types";
import styles from "./Heatmap.module.css";

function level(hours: number): 0 | 1 | 2 | 3 | 4 {
  if (!hours) return 0;
  if (hours < 1) return 1;
  if (hours < 2) return 2;
  if (hours < 3.5) return 3;
  return 4;
}

interface HeatmapProps {
  sessions: Record<string, Session>;
  today: string;
  selected: string | null;
  onSelect: (date: string) => void;
}

// N columns (program weeks) × 7 rows (day of week) = the whole program in cells,
// so the grid IS the schedule rather than a rolling window.
export function Heatmap({ sessions, today, selected, onSelect }: HeatmapProps) {
  const cells = [];
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      const date = shiftDate(START, w * 7 + d);
      const hours = sessions[date]?.hours ?? 0;
      cells.push(
        <button
          key={date}
          type="button"
          className={clsx(
            styles.cell,
            date > today && styles.future,
            date === today && styles.today,
            date === selected && styles.selected,
          )}
          data-level={level(hours)}
          title={`${date} — ${hours}h`}
          aria-label={`${date}: ${hours} hours`}
          onClick={() => onSelect(date)}
        />,
      );
    }
  }

  const weekLabels = Array.from({ length: TOTAL_WEEKS }, (_, i) =>
    i % 4 === 0 ? (
      <span key={i} style={{ gridColumn: i + 1 }}>W{i + 1}</span>
    ) : null,
  );

  return (
    <div className={styles.scroll}>
      <div className={styles.inner}>
        <div className={styles.weeks} style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }} aria-hidden="true">{weekLabels}</div>
        <div className={styles.grid} role="img" aria-label="Study hours across the program">{cells}</div>
      </div>
    </div>
  );
}
