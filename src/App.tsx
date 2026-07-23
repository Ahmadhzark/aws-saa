import { Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { Topics } from "./pages/Topics";
import { Labs } from "./pages/Labs";
import { Log } from "./pages/Log";
import { Analytics } from "./pages/Analytics";
import { Goals } from "./pages/Goals";
import { DesignSystem } from "./pages/DesignSystem";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="topics" element={<Topics />} />
        <Route path="labs" element={<Labs />} />
        <Route path="log" element={<Log />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="goals" element={<Goals />} />
        <Route path="design" element={<DesignSystem />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
