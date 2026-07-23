import { useMemo } from "react";
import { Badge, Card, CardBody, CardHeader, Icon, ProgressRing } from "../components";
import { computeMilestones } from "../lib/milestones";
import type { Milestone } from "../lib/milestones";
import { currentWeek } from "../lib/time";
import { useAnalytics } from "../store/useAnalytics";
import { useProgress } from "../store/useProgress";
import { useStats } from "../store/useStats";
import pageStyles from "./pages.module.css";
import styles from "./Goals.module.css";

export function Goals() {
  const stats = useStats();
  const analytics = useAnalytics();
  const target = useProgress((s) => s.settings.weeklyHoursTarget);
  const setWeeklyTarget = useProgress((s) => s.setWeeklyTarget);

  const cw = currentWeek();
  const hoursThisWeek = analytics.hoursByWeek[cw - 1]?.hours ?? 0;
  const weekPct = Math.min(100, (hoursThisWeek / target) * 100);

  const milestones = useMemo(() => computeMilestones(stats, analytics), [stats, analytics]);
  const unlocked = milestones.filter((m) => m.unlocked).length;

  const groups = useMemo(() => {
    const map = new Map<string, Milestone[]>();
    for (const m of milestones) {
      const list = map.get(m.group) ?? [];
      list.push(m);
      map.set(m.group, list);
    }
    return [...map.entries()];
  }, [milestones]);

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Goals</h1>
        <p>Set your weekly study target and track the milestones you unlock along the way.</p>
      </div>

      <Card>
        <CardHeader title="Weekly goal" action={<span className="eyebrow">week {cw} · {hoursThisWeek}h logged</span>} />
        <div className={styles.goalCard}>
          <ProgressRing value={weekPct} label="of goal" size={128} valueSize={26} />
          <div className={styles.goalMeta}>
            <div className={styles.goalTitle}>{hoursThisWeek}h of {target}h this week</div>
            <div className={styles.goalSub}>
              {hoursThisWeek >= target
                ? "Goal reached — nice work. Keep the momentum."
                : `${Math.round((target - hoursThisWeek) * 10) / 10}h to go to hit your weekly target.`}
            </div>
            <div className={styles.stepper}>
              <button className={styles.stepBtn} aria-label="Lower weekly target" onClick={() => setWeeklyTarget(target - 1)}>
                <Icon name="close" size={14} />
              </button>
              <span className={styles.stepVal}>{target}<small> h/week</small></span>
              <button className={styles.stepBtn} aria-label="Raise weekly target" onClick={() => setWeeklyTarget(target + 1)}>
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Achievements" action={<Badge tone="brand" dot>{unlocked} / {milestones.length} unlocked</Badge>} />
        <CardBody>
          <div className={styles.groups}>
            {groups.map(([group, items]) => (
              <div className={styles.group} key={group}>
                <div className={styles.groupHead}>
                  <span className={styles.groupTitle}>{group}</span>
                </div>
                <div className={styles.grid}>
                  {items.map((m) => {
                    const pct = Math.min(100, (m.current / m.target) * 100);
                    return (
                      <div key={m.id} className={`${styles.badge} ${m.unlocked ? styles.unlocked : styles.locked}`}>
                        <div className={styles.medal}>
                          <Icon name={m.unlocked ? "check" : m.icon} size={18} strokeWidth={m.unlocked ? 3 : 1.75} />
                        </div>
                        <div className={styles.badgeBody}>
                          <div className={styles.badgeLabel}>{m.label}</div>
                          {m.unlocked ? (
                            <div className={styles.badgeMeta}>Unlocked</div>
                          ) : (
                            <>
                              <div className={styles.bar}><div className={styles.barFill} style={{ width: `${pct}%` }} /></div>
                              <div className={styles.badgeMeta}>{Math.round(m.current * 10) / 10} / {m.target}{m.unit}</div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
