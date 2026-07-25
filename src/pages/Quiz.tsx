import { Badge, Card, CardBody, Icon } from "../components";
import pageStyles from "./pages.module.css";
import styles from "./Quiz.module.css";

const PLANNED = [
  { icon: "topics" as const, title: "Topic quizzes", text: "Auto-generated question sets scoped to any domain or week." },
  { icon: "flame" as const, title: "Timed mock exams", text: "65 questions, 130 minutes — mirroring the real SAA-C03 format." },
  { icon: "analytics" as const, title: "Score tracking", text: "Results feed your analytics and surface weak areas to revisit." },
];

export function Quiz() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Quiz</h1>
        <p>Test your recall with topic quizzes and full mock exams.</p>
      </div>

      <Card>
        <CardBody className={styles.hero}>
          <div className={styles.badge}><Icon name="help" size={30} /></div>
          <div className={styles.heroTitle}>Quizzes are coming soon</div>
          <p className={styles.heroText}>
            This is where you'll drill questions and run mock exams. The feature is scaffolded and ready to build out —
            here's what's planned.
          </p>
          <Badge tone="brand" dot>In development</Badge>
        </CardBody>
      </Card>

      <div className={styles.grid}>
        {PLANNED.map((p) => (
          <Card key={p.title} className={styles.card}>
            <div className={styles.cardIcon}><Icon name={p.icon} size={18} /></div>
            <div className={styles.cardTitle}>{p.title}</div>
            <p className={styles.cardText}>{p.text}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <button className={styles.cta} disabled aria-disabled="true" title="Available in a future update">
            <Icon name="play" size={16} /> Start a quiz — coming soon
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
