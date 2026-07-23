import { Badge, Card, CardBody, CardHeader, EmptyState } from "../components";
import { BarChart } from "../components/BarChart";
import type { BarDatum } from "../components/BarChart";
import { TOTAL_HOURS } from "../data/curriculum";
import { currentWeek } from "../lib/time";
import { useAnalytics } from "../store/useAnalytics";
import { useStats } from "../store/useStats";
import pageStyles from "./pages.module.css";
import styles from "./Analytics.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function Analytics() {
  const a = useAnalytics();
  const stats = useStats();
  const cw = currentWeek();

  const kpis = [
    { k: "Total hours", v: <>{a.totalHours}<small> / {TOTAL_HOURS}</small></> },
    { k: "Active days", v: <>{a.activeDays}</> },
    { k: "Avg session", v: <>{a.avgSession}<small>h</small></> },
    { k: "Avg confidence", v: stats.avgConfidence == null ? <>—</> : <>{stats.avgConfidence}<small> / 5</small></> },
    { k: "Best streak", v: <>{stats.streak.best}<small>d</small></> },
    { k: "Projected finish", v: <>{shortDate(stats.pace.projectedFinish)}</> },
  ];

  const weekBars: BarDatum[] = a.hoursByWeek.map((w) => ({
    label: `${w.week}`,
    tipLabel: `W${w.week} · ${w.focus}`,
    value: w.hours,
    highlight: w.week === cw,
  }));
  const monthBars: BarDatum[] = a.hoursByMonth.map((m) => ({ label: m.label, value: m.hours }));
  const confMax = Math.max(1, ...a.confidenceDist.map((d) => d.count));

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Analytics</h1>
        <p>How your study time and confidence are trending across the program.</p>
      </div>

      <div className={pageStyles.statGrid}>
        {kpis.map((t) => (
          <Card key={t.k} className={pageStyles.stat}>
            <div className={pageStyles.statK}>{t.k}</div>
            <div className={pageStyles.statV}>{t.v}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Study hours by week"
          action={<span className="eyebrow">{a.mostActiveWeek ? `peak W${a.mostActiveWeek.week} · ${a.mostActiveWeek.hours}h` : "no sessions yet"}</span>}
        />
        <CardBody>
          <BarChart data={weekBars} unit="h" height={180} labelEvery={2} />
          {a.activeDays === 0 && <div className={styles.chartNote}>Log sessions to populate these charts.</div>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Study hours by month" action={<span className="eyebrow">{a.totalHours}h total</span>} />
        <CardBody>
          <BarChart data={monthBars} unit="h" height={150} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Confidence distribution"
          action={<span className="eyebrow">{a.rated} rated · avg {stats.avgConfidence ?? "—"}</span>}
        />
        <CardBody>
          <BarChart
            data={a.confidenceDist.map((d) => ({ label: `${d.score}`, tipLabel: `Confidence ${d.score}`, value: d.count }))}
            height={130}
          />
          <div className={styles.chartNote}>Bars show how many topics sit at each 1–5 confidence level.{confMax === 1 && a.rated === 0 ? " Rate topics to fill this in." : ""}</div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Weak areas to revisit" action={<span className="eyebrow">confidence ≤ 3 or tagged weak</span>} />
        <CardBody>
          {a.hardest.length === 0 ? (
            <EmptyState
              icon="target"
              title="No weak areas flagged"
              description="Rate topics 1–3, or tag them ‘weak’ on the Topics page, and the ones needing another pass will surface here."
            />
          ) : (
            <div className={styles.hardList}>
              {a.hardest.map((t) => (
                <div key={t.id} className={styles.hardItem}>
                  <span className={styles.hardId}>{t.id}</span>
                  <span className={styles.hardName}>{t.name}</span>
                  <span className={styles.hardMeta}>
                    {t.tag === "weak" && <Badge tone="warn">weak</Badge>}
                    <span className={styles.confPips} aria-label={t.confidence ? `confidence ${t.confidence} of 5` : "unrated"}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`${styles.pip} ${t.confidence && t.confidence >= n ? styles.pipOn : ""}`} />
                      ))}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Pace & projection" action={<span className="eyebrow">to exam</span>} />
        <CardBody>
          <p className={styles.paceMsg}>
            {stats.pace.hoursLeft === 0 ? (
              <>All {TOTAL_HOURS}h logged — the program is complete. 🎉</>
            ) : stats.pace.perWeekActual === 0 ? (
              <>No hours logged yet. You'll need about <b>{stats.pace.perWeekNeeded}h/week</b> to reach {TOTAL_HOURS}h by exam day.</>
            ) : stats.pace.level === "ok" ? (
              <>At <b>{stats.pace.perWeekActual}h/week</b> you'll finish around <b>{shortDate(stats.pace.projectedFinish)}</b> — on track. {stats.pace.hoursLeft}h to go.</>
            ) : (
              <>At <b>{stats.pace.perWeekActual}h/week</b> you'd finish {shortDate(stats.pace.projectedFinish)} — lift to <b>{stats.pace.perWeekNeeded}h/week</b> to land on time.</>
            )}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
