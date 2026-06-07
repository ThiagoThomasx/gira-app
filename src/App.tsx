import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { SpinPage } from "./pages/SpinPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { EditorPage } from "./pages/EditorPage";
import { useAppStore } from "./store/useAppStore";
import { hasCompletedDailyDestiny } from "./utils/date";
import type { Tab } from "./components/layout/BottomNavigation";

// ─── navigation types ─────────────────────────────────────────────────────────

type AppView =
  | { screen: "tabs"; tab: Tab; selectedRouletteId?: string; isDailyDestiny?: boolean }
  | { screen: "editor"; rouletteId?: string; templateId?: string };

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState<AppView>({ screen: "tabs", tab: "home" });

  const { roulettes, startDailyDestiny, dailyDestiny } = useAppStore();

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

  function openDailyDestiny() {
    // Se já concluído hoje, navega de volta à roleta usada (com badge informativo)
    if (hasCompletedDailyDestiny(dailyDestiny) && dailyDestiny?.rouletteId) {
      setView({
        screen: "tabs",
        tab: "spin",
        selectedRouletteId: dailyDestiny.rouletteId,
        isDailyDestiny: true,
      });
      return;
    }

    // Escolhe uma roleta aleatória entre as existentes
    let rouletteId: string | undefined;
    if (roulettes.length > 0) {
      const idx = Math.floor(Math.random() * roulettes.length);
      rouletteId = roulettes[idx].id;
    }

    startDailyDestiny(rouletteId);
    setView({
      screen: "tabs",
      tab: "spin",
      selectedRouletteId: rouletteId,
      isDailyDestiny: true,
    });
  }

  // ── Editor screen (full-screen, no bottom nav) ──────────────────────────

  if (view.screen === "editor") {
    return (
      <EditorPage
        rouletteId={view.rouletteId}
        templateId={view.templateId}
        onSaved={(id) => openSpinFor(id)}
        onCancel={() => setView({ screen: "tabs", tab: "home" })}
      />
    );
  }

  // ── Tab layout ──────────────────────────────────────────────────────────

  const { tab, selectedRouletteId, isDailyDestiny } = view;

  function renderTab() {
    switch (tab) {
      case "home":
        return (
          <HomePage
            onNewRoulette={() => openEditor()}
            onOpenRoulette={(id) => openSpinFor(id)}
            onEditRoulette={(id) => openEditor({ rouletteId: id })}
            onUseTemplate={(tmplId) => openEditor({ templateId: tmplId })}
            onDailyDestiny={openDailyDestiny}
          />
        );
      case "explore":
        return (
          <ExplorePage
            onUseTemplate={(tmplId) => openEditor({ templateId: tmplId })}
          />
        );
      case "spin":
        return (
          <SpinPage
            rouletteId={selectedRouletteId}
            isDailyDestiny={isDailyDestiny}
            onCreateNew={() => openEditor()}
          />
        );
      case "history":
        return <HistoryPage onGoSpin={() => goToTab("spin")} />;
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
