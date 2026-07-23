import { useState } from "react";
import { AccentPicker, Badge, Button, Card, CardBody, CardHeader, Icon, ThemeToggle } from "../components";
import { toast } from "../store/useToast";
import { useProgress } from "../store/useProgress";
import { daysLeft } from "../lib/time";
import { EXAM } from "../data/curriculum";
import pageStyles from "./pages.module.css";
import styles from "./Settings.module.css";

export function Settings() {
  const profile = useProgress((s) => s.settings.profile);
  const accent = useProgress((s) => s.settings.accent);
  const setAccent = useProgress((s) => s.setAccent);
  const setProfile = useProgress((s) => s.setProfile);
  const resetAll = useProgress((s) => s.resetAll);

  const [confirming, setConfirming] = useState(false);

  const exam = profile.examDate ?? EXAM;
  const left = daysLeft(undefined, exam);

  const doReset = () => {
    resetAll();
    setConfirming(false);
    toast("Progress reset — topics, labs and sessions cleared.");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Settings</h1>
        <p>Your profile, appearance, and study data — all stored locally on this device.</p>
      </div>

      {/* ---- Profile ---- */}
      <Card>
        <CardHeader title="Profile" action={<Icon name="user" size={18} />} />
        <CardBody>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                type="text"
                value={profile.name}
                placeholder="Your name"
                maxLength={40}
                onChange={(e) => setProfile({ name: e.target.value })}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Age</span>
              <input
                className={styles.input}
                type="number"
                min={10}
                max={120}
                value={profile.age ?? ""}
                placeholder="—"
                onChange={(e) => setProfile({ age: e.target.value === "" ? null : Number(e.target.value) })}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Planned exam date</span>
              <input
                className={styles.input}
                type="date"
                value={profile.examDate ?? ""}
                onChange={(e) => setProfile({ examDate: e.target.value || null })}
              />
            </label>
          </div>
          <div className={styles.countdownNote}>
            <Icon name="calendar" size={15} />
            {profile.examDate
              ? <span><b>{left}</b> days until your exam on {formatDate(exam)}.</span>
              : <span>No exam date set — the countdown uses the default schedule ({formatDate(EXAM)}).</span>}
          </div>
        </CardBody>
      </Card>

      {/* ---- Appearance ---- */}
      <Card>
        <CardHeader title="Appearance" action={<Icon name="palette" size={18} />} />
        <CardBody>
          <div className={styles.stack}>
            <div className={styles.optRow}>
              <div className={styles.optText}>
                <div className={styles.optTitle}>Mode</div>
                <div className={styles.optSub}>Follow the system, or lock to light or dark.</div>
              </div>
              <ThemeToggle />
            </div>
            <div className={styles.divider} />
            <div className={styles.optCol}>
              <div className={styles.optText}>
                <div className={styles.optTitle}>Accent theme</div>
                <div className={styles.optSub}>Pick a brand colour — it adapts to both light and dark.</div>
              </div>
              <AccentPicker value={accent} onChange={setAccent} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ---- Data ---- */}
      <Card>
        <CardHeader title="Data" action={<Badge tone="bad" dot>local only</Badge>} />
        <CardBody>
          <div className={styles.optRow}>
            <div className={styles.optText}>
              <div className={styles.optTitle}>Reset progress</div>
              <div className={styles.optSub}>Clears every topic, lab and logged session. Your profile and theme are kept. This can't be undone.</div>
            </div>
            {confirming ? (
              <div className={styles.confirm}>
                <Button variant="danger" size="sm" onClick={doReset}>
                  <Icon name="trash" size={15} /> Confirm reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                <Icon name="trash" size={15} /> Reset progress
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
