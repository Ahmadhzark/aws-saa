import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Badge } from "./Badge";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: ReactNode;
  tag?: string;
}

export function EmptyState({ icon, title, description, tag }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <Icon name={icon} size={26} />
      </div>
      <div className={styles.title}>{title}</div>
      <p className={styles.desc}>{description}</p>
      {tag && (
        <div className={styles.tag}>
          <Badge tone="brand" dot>{tag}</Badge>
        </div>
      )}
    </div>
  );
}
