import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { SpinPage } from "./pages/SpinPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { EditorPage } from "./pages/EditorPage";
import type { Tab } from "./components/layout/BottomNavigation";

// ─── navigation types ─────────────────────────────────────────────────────────

type AppView =
  | { screen: "tabs"; tab: Tab; selectedRouletteId?: string }
  | { screen: "editor"; rouletteId?: string; templateId?: string };

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState<AppView>({ screen: "tabs", tab: "home" });

  // ── Navigation helpers ──────────────────────────────────────────────────

  function goToTab(tab: Tab, selectedRouletteId?: string) {
    setView({ screen: "tabs", tab, selectedRouletteId });
  }

  function openEditor(opts: { rouletteId?: string; templateId?: string } = {}) {
    setView({ screen: "editor", ...opts });
  }

  function openSpinFor(rouletteId: string) {
    setView({ screen: "tabs", tab: "spin", selectedRouletteId: rouletteId });
  }

  // ── Editor screen (full-screen, no bottom nav) ──────────────────────────

  if (view.screen === "editor") {
    return (
      <EditorPage
        rouletteId={view.rouletteId}
        templateId={view.templateId}
        onSaved={(id) => openSpinFor(id)}
        onCancel={() =>
          setView({ screen: "tabs", tab: view.rouletteId ? "home" : "home" })
        }
      />
    );
  }

  // ── Tab layout ──────────────────────────────────────────────────────────

  const { tab, selectedRouletteId } = view;

  function renderTab() {
    switch (tab) {
      case "home":
        return (
          <HomePage
            onNewRoulette={() => openEditor()}
            onOpenRoulette={(id) => openSpinFor(id)}
            onEditRoulette={(id) => openEditor({ rouletteId: id })}
            onUseTemplate={(tmplId) => openEditor({ templateId: tmplId })}
          />
        );
      case "explore":
        return (
          <ExplorePage
            onUseTemplate={(tmplId) => openEditor({ templateId: tmplId })}
          />
        );
      case "spin":
        return <SpinPage rouletteId={selectedRouletteId} />;
      case "history":
        return <HistoryPage />;
      case "settings":
        return <SettingsPage />;
    }
  }

  return (
    <AppLayout
      activeTab={tab}
      onTabChange={(newTab) => goToTab(newTab)}
    >
      {renderTab()}
    </AppLayout>
  );
}

export default App;
