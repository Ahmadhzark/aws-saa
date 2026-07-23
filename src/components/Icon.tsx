// Inline, dependency-free icon set (stroke-based, 24x24). Bundled — no icon
// library, no CDN — so the app stays offline/CSP-safe. Add paths as needed.

export type IconName =
  | "dashboard" | "topics" | "labs" | "analytics"
  | "sun" | "moon" | "monitor" | "search" | "check" | "chevronDown"
  | "menu" | "close" | "flame" | "clock" | "target"
  | "bookmark" | "plus" | "layers" | "sort"
  | "settings" | "user" | "palette" | "trash" | "calendar" | "arrowRight"
  | "play" | "pause" | "stop" | "refresh" | "book" | "quote";

const PATHS: Record<IconName, string> = {
  dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  topics: "M4 6h16M4 12h16M4 18h10",
  labs: "M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3",
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chevronDown: "M6 9l6 6 6-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  flame: "M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 0-1 .5-2 1.5 1.5 2.5 3 2.5 5a5 5 0 0 1-10 0c0-3 3-5 5-10z",
  clock: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  plus: "M12 5v14M5 12h14",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  sort: "M7 5v14M7 5l-3 3M7 5l3 3M17 19V5M17 19l3-3M17 19l-3-3",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
  palette: "M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H19a3 3 0 0 0 3-3A9 9 0 0 0 12 3zM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  play: "M7 5.5v13l11-6.5z",
  pause: "M8 5v14M16 5v14",
  stop: "M6.5 6.5h11v11h-11z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v5h-5",
  book: "M5 4h11a2 2 0 0 1 2 2v14a1 1 0 0 0-1-1H5zM5 19a2 2 0 0 0 2 2h11",
  quote: "M6 7h5v6a4 4 0 0 1-4 4M14 7h5v6a4 4 0 0 1-4 4",
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
