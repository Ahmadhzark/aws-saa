import { useEffect, useState } from "react";
import { fileDel, fileGet, fileSet } from "../lib/db";
import { toast } from "../store/useToast";
import { todayISO } from "../lib/time";
import type { FileRef } from "../store/types";
import { Icon } from "./Icon";
import styles from "./Attachments.module.css";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB per file — plenty for screenshots/.pkt

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AttachmentsProps {
  attachments: FileRef[];
  onAdd: (ref: FileRef) => void;
  onRemove: (refId: string) => void;
}

export function Attachments({ attachments, onAdd, onRemove }: AttachmentsProps) {
  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        toast(`${file.name} is too large (max 15 MB)`, { tone: "error" });
        continue;
      }
      const id = crypto.randomUUID();
      try {
        await fileSet(id, file);
        onAdd({ id, name: file.name, type: file.type || "application/octet-stream", size: file.size, addedAt: todayISO() });
      } catch {
        toast(`Couldn't save ${file.name}`, { tone: "error" });
      }
    }
  }

  async function remove(ref: FileRef) {
    await fileDel(ref.id).catch(() => {});
    onRemove(ref.id);
  }

  return (
    <div className={styles.wrap}>
      {attachments.length > 0 && (
        <div className={styles.grid}>
          {attachments.map((ref) => (
            <AttachmentItem key={ref.id} refItem={ref} onRemove={() => remove(ref)} />
          ))}
        </div>
      )}
      <label className={styles.upload}>
        <Icon name="plus" size={16} />
        Add screenshot or file
        <input
          type="file"
          multiple
          accept="image/*,.pkt,.pka,.txt,.cfg,.conf,.log,.json,.xml,.zip"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <span className={styles.hint}>Stored on this device (IndexedDB) · max 15 MB each</span>
    </div>
  );
}

function AttachmentItem({ refItem, onRemove }: { refItem: FileRef; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = refItem.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;
    let active = true;
    let created: string | null = null;
    fileGet(refItem.id).then((blob) => {
      if (blob && active) {
        created = URL.createObjectURL(blob);
        setUrl(created);
      }
    });
    return () => {
      active = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [refItem.id, isImage]);

  async function open() {
    const blob = await fileGet(refItem.id);
    if (!blob) return;
    const u = URL.createObjectURL(blob);
    window.open(u, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(u), 30000);
  }

  return (
    <div className={styles.item}>
      {isImage && url ? (
        <img className={styles.thumb} src={url} alt={refItem.name} onClick={open} />
      ) : (
        <div className={styles.fileIcon} role="button" tabIndex={0} onClick={open} onKeyDown={(e) => e.key === "Enter" && open()}>
          <Icon name="labs" size={26} />
        </div>
      )}
      <div className={styles.itemMeta}>
        <div className={styles.itemName} title={refItem.name}>{refItem.name}</div>
        <div className={styles.itemSize}>{humanSize(refItem.size)}</div>
      </div>
      <button type="button" className={styles.remove} aria-label={`Remove ${refItem.name}`} onClick={onRemove}>
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}
