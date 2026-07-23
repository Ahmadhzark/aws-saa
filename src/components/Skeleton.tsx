import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

export function Skeleton({ width, height = 16, radius, className }: SkeletonProps) {
  const style: CSSProperties = { width, height };
  if (radius != null) style.borderRadius = radius;
  return <span className={`${styles.sk} ${className ?? ""}`} style={{ display: "block", ...style }} />;
}
