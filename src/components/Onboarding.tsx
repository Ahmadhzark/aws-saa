import { useState } from "react";
import { AccentPicker } from "./AccentPicker";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { useProgress } from "../store/useProgress";
import { todayISO } from "../lib/time";
import { EXAM } from "../data/curriculum";
import styles from "./Onboarding.module.css";

// First-run welcome. Shown once (gated on settings.onboarded) to collect the
// study profile and let the user pick a theme before diving in.
export function Onboarding() {
  const accent = useProgress((s) => s.settings.accent);
  const setAccent = useProgress((s) => s.setAccent);
  const completeOnboarding = useProgress((s) => s.completeOnboarding);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [examDate, setExamDate] = useState("");

  const finish = () => {
    completeOnboarding({
      name: name.trim(),
      age: age === "" ? null : Number(age),
      examDate: examDate || null,
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <div className={styles.modal}>
        <div className={styles.hero}>
          <div className={styles.mark}><Icon name="labs" size={22} strokeWidth={2.25} /></div>
          <div>
            <h2 id="ob-title" className={styles.title}>Welcome to AWS SAA Tracker</h2>
            <p className={styles.sub}>A couple of quick details to personalise your study space.</p>
          </div>
        </div>

        <div className={styles.body}>
          <label className={styles.field}>
            <span className={styles.label}>What should we call you?</span>
            <input
              className={styles.input}
              type="text"
              value={name}
              placeholder="Your name"
              maxLength={40}
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className={styles.two}>
            <label className={styles.field}>
              <span className={styles.label}>Age</span>
              <input
                className={styles.input}
                type="number"
                min={10}
                max={120}
                value={age}
                placeholder="—"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>When do you plan to take the exam?</span>
              <input
                className={styles.input}
                type="date"
                min={todayISO()}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Pick a theme</span>
            <AccentPicker value={accent} onChange={setAccent} />
          </div>
        </div>

        <div className={styles.foot}>
          <button className={styles.skip} onClick={finish}>Skip for now</button>
          <Button variant="primary" size="lg" onClick={finish}>
            Start studying <Icon name="arrowRight" size={17} />
          </Button>
        </div>
        <p className={styles.note}>Default exam date if left blank: {formatDate(EXAM)}. You can change all of this later in Settings.</p>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
