import { useMemo, useState } from "react";
import { Icon, SegmentedControl } from "../components";
import { LabCard } from "../components/LabCard";
import { LABS, TOTAL_LABS } from "../data/curriculum";
import { useProgress } from "../store/useProgress";
import pageStyles from "./pages.module.css";
import styles from "./Topics.module.css";

type Diff = "all" | "E" | "M" | "H";
type Status = "all" | "todo" | "doing" | "done";

export function Labs() {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<Diff>("all");
  const [status, setStatus] = useState<Status>("all");

  const labs = useProgress((s) => s.labs);
  const setLabStatus = useProgress((s) => s.setLabStatus);
  const updateLab = useProgress((s) => s.updateLab);
  const addLabAttachment = useProgress((s) => s.addLabAttachment);
  const removeLabAttachment = useProgress((s) => s.removeLabAttachment);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LABS.filter((l) => {
      if (diff !== "all" && l.difficulty !== diff) return false;
      const st = labs[l.id]?.status ?? "todo";
      if (status !== "all" && st !== status) return false;
      if (needle && !`${l.id} ${l.name} ${l.tech}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [q, diff, status, labs]);

  const doneCount = LABS.filter((l) => labs[l.id]?.status === "done").length;

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Labs</h1>
        <p>
          {LABS.length} of {TOTAL_LABS} labs detailed so far — {doneCount} done. Track status, log time, capture
          reflections and attach screenshots or config files.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <Icon name="search" size={18} />
          <input
            className={styles.search}
            type="search"
            placeholder="Search labs, technologies…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search labs"
          />
        </div>
        <div className={styles.filters}>
          <SegmentedControl<Diff>
            ariaLabel="Filter by difficulty"
            value={diff}
            onChange={setDiff}
            options={[
              { value: "all", label: "All" },
              { value: "E", label: "Easy" },
              { value: "M", label: "Med" },
              { value: "H", label: "Hard" },
            ]}
          />
          <SegmentedControl<Status>
            ariaLabel="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "todo", label: "To do" },
              { value: "doing", label: "Doing" },
              { value: "done", label: "Done" },
            ]}
          />
          <span className={styles.spacer} />
          <span className={styles.count}>{visible.length} shown</span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className={styles.noResults}>No labs match those filters.</div>
      ) : (
        <div className={styles.list}>
          {visible.map((l) => (
            <LabCard
              key={l.id}
              lab={l}
              progress={labs[l.id]}
              onStatus={setLabStatus}
              onUpdate={updateLab}
              onAddAttachment={addLabAttachment}
              onRemoveAttachment={removeLabAttachment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
