import { useTheme } from "../theme/ThemeProvider";
import type { ThemePref } from "../theme/ThemeProvider";
import { Icon } from "./Icon";
import { SegmentedControl } from "./SegmentedControl";

export function ThemeToggle() {
  const { pref, setPref } = useTheme();
  return (
    <SegmentedControl<ThemePref>
      ariaLabel="Colour theme"
      value={pref}
      onChange={setPref}
      options={[
        { value: "system", icon: <Icon name="monitor" size={16} />, title: "System theme" },
        { value: "light", icon: <Icon name="sun" size={16} />, title: "Light theme" },
        { value: "dark", icon: <Icon name="moon" size={16} />, title: "Dark theme" },
      ]}
    />
  );
}
