import clsx from "clsx";
import styles from "./BarChart.module.css";

export interface BarDatum {
  label: string;
  value: number;
  tipLabel?: string; // fuller label for the tooltip
  highlight?: boolean;
}

interface BarChartProps {
  data: BarDatum[];
  unit?: string;
  height?: number;
  labelEvery?: number; // show every Nth x-label (avoids crowding)
}

// Single-series magnitude → one sequential hue (brand). No legend (the card
// title names the series); values live in the hover tooltip, in ink tokens.
export function BarChart({ data, unit = "", height = 160, labelEvery = 1 }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={styles.chart}>
      <div className={styles.plot} style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const tip = d.tipLabel ?? d.label;
          return (
            <div
              key={i}
              className={styles.col}
              tabIndex={0}
              aria-label={`${tip}: ${d.value}${unit}`}
            >
              <span className={styles.tip}>{tip}: {d.value}{unit}</span>
              <div
                className={clsx(styles.bar, d.highlight && styles.highlight, d.value === 0 && styles.empty)}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.labels} aria-hidden="true">
        {data.map((d, i) => (
          <span key={i} className={styles.label}>{i % labelEvery === 0 ? d.label : ""}</span>
        ))}
      </div>
    </div>
  );
}
