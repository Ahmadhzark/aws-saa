import { useMemo, useState } from "react";
import clsx from "clsx";
import { Icon, SegmentedControl } from "../components";
import { TopicCard } from "../components/TopicCard";
import { DOMAINS, LABS, TOPICS } from "../data/curriculum";
import { useProgress } from "../store/useProgress";
import pageStyles from "./pages.module.css";
import styles from "./Topics.module.css";

type Status = "all" | "todo" | "done";
type Sort = "schedule" | "weak" | "az";

const domainIndex = new Map(DOMAINS.map((d, i) => [d.id, i]));
const domainName = new Map(DOMAINS.map((d) => [d.id, d.name]));

// Labs grouped by topic once — cheap lookups per card.
const labsByTopic = LABS.reduce<Record<string, string[]>>((acc, l) => {
  (acc[l.topic] ??= []).push(l.id);
  return acc;
}, {});

function idParts(id: string): [number, number] {
  const [a, b] = id.split(".").map(Number);
  return [a, b];
}

export function Topics() {
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState<string>("");
  const [status, setStatus] = useState<Status>("all");
  const [sort, setSort] = useState<Sort>("schedule");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const topics = useProgress((s) => s.topics);
  const labs = useProgress((s) => s.labs);
  const toggleTopic = useProgress((s) => s.toggleTopic);
  const setConfidence = useProgress((s) => s.setConfidence);
  const setTopicNotes = useProgress((s) => s.setTopicNotes);
  const setTopicTag = useProgress((s) => s.setTopicTag);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const bumpRevision = useProgress((s) => s.bumpRevision);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = TOPICS.filter((t) => {
      if (domain && t.domainId !== domain) return false;
      const p = topics[t.id];
      if (status === "done" && !p?.done) return false;
      if (status === "todo" && p?.done) return false;
      if (onlyBookmarked && !p?.bookmarked) return false;
      if (needle && !`${t.id} ${t.name} ${t.blurb}`.toLowerCase().includes(needle)) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "weak") {
        const ca = topics[a.id]?.confidence ?? 0;
        const cb = topics[b.id]?.confidence ?? 0;
        if (ca !== cb) return ca - cb;
      }
      const [aw, at] = idParts(a.id);
      const [bw, bt] = idParts(b.id);
      return a.week - b.week || aw - bw || at - bt;
    });
    return list;
  }, [q, domain, status, sort, onlyBookmarked, topics]);

  const doneCount = TOPICS.filter((t) => topics[t.id]?.done).length;

  // Group the visible topics under their main domain, preserving domain order,
  // so subtopics sit inside their parent objective rather than one flat list.
  const grouped = useMemo(() => {
    const byDomain = new Map<string, typeof visible>();
    for (const t of visible) {
      const arr = byDomain.get(t.domainId) ?? [];
      arr.push(t);
      byDomain.set(t.domainId, arr);
    }
    return DOMAINS.filter((d) => byDomain.has(d.id)).map((d) => ({ domain: d, items: byDomain.get(d.id)! }));
  }, [visible]);

  // Overall completion per domain (unfiltered) for the section headers.
  const domainTotals = useMemo(() => {
    const m = new Map<string, { done: number; total: number }>();
    for (const d of DOMAINS) {
      const ts = TOPICS.filter((t) => t.domainId === d.id);
      m.set(d.id, { total: ts.length, done: ts.filter((t) => topics[t.id]?.done).length });
    }
    return m;
  }, [topics]);

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Topics</h1>
        <p>All {TOPICS.length} blueprint objectives — {doneCount} complete. Tap a card to rate confidence, take notes and tag weak areas.</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <Icon name="search" size={18} />
          <input
            className={styles.search}
            type="search"
            placeholder="Search topics, tech, exam angles…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search topics"
          />
        </div>

        <div className={styles.chips} role="group" aria-label="Filter by domain">
          <button className={clsx(styles.chip, !domain && styles.chipOn)} onClick={() => setDomain("")}>All</button>
          {DOMAINS.map((d, i) => (
            <button
              key={d.id}
              className={clsx(styles.chip, domain === d.id && styles.chipOn)}
              onClick={() => setDomain(domain === d.id ? "" : d.id)}
            >
              <span className={styles.chipSwatch} style={{ background: `var(--d${i + 1})` }} />
              {d.id} {d.name}
            </button>
          ))}
        </div>

        <div className={styles.filters}>
          <SegmentedControl<Status>
            ariaLabel="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "todo", label: "To do" },
              { value: "done", label: "Done" },
            ]}
          />
          <SegmentedControl<Sort>
            ariaLabel="Sort topics"
            value={sort}
            onChange={setSort}
            options={[
              { value: "schedule", label: "Schedule" },
              { value: "weak", label: "Weakest" },
              { value: "az", label: "A–Z" },
            ]}
          />
          <button
            className={clsx(styles.bookmarkToggle, onlyBookmarked && styles.bookmarkOn)}
            aria-pressed={onlyBookmarked}
            onClick={() => setOnlyBookmarked((b) => !b)}
          >
            <Icon name="bookmark" size={15} />
            Saved
          </button>
          <span className={styles.spacer} />
          <span className={styles.count}>{visible.length} shown</span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className={styles.noResults}>No topics match those filters.</div>
      ) : (
        <div className={styles.groups}>
          {grouped.map(({ domain, items }) => {
            const idx = domainIndex.get(domain.id) ?? 0;
            const total = domainTotals.get(domain.id);
            return (
              <section key={domain.id} className={styles.domainGroup}>
                <div className={styles.domainHeader}>
                  <span className={styles.domainSwatch} style={{ background: `var(--d${idx + 1})` }} />
                  <span className={styles.domainTitle}><b>{domain.id}</b> {domain.name}</span>
                  <span className={styles.domainWeight}>{domain.weight}% exam</span>
                  <span className={styles.domainCount}>{total?.done ?? 0}/{total?.total ?? 0} done</span>
                </div>
                <div className={styles.list}>
                  {items.map((t) => {
                    const labIds = labsByTopic[t.id] ?? [];
                    const labDone = labIds.filter((id) => labs[id]?.status === "done").length;
                    return (
                      <TopicCard
                        key={t.id}
                        topic={t}
                        domainName={domainName.get(t.domainId) ?? ""}
                        accentIndex={domainIndex.get(t.domainId) ?? 0}
                        progress={topics[t.id]}
                        labs={{ done: labDone, total: labIds.length }}
                        onToggle={toggleTopic}
                        onConfidence={setConfidence}
                        onNotes={setTopicNotes}
                        onTag={setTopicTag}
                        onBookmark={toggleBookmark}
                        onRevision={bumpRevision}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
