import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Icon } from "../components";
import { Heatmap } from "../components/Heatmap";
import { useProgress } from "../store/useProgress";
import { useStats } from "../store/useStats";
import { toast } from "../store/useToast";
import { todayISO } from "../lib/time";
import type { Session } from "../store/types";
import pageStyles from "./pages.module.css";
import styles from "./Log.module.css";

const QUICK = [
  { label: "+30m", hours: 0.5 },
  { label: "+1h", hours: 1 },
  { label: "+2h", hours: 2 },
  { label: "+3h", hours: 3 },
];

export function Log() {
  const sessions = useProgress((s) => s.sessions);
  const logSession = useProgress((s) => s.logSession);
  const removeSession = useProgress((s) => s.removeSession);
  const stats = useStats();

  const [hours, setHours] = useState("1");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(todayISO());

  const activeDays = Object.values(sessions).filter((s) => s.hours > 0).length;
  const ordered = Object.values(sessions).sort((a, b) => b.date.localeCompare(a.date));

  function log(h: number) {
    if (!(h > 0)) return toast("Enter hours greater than zero", { tone: "error" });
    logSession(h, note.trim() || undefined);
    const total = Math.round(((sessions[todayISO()]?.hours ?? 0) + h) * 10) / 10;
    setNote("");
    toast(`Logged ${h}h — ${total}h today`);
  }

  function remove(s: Session) {
    removeSession(s.date);
    toast(`Removed ${s.date}`, {
      action: { label: "Undo", onClick: () => logSession(s.hours, s.note, s.date) },
    });
  }

  const selectedSession = selected ? sessions[selected] : undefined;

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Log</h1>
        <p>Track study sessions to keep your streak alive and drive the pace forecast.</p>
      </div>

      <Card>
        <CardHeader
          title="Log a session"
          action={<span className="eyebrow">{stats.hoursToday}h today · {stats.streak.current} day streak</span>}
        />
        <CardBody>
          <div className={styles.quick}>
            {QUICK.map((q) => (
              <button key={q.label} type="button" className={styles.quickBtn} onClick={() => log(q.hours)}>
                {q.label}
              </button>
            ))}
          </div>
          <div className={styles.entry}>
            <input
              className={`${styles.hours} ${styles.input}`}
              type="number"
              min={0.25}
              max={24}
              step={0.25}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              aria-label="Hours studied"
            />
            <input
              className={`${styles.note} ${styles.input}`}
              type="text"
              placeholder="What did you work on?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Session note"
            />
            <Button variant="primary" size="lg" onClick={() => log(parseFloat(hours))}>Log</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Study activity" action={<span className="eyebrow">{activeDays} active days</span>} />
        <CardBody>
          <Heatmap sessions={sessions} today={todayISO()} selected={selected} onSelect={setSelected} />
          <div className={styles.hmFoot}>
            <span className={styles.detail}>
              {selected
                ? selectedSession
                  ? `${selected} — ${selectedSession.hours}h${selectedSession.note ? ` · ${selectedSession.note}` : ""}`
                  : `${selected} — no study logged`
                : "Tap a square for detail"}
            </span>
            <span className={styles.legend}>
              Less
              <i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" />
              More
            </span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Sessions" action={<span className="eyebrow">{stats.hoursDone}h total</span>} />
        <CardBody>
          {ordered.length === 0 ? (
            <div className={styles.emptySessions}>No sessions yet. Log your first one above.</div>
          ) : (
            <div className={styles.sessions}>
              {ordered.map((s) => (
                <div key={s.date} className={styles.session}>
                  <span className={styles.sHours}>{s.hours}h</span>
                  <span className={styles.sDate}>{s.date}</span>
                  <span className={styles.sNote}>{s.note ?? ""}</span>
                  <button type="button" className={styles.sDel} aria-label={`Delete session on ${s.date}`} onClick={() => remove(s)}>
                    <Icon name="close" size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
