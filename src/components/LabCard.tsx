import { useEffect, useRef, useState } from "react";
import type { Lab } from "../data/types";
import type { FileRef, LabProgress, LabStatus } from "../store/types";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { SegmentedControl } from "./SegmentedControl";
import { Attachments } from "./Attachments";
import styles from "./LabCard.module.css";

const DIFF = { E: { label: "Easy", tone: "ok" }, M: { label: "Medium", tone: "warn" }, H: { label: "Hard", tone: "bad" } } as const;

interface LabCardProps {
  lab: Lab;
  progress: LabProgress | undefined;
  onStatus: (id: string, status: LabStatus) => void;
  onUpdate: (id: string, patch: Partial<LabProgress>) => void;
  onAddAttachment: (id: string, ref: FileRef) => void;
  onRemoveAttachment: (id: string, refId: string) => void;
}

export function LabCard({ lab, progress, onStatus, onUpdate, onAddAttachment, onRemoveAttachment }: LabCardProps) {
  const [open, setOpen] = useState(false);
  const status: LabStatus = progress?.status ?? "todo";
  const diff = DIFF[lab.difficulty];

  const [draft, setDraft] = useState({
    minutesTaken: progress?.minutesTaken != null ? String(progress.minutesTaken) : "",
    skills: progress?.skills ?? "",
    mistakes: progress?.mistakes ?? "",
    reflection: progress?.reflection ?? "",
    notes: progress?.notes ?? "",
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const edit = (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onUpdate(lab.id, {
        minutesTaken: next.minutesTaken === "" ? null : Number(next.minutesTaken),
        skills: next.skills,
        mistakes: next.mistakes,
        reflection: next.reflection,
        notes: next.notes,
      });
    }, 600);
  };

  return (
    <article className={`${styles.card} ${styles[status]}`}>
      <div className={styles.main}>
        <div className={styles.body}>
          <div className={styles.top}>
            <span className={styles.id}>{lab.id}</span>
            <span className={styles.name}>{lab.name}</span>
          </div>
          <div className={styles.meta}>
            <Badge tone={diff.tone}>{diff.label}</Badge>
            <span>{lab.minutes}m est</span>
            <span className={styles.metaDot} />
            <span>W{lab.week}</span>
            <span className={styles.metaDot} />
            <span>{lab.tech}</span>
          </div>
          <div className={styles.controls}>
            <SegmentedControl<LabStatus>
              ariaLabel={`Status for ${lab.id}`}
              value={status}
              onChange={(s) => onStatus(lab.id, s)}
              options={[
                { value: "todo", label: "To do" },
                { value: "doing", label: "In progress" },
                { value: "done", label: "Done" },
              ]}
            />
          </div>
        </div>
        <button
          type="button"
          className={`${styles.expand} ${open ? styles.expanded : ""}`}
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} details for ${lab.id}`}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="chevronDown" size={18} />
        </button>
      </div>

      {open && (
        <div className={styles.more}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Time taken</span>
            <div className={styles.timeRow}>
              <input
                className={styles.timeInput}
                type="number"
                min={0}
                step={5}
                placeholder={String(lab.minutes)}
                value={draft.minutesTaken}
                onChange={(e) => edit({ minutesTaken: e.target.value })}
                aria-label={`Minutes taken for ${lab.id}`}
              />
              <span className={styles.timeUnit}>minutes</span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Skills learned</span>
            <textarea className={styles.area} value={draft.skills} onChange={(e) => edit({ skills: e.target.value })} placeholder="What did this lab teach you?" />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Mistakes made</span>
            <textarea className={styles.area} value={draft.mistakes} onChange={(e) => edit({ mistakes: e.target.value })} placeholder="What tripped you up?" />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Reflection</span>
            <textarea className={styles.area} value={draft.reflection} onChange={(e) => edit({ reflection: e.target.value })} placeholder="Would you redo it? What next?" />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Notes &amp; config</span>
            <textarea className={styles.area} value={draft.notes} onChange={(e) => edit({ notes: e.target.value })} placeholder="Commands, key config, gotchas…" />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Attachments</span>
            <Attachments
              attachments={progress?.attachments ?? []}
              onAdd={(ref) => onAddAttachment(lab.id, ref)}
              onRemove={(refId) => onRemoveAttachment(lab.id, refId)}
            />
          </div>
        </div>
      )}
    </article>
  );
}
