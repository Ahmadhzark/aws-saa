import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Icon } from "../components";
import { useProgress } from "../store/useProgress";
import { toast } from "../store/useToast";
import pageStyles from "./pages.module.css";
import styles from "./Resources.module.css";

// Curated starter set of high-signal SAA-C03 study resources.
const CURATED: { title: string; url: string; note: string }[] = [
  { title: "SAA-C03 Official Exam Guide", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", note: "Domains, weights and the official blueprint." },
  { title: "AWS Skill Builder", url: "https://skillbuilder.aws/", note: "Free digital courses and the official practice exam." },
  { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", note: "The mental model behind most exam answers." },
  { title: "AWS Whitepapers & Guides", url: "https://aws.amazon.com/whitepapers/", note: "Reliability, security and cost-optimization pillars." },
  { title: "AWS Service FAQs", url: "https://aws.amazon.com/faqs/", note: "Fast, authoritative answers on service limits & behaviour." },
  { title: "AWS Free Tier", url: "https://aws.amazon.com/free/", note: "Spin up hands-on labs without a bill." },
];

function host(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

export function Resources() {
  const resources = useProgress((s) => s.resources);
  const addResource = useProgress((s) => s.addResource);
  const deleteResource = useProgress((s) => s.deleteResource);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const add = () => {
    const t = title.trim();
    let u = url.trim();
    if (!t || !u) return toast("Add a title and a link", { tone: "error" });
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    addResource({ title: t, url: u, note: note.trim() || undefined });
    setTitle(""); setUrl(""); setNote("");
    toast("Resource saved");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Resources</h1>
        <p>Curated study links, plus a place to save your own. Opens in a new tab.</p>
      </div>

      <Card>
        <CardHeader title="Recommended" action={<span className="eyebrow">{CURATED.length} links</span>} />
        <CardBody>
          <div className={styles.grid}>
            {CURATED.map((r) => (
              <a key={r.url} className={styles.res} href={r.url} target="_blank" rel="noopener noreferrer">
                <span className={styles.resIcon}><Icon name="link" size={16} /></span>
                <span className={styles.resMain}>
                  <span className={styles.resTitle}>{r.title}</span>
                  <span className={styles.resNote}>{r.note}</span>
                  <span className={styles.resHost}>{host(r.url)}</span>
                </span>
                <Icon name="external" size={15} className={styles.extIcon} />
              </a>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Your resources" action={<span className="eyebrow">{resources.length} saved</span>} />
        <CardBody>
          <div className={styles.addRow}>
            <input className={styles.input} placeholder="Title" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
            <input className={styles.input} placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className={styles.input} placeholder="Note (optional)" value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} />
            <Button variant="primary" size="md" onClick={add}><Icon name="plus" size={16} /> Save</Button>
          </div>

          {resources.length === 0 ? (
            <div className={styles.empty}>No saved links yet. Add practice exams, videos or docs you rely on.</div>
          ) : (
            <div className={styles.grid}>
              {resources.map((r) => (
                <div key={r.id} className={styles.res}>
                  <a className={styles.resLink} href={r.url} target="_blank" rel="noopener noreferrer">
                    <span className={styles.resIcon}><Icon name="link" size={16} /></span>
                    <span className={styles.resMain}>
                      <span className={styles.resTitle}>{r.title}</span>
                      {r.note && <span className={styles.resNote}>{r.note}</span>}
                      <span className={styles.resHost}>{host(r.url)}</span>
                    </span>
                  </a>
                  <button className={styles.del} aria-label="Delete resource" onClick={() => { deleteResource(r.id); toast("Removed"); }}>
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
