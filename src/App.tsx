import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

// Tab order determines slide direction: higher index → right side of the nav
const TAB_ORDER: Tab[] = ["home", "explore", "spin", "history", "settings"];

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState<AppView>({ screen: "tabs", tab: "home" });
  // Track previous tab to compute slide direction
  const prevTabRef = useRef<Tab>("home");

  const { roulettes, startDailyDestiny, dailyDestiny } = useAppStore();

  // ── Navigation helpers ──────────────────────────────────────────────────

  function goToTab(tab: Tab, selectedRouletteId?: string) {
    prevTabRef.current = view.screen === "tabs" ? view.tab : "home";
    setView({ screen: "tabs", tab, selectedRouletteId });
  }

  function openEditor(opts: { rouletteId?: string; templateId?: string } = {}) {
    setView({ screen: "editor", ...opts });
  }

  function openSpinFor(rouletteId: string) {
    prevTabRef.current = view.screen === "tabs" ? view.tab : "home";
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
        onDeleted={() => setView({ screen: "tabs", tab: "home" })}
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

  // Slide direction: +1 = new tab is to the right → enters from right
  const currentIdx = TAB_ORDER.indexOf(tab);
  const prevIdx    = TAB_ORDER.indexOf(prevTabRef.current);
  const direction  = currentIdx >= prevIdx ? 1 : -1;

  return (
    <AppLayout
      activeTab={tab}
      onTabChange={(newTab) => goToTab(newTab)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: direction * 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 18 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          // Fill the scrollable <main> — scroll stays on the parent AppLayout <main>
          className="h-full"
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
