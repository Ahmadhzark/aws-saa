import clsx from "clsx";
import { Icon } from "./Icon";
import { ACCENTS } from "../theme/accents";
import type { Accent } from "../store/types";
import styles from "./AccentPicker.module.css";

interface AccentPickerProps {
  value: Accent;
  onChange: (accent: Accent) => void;
}

// Row of four brand-hue swatches; the selected one shows a check. Used in both
// Settings and the first-run onboarding flow.
export function AccentPicker({ value, onChange }: AccentPickerProps) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Accent theme">
      {ACCENTS.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={a.label}
            className={clsx(styles.chip, active && styles.active)}
            style={{ "--chip": a.swatch } as React.CSSProperties}
            onClick={() => onChange(a.id)}
          >
            <span className={styles.dot}>{active && <Icon name="check" size={16} strokeWidth={3} />}</span>
            <span className={styles.name}>{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}
