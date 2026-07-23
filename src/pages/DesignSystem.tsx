import { useState } from "react";
import { Badge, Button, Card, CardBody, CardHeader, Icon, ProgressRing, SegmentedControl } from "../components";
import styles from "./pages.module.css";

const SURFACES = ["ground", "surface", "surface-2", "surface-3", "rule"];
const SEMANTIC = ["brand", "ok", "warn", "bad", "info"];

export function DesignSystem() {
  const [seg, setSeg] = useState<"all" | "todo" | "done">("all");

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1>Design System</h1>
        <p>The tokens and primitives every screen is built from. This page is the living reference for the foundation.</p>
      </div>

      <Card>
        <CardHeader title="Colour" action={<span className="eyebrow">theme-aware</span>} />
        <CardBody className={styles.dsGroup}>
          <div className={styles.dsLabel}>Surfaces &amp; ink</div>
          <div className={styles.swatches}>
            {SURFACES.map((c) => (
              <div key={c} className={styles.swatchCell}>
                <div className={styles.swatchChip} style={{ background: `var(--${c})` }} />
                <div className={styles.swatchName}>--{c}</div>
              </div>
            ))}
          </div>
          <div className={styles.dsLabel}>Semantic</div>
          <div className={styles.swatches}>
            {SEMANTIC.map((c) => (
              <div key={c} className={styles.swatchCell}>
                <div className={styles.swatchChip} style={{ background: `var(--${c})` }} />
                <div className={styles.swatchName}>--{c}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Buttons" />
        <CardBody className={styles.dsGroup}>
          <div className={styles.dsRow}>
            <Button variant="primary">Primary</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" size="icon"><Icon name="check" size={18} /></Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Badges & controls" />
        <CardBody className={styles.dsGroup}>
          <div className={styles.dsRow}>
            <Badge tone="brand" dot>on track</Badge>
            <Badge tone="ok">easy</Badge>
            <Badge tone="warn">medium</Badge>
            <Badge tone="bad">hard</Badge>
            <Badge tone="neutral">7h</Badge>
          </div>
          <div className={styles.dsRow}>
            <SegmentedControl
              ariaLabel="Example filter"
              value={seg}
              onChange={setSeg}
              options={[
                { value: "all", label: "All" },
                { value: "todo", label: "To do" },
                { value: "done", label: "Done" },
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Progress ring" />
        <CardBody>
          <div className={styles.dsRow}>
            <ProgressRing value={26} label="topics" size={116} />
            <ProgressRing value={62} label="labs" size={116} />
            <ProgressRing value={88} label="hours" size={116} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
