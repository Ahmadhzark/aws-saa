import { Badge, Card, CardBody, CardHeader, ProgressRing, Skeleton } from "../components";
import { EXAM, TOTAL_HOURS, TOTAL_LABS, TOTAL_TOPICS, TOTAL_WEEKS, WEEKS } from "../data/curriculum";
import { useStats } from "../store/useStats";
import { useHydrated } from "../store/useProgress";
import styles from "./pages.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function Dashboard() {
  const hydrated = useHydrated();
  const stats = useStats();
  const week = WEEKS[stats.week - 1];

  const tiles = [
    { k: "Days to exam", v: <>{stats.daysLeft}</> },
    { k: "Streak", v: <>{stats.streak.current}<small> / {stats.streak.best} best</small></> },
    { k: "Topics", v: <>{stats.topicsDone}<small> / {TOTAL_TOPICS}</small></> },
    { k: "Labs", v: <>{stats.labsDone}<small> / {TOTAL_LABS}</small></> },
    { k: "Study hours", v: <>{stats.hoursDone}<small> / {TOTAL_HOURS}</small></> },
    { k: "Today", v: <>{stats.hoursToday}<small>h</small></> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1>Dashboard</h1>
        <p>Your AWS SAA-C03 command centre — a {TOTAL_WEEKS}-week program tracked end to end.</p>
      </div>

      <Card>
        <div className={styles.hero}>
          {hydrated ? (
            <ProgressRing value={stats.overall} label="weighted" size={148} />
          ) : (
            <Skeleton width={148} height={148} radius="50%" />
          )}
          <div className={styles.heroMeta}>
            <div className={styles.heroTitle}>Week {stats.week} · {week.focus}</div>
            <div className={styles.heroSub}>{week.label} · exam target {shortDate(EXAM)}</div>
            <div className={styles.heroTags}>
              <Badge tone={stats.schedule.level === "ok" ? "ok" : stats.schedule.level === "warn" ? "warn" : "bad"} dot>
                {stats.schedule.label}
              </Badge>
              <Badge tone="neutral">{stats.topicsDone}/{TOTAL_TOPICS} topics</Badge>
              <Badge tone="neutral">{stats.labsDone}/{TOTAL_LABS} labs</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className={styles.statGrid}>
        {tiles.map((t) => (
          <Card key={t.k} className={styles.stat}>
            <div className={styles.statK}>{t.k}</div>
            <div className={styles.statV}>{hydrated ? t.v : <Skeleton width={64} height={22} />}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Pace & projection"
          action={<span className="eyebrow">to exam</span>}
        />
        <CardBody>
          {hydrated ? (
            <p className={styles.paceMsg}>
              {stats.pace.hoursLeft === 0 ? (
                <>All {TOTAL_HOURS}h logged — the program is complete. 🎉</>
              ) : stats.pace.perWeekActual === 0 ? (
                <>No hours logged yet. You'll need about <b>{stats.pace.perWeekNeeded}h/week</b> to reach {TOTAL_HOURS}h by exam day.</>
              ) : stats.pace.level === "ok" ? (
                <>At <b>{stats.pace.perWeekActual}h/week</b> you'll finish around <b>{shortDate(stats.pace.projectedFinish)}</b> — on track. Hold the line.</>
              ) : (
                <>At <b>{stats.pace.perWeekActual}h/week</b> you'd finish {shortDate(stats.pace.projectedFinish)} — lift to <b>{stats.pace.perWeekNeeded}h/week</b> to land on time.</>
              )}
            </p>
          ) : (
            <Skeleton width="80%" height={18} />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Blueprint domains" action={<span className="eyebrow">completion</span>} />
        <CardBody>
          <div className={styles.domRow}>
            {stats.domains.map((d, i) => (
              <div className={styles.dom} key={d.id}>
                <div className={styles.domTop}>
                  <span className={styles.domName}>
                    <span className={styles.swatch} style={{ background: `var(--d${i + 1})` }} />
                    <b className="mono">{d.id}</b> {d.name}
                  </span>
                  <span className={styles.domMeta}>{d.done}/{d.total} · {d.percent}% · {d.weight}% exam</span>
                </div>
                <div className={styles.bar}>
                  <div className={styles.barFill} style={{ width: `${d.percent}%`, background: `var(--d${i + 1})` }} />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
