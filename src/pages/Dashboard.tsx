import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heatmap, Icon, ProgressRing, Skeleton, Sparkline, StudyTimer } from "../components";
import {
  EXAM, LABS, TOPICS, TOTAL_LABS, TOTAL_TOPICS, WEEKS, shiftDate,
} from "../data/curriculum";
import { useStats } from "../store/useStats";
import { useAnalytics } from "../store/useAnalytics";
import { useHydrated, useProgress } from "../store/useProgress";
import { todayISO } from "../lib/time";
import styles from "./Dashboard.module.css";

const QUOTES: { text: string; by: string }[] = [
  { text: "Discipline today, success tomorrow.", by: "Unknown" },
  { text: "Small steps every day add up to big results.", by: "Unknown" },
  { text: "The expert in anything was once a beginner.", by: "Helen Hayes" },
  { text: "Consistency is what transforms average into excellence.", by: "Unknown" },
  { text: "Don't watch the clock; do what it does — keep going.", by: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated daily.", by: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", by: "Zig Ziglar" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function greetPart(): string {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
}

export function Dashboard() {
  const hydrated = useHydrated();
  const stats = useStats();
  const analytics = useAnalytics();
  const topics = useProgress((s) => s.topics);
  const labs = useProgress((s) => s.labs);
  const sessions = useProgress((s) => s.sessions);
  const name = useProgress((s) => s.settings.profile.name);
  const examDate = useProgress((s) => s.settings.profile.examDate) ?? EXAM;

  const today = todayISO();
  const week = WEEKS[stats.week - 1];
  const weekTopics = useMemo(() => TOPICS.filter((t) => t.week === stats.week), [stats.week]);
  const weekDone = weekTopics.filter((t) => topics[t.id]?.done).length;
  const weekPct = weekTopics.length ? Math.round((weekDone / weekTopics.length) * 100) : 0;

  // Small real series for the stat-card sparklines.
  const series = useMemo(() => {
    const daily: number[] = [];
    for (let i = 13; i >= 0; i--) daily.push(sessions[shiftDate(today, -i)]?.hours ?? 0);
    const labsCum = WEEKS.map((w) =>
      LABS.filter((l) => labs[l.id]?.status === "done" && (labs[l.id]?.doneAt ?? "") <= w.ends).length,
    );
    const conf = analytics.confidenceDist.map((d) => d.count);
    return { daily, hoursByWeek: analytics.hoursByWeek.map((w) => w.hours), labsCum, conf };
  }, [sessions, labs, analytics, today]);

  const upcomingLabs = useMemo(
    () => LABS.filter((l) => labs[l.id]?.status !== "done").sort((a, b) => a.week - b.week).slice(0, 3),
    [labs],
  );

  const plan = weekTopics.slice(0, 5);

  const quote = QUOTES[new Date(today).getDate() % QUOTES.length];
  const daysLeft = stats.daysLeft;

  const statCards = [
    { icon: "flame" as const, label: "Study Streak", value: stats.streak.current, unit: "Days", sub: `Best: ${stats.streak.best} Days`, data: series.daily, color: "var(--ok)" },
    { icon: "clock" as const, label: "Total Study Time", value: analytics.totalHours, unit: "hrs", sub: "All time", data: series.hoursByWeek, color: "var(--d3)" },
    { icon: "labs" as const, label: "Labs Completed", value: stats.labsDone, unit: "", sub: `Out of ${TOTAL_LABS}`, data: series.labsCum, color: "var(--warn)" },
    { icon: "target" as const, label: "Avg Confidence", value: stats.avgConfidence ?? "—", unit: stats.avgConfidence ? "/ 5" : "", sub: `${analytics.rated} topics rated`, data: series.conf, color: "var(--info)" },
    { icon: "calendar" as const, label: "Exam Countdown", value: daysLeft, unit: "Days", sub: shortDate(examDate), data: null, color: "var(--brand)" },
  ];

  return (
    <div className={styles.page}>
      {/* ---- greeting header ---- */}
      <header className={styles.head}>
        <div>
          <h1 className={styles.greeting}>Good {greetPart()}, {name?.trim() || "there"} <span className={styles.wave}>👋</span></h1>
          <p className={styles.sub}>Stay consistent today. Your future self is watching.</p>
        </div>
        <div className={styles.datePill}>
          <Icon name="calendar" size={15} />
          {new Date(today).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
        </div>
      </header>

      {/* ---- hero row ---- */}
      <div className={styles.heroGrid}>
        {/* Overall progress */}
        <section className={styles.card}>
          <div className={styles.cardHead}><Icon name="dashboard" size={16} /> Overall Progress</div>
          <div className={styles.progressBody}>
            {hydrated ? <ProgressRing value={stats.overall} label="Completed" size={132} /> : <Skeleton width={132} height={132} radius="50%" />}
            <div className={styles.progressMeta}>
              <div className={styles.journey}>Your AWS SAA-C03 journey</div>
              <div className={styles.miniBar}><div className={styles.miniFill} style={{ width: `${(stats.topicsDone / TOTAL_TOPICS) * 100}%` }} /></div>
              <div className={styles.miniLabel}>{stats.topicsDone} / {TOTAL_TOPICS} Topics</div>
              <Link to="/analytics" className={styles.linkBtn}>View Progress <Icon name="arrowRight" size={15} /></Link>
            </div>
          </div>
        </section>

        {/* Study timer */}
        <StudyTimer />

        {/* Current focus */}
        <section className={styles.card}>
          <div className={styles.cardHead}><Icon name="book" size={16} /> Current Focus</div>
          <div className={styles.focusBody}>
            <div className={styles.focusEyebrow}>Week {stats.week} of {WEEKS.length}</div>
            <div className={styles.focusTitle}>{week.focus}</div>
            <div className={styles.miniLabel}>{weekDone} / {weekTopics.length} Topics Completed</div>
            <div className={styles.miniBar}><div className={styles.miniFill} style={{ width: `${weekPct}%` }} /></div>
            <Link to="/topics" className={styles.linkBtn}>Continue Learning <Icon name="arrowRight" size={15} /></Link>
          </div>
        </section>
      </div>

      {/* ---- stat row ---- */}
      <div className={styles.statGrid}>
        {statCards.map((c) => (
          <section className={styles.stat} key={c.label}>
            <div className={styles.statHead}><Icon name={c.icon} size={15} /> {c.label}</div>
            <div className={styles.statMain}>
              <div className={styles.statValue}>
                {hydrated ? c.value : "—"}{c.unit && <small> {c.unit}</small>}
              </div>
              {c.data && hydrated && <Sparkline data={c.data} color={c.color} />}
            </div>
            <div className={styles.statSub} style={c.icon === "calendar" ? { color: "var(--brand)" } : undefined}>{c.sub}</div>
          </section>
        ))}
      </div>

      {/* ---- panels row ---- */}
      <div className={styles.panelGrid}>
        {/* Weekly activity */}
        <section className={styles.card}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Weekly Activity</span>
            <Link to="/log" className={styles.viewAll}>View All</Link>
          </div>
          <div className={styles.panelBody}>
            <Heatmap sessions={sessions} today={today} selected={null} onSelect={() => {}} />
            <div className={styles.hmLegend}>
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((l) => <i key={l} className={styles.legendCell} data-level={l} />)}
              <span>More</span>
            </div>
          </div>
        </section>

        {/* This week's plan */}
        <section className={styles.card}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>This Week's Plan</span>
            <Link to="/topics" className={styles.viewAll}>View All</Link>
          </div>
          <ul className={styles.planList}>
            {plan.length === 0 && <li className={styles.emptyRow}>No topics scheduled this week.</li>}
            {plan.map((t) => {
              const done = !!topics[t.id]?.done;
              return (
                <li key={t.id}>
                  <Link to="/topics" className={styles.planRow}>
                    <Icon name={done ? "check" : "clock"} size={16} className={done ? styles.rowDone : styles.rowTodo} />
                    <span className={done ? styles.planNameDone : styles.planName}>{t.name}</span>
                    <span className={styles.rowTag}>Topic</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Upcoming labs */}
        <section className={styles.card}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Upcoming Labs</span>
            <Link to="/labs" className={styles.viewAll}>View All</Link>
          </div>
          <ul className={styles.planList}>
            {upcomingLabs.length === 0 && <li className={styles.emptyRow}>All labs complete — nicely done.</li>}
            {upcomingLabs.map((l) => (
              <li key={l.id}>
                <Link to="/labs" className={styles.labRow}>
                  <span className={styles.labIcon}><Icon name="labs" size={16} /></span>
                  <span className={styles.planName}>{l.name}</span>
                  <span className={styles.rowTag}>Lab</span>
                </Link>
              </li>
            ))}
            <Link to="/labs" className={styles.goLabs}>Go to Labs <Icon name="arrowRight" size={15} /></Link>
          </ul>
        </section>
      </div>

      {/* ---- quote ---- */}
      <div className={styles.quote}>
        <Icon name="quote" size={18} />
        <span className={styles.quoteText}>{quote.text}</span>
        <span className={styles.quoteBy}>— {quote.by}</span>
      </div>
    </div>
  );
}
