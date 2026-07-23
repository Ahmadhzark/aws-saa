import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "subtle" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon" | "iconSm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = "subtle", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={clsx(styles.btn, styles[variant], styles[size], className)} {...rest}>
      {children}
    </button>
  );
}
