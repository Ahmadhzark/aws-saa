import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import clsx from "clsx";
import type { Topic } from "../data/types";
import type { TopicProgress, TopicTag } from "../store/types";
import { Icon } from "./Icon";
import { ConfidenceDots } from "./ConfidenceDots";
import styles from "./TopicCard.module.css";

interface TopicCardProps {
  topic: Topic;
  domainName: string;
  accentIndex: number; // 0..5 → var(--d{n+1})
  progress: TopicProgress | undefined;
  labs: { done: number; total: number };
  onToggle: (id: string) => void;
  onConfidence: (id: string, value: number | null) => void;
  onNotes: (id: string, notes: string) => void;
  onTag: (id: string, tag: TopicTag | null) => void;
  onBookmark: (id: string) => void;
  onRevision: (id: string) => void;
}

export function TopicCard({
  topic, domainName, accentIndex, progress, labs,
  onToggle, onConfidence, onNotes, onTag, onBookmark, onRevision,
}: TopicCardProps) {
  const [open, setOpen] = useState(false);
  const done = !!progress?.done;
  const tag = progress?.tag ?? null;

  // Notes: local draft, debounced to the store so typing isn't a write per key.
  const [draft, setDraft] = useState(progress?.notes ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const editNotes = (val: string) => {
    setDraft(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onNotes(topic.id, val), 600);
  };
  const hasNotes = draft.trim().length > 0;

  // Expand the card and drop the cursor straight into the notes field.
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const wantFocus = useRef(false);
  useEffect(() => {
    if (open && wantFocus.current) {
      notesRef.current?.focus();
      wantFocus.current = false;
    }
  }, [open]);
  const openNotes = () => {
    if (open) notesRef.current?.focus();
    else {
      wantFocus.current = true;
      setOpen(true);
    }
  };

  return (
    <article className={clsx(styles.card, done && styles.done)} style={{ "--accent": `var(--d${accentIndex + 1})` } as CSSProperties}>
      <div className={styles.main}>
        <button
          type="button"
          className={styles.check}
          aria-pressed={done}
          aria-label={`Mark ${topic.id} ${done ? "incomplete" : "complete"}`}
          onClick={() => onToggle(topic.id)}
        >
          <Icon name="check" size={16} strokeWidth={3} />
        </button>

        <div className={styles.body}>
          <div className={styles.top}>
            <span className={styles.id}>{topic.id}</span>
            <span className={styles.name}>{topic.name}</span>
          </div>
          <div className={styles.meta}>
            <span>W{topic.week}</span>
            <span className={styles.metaDot} />
            <span>{topic.hours}h</span>
            <span className={styles.metaDot} />
            <span>{domainName}</span>
            {labs.total > 0 && (
              <>
                <span className={styles.metaDot} />
                <span>{labs.done}/{labs.total} labs</span>
              </>
            )}
          </div>
          <div className={styles.conf}>
            <ConfidenceDots id={topic.id} value={progress?.confidence} onChange={(v) => onConfidence(topic.id, v)} />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={clsx(styles.iconBtn, hasNotes && styles.hasNotes)}
            aria-label={`${hasNotes ? "Edit notes" : "Add notes"} for ${topic.id}`}
            title={hasNotes ? "Edit notes" : "Add notes"}
            onClick={openNotes}
          >
            <Icon name="note" size={16} />
            {hasNotes && <span className={styles.noteDot} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className={clsx(styles.iconBtn, progress?.bookmarked && styles.marked)}
            aria-pressed={!!progress?.bookmarked}
            aria-label={`${progress?.bookmarked ? "Remove bookmark" : "Bookmark"} ${topic.id}`}
            onClick={() => onBookmark(topic.id)}
          >
            <Icon name="bookmark" size={17} />
          </button>
          <button
            type="button"
            className={clsx(styles.iconBtn, open && styles.expanded)}
            aria-expanded={open}
            aria-label={`${open ? "Hide" : "Show"} details for ${topic.id}`}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name="chevronDown" size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.more}>
          <p className={styles.blurb}>
            <b>exam angle</b>
            {topic.blurb}
          </p>
          <textarea
            ref={notesRef}
            className={styles.notes}
            placeholder={`Your notes on ${topic.id}…`}
            value={draft}
            onChange={(e) => editNotes(e.target.value)}
          />
          <div className={styles.footer}>
            <div className={styles.tags}>
              <button
                type="button"
                className={clsx(styles.tag, styles.tagWeak, tag === "weak" && styles.tagOn)}
                aria-pressed={tag === "weak"}
                onClick={() => onTag(topic.id, tag === "weak" ? null : "weak")}
              >
                weak
              </button>
              <button
                type="button"
                className={clsx(styles.tag, styles.tagStrong, tag === "strong" && styles.tagOn)}
                aria-pressed={tag === "strong"}
                onClick={() => onTag(topic.id, tag === "strong" ? null : "strong")}
              >
                strong
              </button>
            </div>
            <span className={styles.rev}>
              <button type="button" className={styles.revBtn} aria-label={`Log a revision of ${topic.id}`} onClick={() => onRevision(topic.id)}>
                <Icon name="plus" size={14} />
              </button>
              {progress?.revisions ?? 0} revisions
            </span>
            <span className={styles.subMeta}>
              {progress?.lastStudied ? `studied ${progress.lastStudied}` : "not started"}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
