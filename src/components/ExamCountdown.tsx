import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { useProgress } from "../store/useProgress";
import styles from "./ExamCountdown.module.css";

// Live, ticking countdown to the user's planned exam date. Counts down to local
// midnight of the exam day. Renders a prompt to set a date if none is entered.
export function ExamCountdown() {
  const examDate = useProgress((s) => s.settings.profile.examDate);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!examDate) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [examDate]);

  if (!examDate) {
    return (
      <Card className={styles.empty}>
        <Icon name="calendar" size={18} />
        <span>
          Set your exam date in <Link to="/settings" className={styles.link}>Settings</Link> to start the countdown.
        </span>
      </Card>
    );
  }

  const diff = new Date(examDate + "T00:00:00").getTime() - now;

  if (diff <= 0) {
    return (
      <Card className={styles.done}>
        <Icon name="target" size={22} />
        <span>Exam day is here — you've got this. Good luck! 🎉</span>
      </Card>
    );
  }

  const s = Math.floor(diff / 1000);
  const segs = [
    { v: Math.floor(s / 86400), label: "days" },
    { v: Math.floor((s % 86400) / 3600), label: "hours" },
    { v: Math.floor((s % 3600) / 60), label: "mins" },
    { v: s % 60, label: "secs" },
  ];

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <Icon name="clock" size={15} />
        <span className="eyebrow">Countdown to exam</span>
        <span className={styles.date}>{formatDate(examDate)}</span>
      </div>
      <div className={styles.segs}>
        {segs.map((seg, i) => {
          const text = i === 0 ? String(seg.v) : pad(seg.v);
          return (
            <div className={styles.seg} key={seg.label}>
              {/* key on value → the digit remounts and replays the flip on each change */}
              <span className={styles.num} key={text}>{text}</span>
              <span className={styles.lab}>{seg.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
