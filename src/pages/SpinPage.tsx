import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { RouletteWheel } from "../components/roulette/RouletteWheel";
import { SpinButton } from "../components/roulette/SpinButton";
import { SpinResultCard } from "../components/roulette/SpinResultCard";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { personalities } from "../data/personalities";
import { templates } from "../data/templates";
import {
  getAvailableOptions,
  weightedRandomPick,
  getRandomPersonalityPhrase,
  createSpinResult,
  computeSegmentAngles,
  calculateFinalRotation,
} from "../utils/spin";
import { OPTION_COLORS } from "../data/colors";
import type { Roulette, RouletteOption, SpinResult } from "../types";

// Duration must match RouletteWheel's SPIN_DURATION (3600 ms) + buffer
const SPIN_DURATION_MS = 3600 + 300;

type SpinPhase = "idle" | "spinning" | "result";

const personalityEmoji: Record<string, string> = {
  dramatic: "🎭", snarky: "😏", cute: "🌸", honest: "🎯",
  villain: "😈", advisor: "🧘", chaotic: "🌀", professional: "💼",
};

const gameModeLabel: Record<string, string> = {
  classic: "Clássico", best_of_3: "Melhor de 3",
  veto: "Veto", elimination: "Eliminação",
};

// ─── props ────────────────────────────────────────────────────────────────────

interface SpinPageProps {
  /** When provided, SpinPage uses this specific roulette. */
  rouletteId?: string;
}

// ─── component ───────────────────────────────────────────────────────────────

export function SpinPage({ rouletteId }: SpinPageProps) {
  const { roulettes, createRoulette, addHistory } = useAppStore();

  const [activeRoulette, setActiveRoulette] = useState<Roulette | null>(null);
  const [spinPhase, setSpinPhase] = useState<SpinPhase>("idle");
  const [rotation, setRotation] = useState(0);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [beforePhrase, setBeforePhrase] = useState("");
  const [duringPhrase, setDuringPhrase] = useState("");

  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resolve active roulette ───────────────────────────────────────────────

  useEffect(() => {
    // Priority 1: specific roulette by id
    if (rouletteId) {
      const found = roulettes.find((r) => r.id === rouletteId);
      if (found) { setActiveRoulette(found); return; }
    }

    // Priority 2: first pinned roulette
    const pinned = roulettes.find((r) => r.isPinned);
    if (pinned) { setActiveRoulette(pinned); return; }

    // Priority 3: first roulette in store
    if (roulettes.length > 0) { setActiveRoulette(roulettes[0]); return; }

    // Fallback: create demo roulette from first template
    const tmpl = templates[0];
    const options: RouletteOption[] = tmpl.defaultOptions.map((o, i) => ({
      id: `demo-${i}`,
      label: o.label,
      weight: o.weight,
      color: o.color ?? OPTION_COLORS[i % OPTION_COLORS.length],
    }));
    const demo = createRoulette({
      name: tmpl.name,
      description: tmpl.description,
      options,
      personalityId: tmpl.recommendedPersonality,
      gameMode: tmpl.recommendedGameMode,
      templateId: tmpl.id,
    });
    setActiveRoulette(demo);
  }, [rouletteId, roulettes.length]);

  // Update active roulette if store changes (e.g. after edit)
  useEffect(() => {
    if (rouletteId && activeRoulette?.id === rouletteId) {
      const updated = roulettes.find((r) => r.id === rouletteId);
      if (updated) setActiveRoulette(updated);
    }
  }, [roulettes]);

  // ── Refresh "before" phrase ───────────────────────────────────────────────

  useEffect(() => {
    if (activeRoulette && spinPhase === "idle") {
      setBeforePhrase(
        getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "before")
      );
    }
  }, [activeRoulette, spinPhase]);

  // ── Cleanup timer on unmount ──────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    };
  }, []);

  // ── Spin handler ──────────────────────────────────────────────────────────

  function handleSpin() {
    if (!activeRoulette || spinPhase !== "idle") return;

    const available = getAvailableOptions(activeRoulette.options);
    const picked = weightedRandomPick(available);
    if (!picked) return;

    const segmentAngles = computeSegmentAngles(activeRoulette.options);
    const pickedIndex = activeRoulette.options.findIndex((o) => o.id === picked.id);
    const { centerAngle } = segmentAngles[pickedIndex];
    const finalRotation = calculateFinalRotation(rotation, centerAngle);

    const during = getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "during");
    const after = getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "after");

    setDuringPhrase(during);
    setSpinPhase("spinning");
    setRotation(finalRotation);

    spinTimerRef.current = setTimeout(() => {
      const result = createSpinResult(activeRoulette, picked, after);
      setCurrentResult(result);
      addHistory(result);
      setSpinPhase("result");
    }, SPIN_DURATION_MS);
  }

  function handleAccept() {
    setSpinPhase("idle");
    setCurrentResult(null);
  }

  function handleSpinAgain() {
    setSpinPhase("idle");
    setCurrentResult(null);
    setTimeout(handleSpin, 180);
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (!activeRoulette) return null;

  const personality = personalities.find((p) => p.id === activeRoulette.personalityId);

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] relative overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-xl font-black text-[#1C1917] leading-tight flex-1 truncate">
            {activeRoulette.name}
          </h2>
          <ChevronDown size={18} className="text-[#A89880] shrink-0" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {personality && (
            <Badge variant="primary">
              {personalityEmoji[personality.id]} {personality.name}
            </Badge>
          )}
          <Badge variant="muted">
            {gameModeLabel[activeRoulette.gameMode] ?? activeRoulette.gameMode}
          </Badge>
          <Badge variant="secondary">
            {activeRoulette.options.length} opções
          </Badge>
        </div>
      </div>

      {/* Wheel area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 pb-4">

        <AnimatePresence mode="wait">
          {spinPhase === "idle" && beforePhrase && (
            <motion.p
              key="before"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-[#6B5E52] italic max-w-xs px-2"
            >
              "{beforePhrase}"
            </motion.p>
          )}
          {spinPhase === "spinning" && (
            <motion.p
              key="during"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-[#E07B54] font-semibold max-w-xs px-2"
            >
              {duringPhrase}
            </motion.p>
          )}
        </AnimatePresence>

        <RouletteWheel
          options={activeRoulette.options}
          rotation={rotation}
          isSpinning={spinPhase === "spinning"}
        />

        <AnimatePresence>
          {spinPhase !== "result" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <SpinButton
                isSpinning={spinPhase === "spinning"}
                onClick={handleSpin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result card */}
      <AnimatePresence>
        {spinPhase === "result" && currentResult && (
          <SpinResultCard
            result={currentResult}
            onAccept={handleAccept}
            onSpinAgain={handleSpinAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
