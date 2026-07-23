import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";
import { useProgress } from "../store/useProgress";
import { toast } from "../store/useToast";
import { todayISO } from "../lib/time";
import styles from "./StudyTimer.module.css";

// Live focus stopwatch. The display is today's total focus time = hours already
// logged today + the current running run. "Stop" commits the running run to the
// session store (so streaks/hours/analytics all pick it up); "reset" discards it.
export function StudyTimer() {
  const todayHours = useProgress((s) => s.sessions[todayISO()]?.hours ?? 0);
  const logSession = useProgress((s) => s.logSession);

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds in the current, unsaved run
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const total = Math.round(todayHours * 3600) + elapsed;

  const stop = () => {
    setRunning(false);
    if (elapsed > 0) {
      const hours = Math.round((elapsed / 3600) * 100) / 100;
      logSession(hours);
      toast(`Logged ${hours}h of focus time to today.`);
    }
    setElapsed(0);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <Icon name="clock" size={16} />
        <span>Study Timer</span>
      </div>

      <div className={styles.clock}>
        <div className={clsx(styles.time, running && styles.live)}>{fmt(total)}</div>
        <div className={styles.caption}>Today's focus time</div>
      </div>

      <div className={styles.controls}>
        <button className={styles.ctrl} onClick={stop} disabled={elapsed === 0} aria-label="Stop and log session" title="Stop & log">
          <Icon name="stop" size={18} />
        </button>
        <button
          className={clsx(styles.play, running && styles.pausing)}
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pause timer" : "Start timer"}
          title={running ? "Pause" : "Start"}
        >
          <Icon name={running ? "pause" : "play"} size={22} />
        </button>
        <button className={styles.ctrl} onClick={reset} disabled={elapsed === 0 && !running} aria-label="Reset timer" title="Reset (discard)">
          <Icon name="refresh" size={18} />
        </button>
      </div>
    </div>
  );
}

function fmt(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const p = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${p(h)}:${p(m)}:${p(s)}`;
}
