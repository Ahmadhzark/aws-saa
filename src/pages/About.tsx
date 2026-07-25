import { Badge, Card, CardBody, CardHeader, Icon } from "../components";
import type { IconName } from "../components";
import pageStyles from "./pages.module.css";
import styles from "./About.module.css";

// ---- EDIT ME: your links -------------------------------------------------
// Swap these for your real profiles/handles. Use "mailto:" for email.
const LINKS: { label: string; href: string; icon: IconName; hint: string }[] = [
  { label: "GitHub", href: "https://github.com/Ahmadhzark", icon: "external", hint: "Source & more projects" },
  { label: "Source code", href: "https://github.com/Ahmadhzark/aws-saa", icon: "link", hint: "This tracker's repo" },
  { label: "Email", href: "mailto:ahmadhzarkwork@gmail.com", icon: "mail", hint: "Get in touch" },
];

// ---- EDIT ME: your other trackers ---------------------------------------
// `current: true` marks the one you're viewing now. Use "#" for ones not live yet.
const TRACKERS: { name: string; blurb: string; href: string; current?: boolean; soon?: boolean }[] = [
  { name: "AWS SAA-C03 Tracker", blurb: "This app — a 14-week Solutions Architect Associate study companion.", href: "https://ahmadhzark.github.io/aws-saa/", current: true },
  { name: "CCNP ENCOR Tracker", blurb: "Cisco CCNP ENCOR (350-401) progress, labs and study plan.", href: "#", soon: true },
  { name: "More coming soon", blurb: "New certification trackers are in the works.", href: "#", soon: true },
];

export function About() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>About</h1>
        <p>Who made this, where to find more, and the other trackers in the family.</p>
      </div>

      <Card>
        <CardBody className={styles.hero}>
          <div className={styles.mark}><Icon name="labs" size={22} strokeWidth={2.25} /></div>
          <div className={styles.heroText}>
            <div className={styles.heroTitle}>AWS SAA-C03 Progress Tracker</div>
            <p className={styles.heroDesc}>
              A premium, local-first study companion for the AWS Certified Solutions Architect – Associate exam.
              Your data lives only on this device, works offline as an installable app, and is never sent anywhere.
            </p>
            <div className={styles.tags}>
              <Badge tone="brand" dot>Local-first PWA</Badge>
              <Badge tone="neutral">React + TypeScript</Badge>
              <Badge tone="neutral">Open source</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Our links" action={<Icon name="link" size={18} />} />
        <CardBody>
          <div className={styles.links}>
            {LINKS.map((l) => (
              <a
                key={l.label}
                className={styles.linkRow}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                <span className={styles.linkIcon}><Icon name={l.icon} size={16} /></span>
                <span className={styles.linkMain}>
                  <span className={styles.linkLabel}>{l.label}</span>
                  <span className={styles.linkHint}>{l.hint}</span>
                </span>
                <Icon name="external" size={15} className={styles.extIcon} />
              </a>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Other trackers" action={<span className="eyebrow">the family</span>} />
        <CardBody>
          <div className={styles.trackers}>
            {TRACKERS.map((t) => {
              const inner = (
                <>
                  <div className={styles.trackerTop}>
                    <span className={styles.trackerName}>{t.name}</span>
                    {t.current && <Badge tone="ok" dot>You're here</Badge>}
                    {t.soon && <Badge tone="warn">Soon</Badge>}
                  </div>
                  <p className={styles.trackerBlurb}>{t.blurb}</p>
                </>
              );
              return t.href === "#" ? (
                <div key={t.name} className={styles.tracker}>{inner}</div>
              ) : (
                <a key={t.name} className={styles.tracker} href={t.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <div className={styles.madeWith}>
        Made with <Icon name="heart" size={14} /> for exam-takers.
      </div>
    </div>
  );
}
