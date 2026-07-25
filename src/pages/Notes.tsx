import { Button, Card, EmptyState, Icon } from "../components";
import { useProgress } from "../store/useProgress";
import { toast } from "../store/useToast";
import pageStyles from "./pages.module.css";
import styles from "./Notes.module.css";

function when(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " · " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function Notes() {
  const notes = useProgress((s) => s.notes);
  const addNote = useProgress((s) => s.addNote);
  const updateNote = useProgress((s) => s.updateNote);
  const deleteNote = useProgress((s) => s.deleteNote);

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHead}>
        <h1>Notes</h1>
        <p>Freeform study notes — jot down summaries, gotchas and exam angles. Saved automatically on this device.</p>
      </div>

      <div className={styles.bar}>
        <span className={styles.count}>{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
        <Button variant="primary" size="md" onClick={() => addNote()}>
          <Icon name="plus" size={16} /> New note
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon="note"
          title="No notes yet"
          description="Create your first note to capture what you're learning. Everything stays private on this device."
          tag="tip: one note per topic works well"
        />
      ) : (
        <div className={styles.grid}>
          {notes.map((n) => (
            <Card key={n.id} className={styles.note}>
              <div className={styles.noteHead}>
                <input
                  className={styles.title}
                  placeholder="Untitled note"
                  value={n.title}
                  maxLength={80}
                  onChange={(e) => updateNote(n.id, { title: e.target.value })}
                />
                <button
                  className={styles.del}
                  aria-label="Delete note"
                  onClick={() => {
                    deleteNote(n.id);
                    toast("Note deleted");
                  }}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
              <textarea
                className={styles.body}
                placeholder="Start writing…"
                value={n.body}
                rows={5}
                onChange={(e) => updateNote(n.id, { body: e.target.value })}
              />
              <div className={styles.meta}>Updated {when(n.updatedAt)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
