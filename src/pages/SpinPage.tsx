import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { RouletteWheel } from "../components/roulette/RouletteWheel";
import { SpinButton } from "../components/roulette/SpinButton";
import { SpinResultCard } from "../components/roulette/SpinResultCard";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { useMediaQuery } from "../hooks/useMediaQuery";
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

interface SpinPageProps {
  rouletteId?: string;
}

export function SpinPage({ rouletteId }: SpinPageProps) {
  const { roulettes, createRoulette, addHistory } = useAppStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const wheelSize = isDesktop ? 400 : 288;

  const [activeRoulette, setActiveRoulette] = useState<Roulette | null>(null);
  const [spinPhase, setSpinPhase] = useState<SpinPhase>("idle");
  const [rotation, setRotation] = useState(0);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [beforePhrase, setBeforePhrase] = useState("");
  const [duringPhrase, setDuringPhrase] = useState("");

  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resolve active roulette ───────────────────────────────────────────────

  useEffect(() => {
    if (rouletteId) {
      const found = roulettes.find((r) => r.id === rouletteId);
      if (found) { setActiveRoulette(found); return; }
    }
    const pinned = roulettes.find((r) => r.isPinned);
    if (pinned) { setActiveRoulette(pinned); return; }
    if (roulettes.length > 0) { setActiveRoulette(roulettes[0]); return; }

    const tmpl = templates[0];
    const options: RouletteOption[] = tmpl.defaultOptions.map((o, i) => ({
      id: `demo-${i}`, label: o.label, weight: o.weight,
      color: o.color ?? OPTION_COLORS[i % OPTION_COLORS.length],
    }));
    const demo = createRoulette({
      name: tmpl.name, description: tmpl.description, options,
      personalityId: tmpl.recommendedPersonality,
      gameMode: tmpl.recommendedGameMode, templateId: tmpl.id,
    });
    setActiveRoulette(demo);
  }, [rouletteId, roulettes.length]);

  useEffect(() => {
    if (rouletteId && activeRoulette?.id === rouletteId) {
      const updated = roulettes.find((r) => r.id === rouletteId);
      if (updated) setActiveRoulette(updated);
    }
  }, [roulettes]);

  useEffect(() => {
    if (activeRoulette && spinPhase === "idle") {
      setBeforePhrase(
        getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "before")
      );
    }
  }, [activeRoulette, spinPhase]);

  useEffect(() => () => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

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

  function handleAccept() { setSpinPhase("idle"); setCurrentResult(null); }
  function handleSpinAgain() {
    setSpinPhase("idle"); setCurrentResult(null);
    setTimeout(handleSpin, 180);
  }

  if (!activeRoulette) return null;

  const personality = personalities.find((p) => p.id === activeRoulette.personalityId);

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP layout — card/stage central
  // ─────────────────────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <div className="flex flex-col h-full bg-[#FFF8F0] overflow-y-auto">
        {/* Centering wrapper with breathing room */}
        <div className="flex-1 flex items-start justify-center px-6 py-8">
          {/* Stage card — max 1100px, rounded, subtle shadow */}
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              maxWidth: 1100,
              background: "rgba(255,248,240,0.85)",
              boxShadow: "0 0 0 1px #E7DCCF, 0 12px 56px rgba(28,25,23,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* ── Stage header ─────────────────────────────────────────── */}
            <div
              className="px-8 pt-6 pb-4 flex items-center gap-4"
              style={{ borderBottom: "1px solid #F0E8DF" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-2xl font-black text-[#1C1917] leading-tight truncate">
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

              {/* Subtle personality orb */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: "#F3EDE4", border: "1.5px solid #E7DCCF" }}
              >
                {personalityEmoji[activeRoulette.personalityId] ?? "🎲"}
              </div>
            </div>

            {/* ── Stage body — grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-[1.2fr_0.8fr]">

              {/* Left: wheel area */}
              <div
                className="flex flex-col items-center justify-center gap-5 px-10 py-8"
                style={{ background: "rgba(243,237,228,0.35)" }}
              >
                {/* Phrase */}
                <AnimatePresence mode="wait">
                  {spinPhase === "idle" && beforePhrase && (
                    <motion.p key="before"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="text-center text-sm text-[#6B5E52] italic max-w-sm"
                    >
                      "{beforePhrase}"
                    </motion.p>
                  )}
                  {spinPhase === "spinning" && (
                    <motion.p key="during"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="text-center text-sm text-[#E07B54] font-semibold max-w-sm"
                    >
                      {duringPhrase}
                    </motion.p>
                  )}
                  {spinPhase === "result" && (
                    <motion.p key="result-placeholder"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center text-sm text-[#A89880] max-w-sm"
                    >
                      O destino falou. Veja ao lado →
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Wheel */}
                <RouletteWheel
                  options={activeRoulette.options}
                  rotation={rotation}
                  isSpinning={spinPhase === "spinning"}
                  size={wheelSize}
                />

                {/* Spin button — hidden when result is showing */}
                <AnimatePresence>
                  {spinPhase !== "result" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <SpinButton isSpinning={spinPhase === "spinning"} onClick={handleSpin} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: info panel */}
              <div className="flex flex-col gap-3 px-6 py-8 overflow-y-auto">

                {/* Options card */}
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "white", border: "1px solid #E7DCCF" }}
                >
                  <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-3">
                    Opções
                  </p>
                  <div className="flex flex-col gap-2">
                    {activeRoulette.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: opt.color }}
                        />
                        <span className="text-sm text-[#1C1917] flex-1 truncate">{opt.label}</span>
                        {opt.weight > 1 && (
                          <span className="text-[11px] text-[#A89880] shrink-0 font-medium">
                            ×{opt.weight}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode + personality summary card */}
                <div
                  className="rounded-2xl p-4 flex gap-4"
                  style={{ background: "#F9F4EE", border: "1px solid #EDE5DA" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-1">
                      Modo
                    </p>
                    <p className="text-sm font-semibold text-[#1C1917]">
                      {gameModeLabel[activeRoulette.gameMode] ?? activeRoulette.gameMode}
                    </p>
                  </div>
                  {personality && (
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-1">
                        Personalidade
                      </p>
                      <p className="text-sm font-semibold text-[#1C1917]">
                        {personalityEmoji[personality.id]} {personality.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Result card — appears inline */}
                <AnimatePresence>
                  {spinPhase === "result" && currentResult && (
                    <SpinResultCard
                      result={currentResult}
                      onAccept={handleAccept}
                      onSpinAgain={handleSpinAgain}
                      variant="inline"
                    />
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE layout — single column (unchanged)
  // ─────────────────────────────────────────────────────────────────────────

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

      {/* Center area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 pb-4">
        <AnimatePresence mode="wait">
          {spinPhase === "idle" && beforePhrase && (
            <motion.p key="before"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-[#6B5E52] italic max-w-xs px-2"
            >
              "{beforePhrase}"
            </motion.p>
          )}
          {spinPhase === "spinning" && (
            <motion.p key="during"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
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
          size={wheelSize}
        />

        <AnimatePresence>
          {spinPhase !== "result" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <SpinButton isSpinning={spinPhase === "spinning"} onClick={handleSpin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {spinPhase === "result" && currentResult && (
          <SpinResultCard
            result={currentResult}
            onAccept={handleAccept}
            onSpinAgain={handleSpinAgain}
            variant="overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
