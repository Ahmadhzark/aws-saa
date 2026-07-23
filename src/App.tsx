import { Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Topics } from "./pages/Topics";
import { Labs } from "./pages/Labs";
import { Log } from "./pages/Log";
import { Analytics } from "./pages/Analytics";
import { Goals } from "./pages/Goals";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./components/Onboarding";
import { useAccentSync } from "./theme/accents";
import { useHydrated, useProgress } from "./store/useProgress";

export function App() {
  useAccentSync();
  const hydrated = useHydrated();
  const onboarded = useProgress((s) => s.settings.onboarded);

  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="topics" element={<Topics />} />
          <Route path="labs" element={<Labs />} />
          <Route path="log" element={<Log />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="goals" element={<Goals />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
      {/* Gate on hydration so returning users never flash the welcome modal. */}
      {hydrated && !onboarded && <Onboarding />}
    </>
  );
}
