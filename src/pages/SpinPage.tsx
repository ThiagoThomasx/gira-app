import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { RouletteWheel } from "../components/roulette/RouletteWheel";
import { SpinButton } from "../components/roulette/SpinButton";
import { SpinResultCard } from "../components/roulette/SpinResultCard";
import { RouletteSelector } from "../components/roulette/RouletteSelector";
import { VetoPanel } from "../components/roulette/VetoPanel";
import { BestOfThreePanel } from "../components/roulette/BestOfThreePanel";
import { EliminationPanel } from "../components/roulette/EliminationPanel";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSound } from "../hooks/useSound";
import { hasCompletedDailyDestiny } from "../utils/date";
import {
  toggleVetoOption,
  getVetoAvailableOptions,
  canSpinWithVeto,
  initializeBestOfThreeSession,
  addBestOfThreeRound,
  getBestOfThreeWinner,
  isBestOfThreeComplete,
  initializeEliminationSession,
  addEliminationRound,
  getRemainingEliminationOptions,
  isEliminationComplete,
  getEliminationWinner,
} from "../utils/gameModes";
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
import type {
  Roulette,
  RouletteOption,
  SpinResult,
  BestOfThreeSession,
  EliminationSession,
} from "../types";

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
  isDailyDestiny?: boolean;
  onCreateNew: () => void;
}

export function SpinPage({ rouletteId, isDailyDestiny, onCreateNew }: SpinPageProps) {
  const {
    roulettes, preferences, dailyDestiny,
    createRoulette, addHistory, completeDailyDestiny, setLastActiveRouletteId,
  } = useAppStore();

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const wheelSize = isDesktop ? 400 : 288;

  // ── Core state ────────────────────────────────────────────────────────────
  const [activeRoulette, setActiveRoulette] = useState<Roulette | null>(null);
  const [spinPhase, setSpinPhase] = useState<SpinPhase>("idle");
  const [rotation, setRotation] = useState(0);
  const [currentResult, setCurrentResult] = useState<SpinResult | null>(null);
  const [beforePhrase, setBeforePhrase] = useState("");
  const [duringPhrase, setDuringPhrase] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  // Track whether the current result is intermediate (not final) for bo3/elimination
  const [isIntermediateResult, setIsIntermediateResult] = useState(false);

  // ── Game mode session state ───────────────────────────────────────────────
  const [vetoedIds, setVetoedIds] = useState<string[]>([]);
  const [bo3Session, setBo3Session] = useState<BestOfThreeSession | null>(null);
  const [elimSession, setElimSession] = useState<EliminationSession | null>(null);

  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickCleanupRef = useRef<(() => void) | null>(null);

  const { scheduleTicks, playResult } = useSound();

  // ── Resolve active roulette on mount ─────────────────────────────────────

  useEffect(() => {
    if (rouletteId) {
      const found = roulettes.find((r) => r.id === rouletteId);
      if (found) { setActiveRoulette(found); return; }
    }
    const lastId = preferences.lastActiveRouletteId;
    if (lastId) {
      const last = roulettes.find((r) => r.id === lastId);
      if (last) { setActiveRoulette(last); return; }
    }
    const pinned = roulettes.find((r) => r.isPinned);
    if (pinned) { setActiveRoulette(pinned); return; }
    if (roulettes.length > 0) { setActiveRoulette(roulettes[0]); return; }
    // Demo from template
    const tmpl = templates[0];
    const opts: RouletteOption[] = tmpl.defaultOptions.map((o, i) => ({
      id: `demo-${i}`, label: o.label, weight: o.weight,
      color: o.color ?? OPTION_COLORS[i % OPTION_COLORS.length],
    }));
    const demo = createRoulette({
      name: tmpl.name, description: tmpl.description, options: opts,
      personalityId: tmpl.recommendedPersonality,
      gameMode: tmpl.recommendedGameMode, templateId: tmpl.id,
    });
    setActiveRoulette(demo);
  }, [rouletteId, roulettes.length]);

  // Sync when roulette data changes (e.g. after edit)
  useEffect(() => {
    if (rouletteId && activeRoulette?.id === rouletteId) {
      const updated = roulettes.find((r) => r.id === rouletteId);
      if (updated) setActiveRoulette(updated);
    }
  }, [roulettes]);

  // Persist last active roulette
  useEffect(() => {
    if (activeRoulette) setLastActiveRouletteId(activeRoulette.id);
  }, [activeRoulette?.id]);

  // Before-phase phrase
  useEffect(() => {
    if (activeRoulette && spinPhase === "idle") {
      setBeforePhrase(
        getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "before")
      );
    }
  }, [activeRoulette, spinPhase]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    if (tickCleanupRef.current) tickCleanupRef.current();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────

  function getWheelOptions(): RouletteOption[] {
    if (!activeRoulette) return [];
    const mode = activeRoulette.gameMode;
    if (mode === "veto") {
      return getVetoAvailableOptions(activeRoulette.options, vetoedIds);
    }
    if (mode === "elimination") {
      const sess = elimSession ?? initializeEliminationSession();
      return getRemainingEliminationOptions(activeRoulette.options, sess);
    }
    return getAvailableOptions(activeRoulette.options);
  }

  const wheelOptions = getWheelOptions();

  function getCanSpin(): boolean {
    if (!activeRoulette || spinPhase !== "idle") return false;
    if (activeRoulette.gameMode === "veto") {
      return canSpinWithVeto(activeRoulette.options, vetoedIds);
    }
    if (activeRoulette.gameMode === "elimination") {
      return wheelOptions.length >= 2;
    }
    return true;
  }

  const canSpin = getCanSpin();

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSpin() {
    if (!activeRoulette || spinPhase !== "idle" || !canSpin) return;

    const mode = activeRoulette.gameMode;
    const spinOptions = wheelOptions;
    const picked = weightedRandomPick(spinOptions);
    if (!picked) return;

    const segmentAngles = computeSegmentAngles(spinOptions);
    const pickedIndex = spinOptions.findIndex((o) => o.id === picked.id);
    const { centerAngle } = segmentAngles[pickedIndex];
    const finalRotation = calculateFinalRotation(rotation, centerAngle);

    const during = getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "during");
    const after = getRandomPersonalityPhrase(personalities, activeRoulette.personalityId, "after");

    setDuringPhrase(during);
    setSpinPhase("spinning");
    setRotation(finalRotation);

    // Schedule tick sounds for the spin duration
    if (tickCleanupRef.current) tickCleanupRef.current();
    tickCleanupRef.current = scheduleTicks(SPIN_DURATION_MS);

    spinTimerRef.current = setTimeout(() => {
      // Result ding — plays once when result is revealed
      playResult();
      if (mode === "classic" || mode === "veto") {
        const result = createSpinResult(activeRoulette, picked, after);
        setCurrentResult(result);
        setIsIntermediateResult(false);
        addHistory(result);
        if (isDailyDestiny && !hasCompletedDailyDestiny(dailyDestiny)) {
          completeDailyDestiny(result.id);
        }

      } else if (mode === "best_of_3") {
        const current = bo3Session ?? initializeBestOfThreeSession();
        const newSession = addBestOfThreeRound(current, picked);
        setBo3Session(newSession);

        if (isBestOfThreeComplete(newSession)) {
          const winner = getBestOfThreeWinner(newSession) ?? picked;
          const result = createSpinResult(activeRoulette, winner, after);
          setCurrentResult(result);
          setIsIntermediateResult(false);
          addHistory(result);
          if (isDailyDestiny && !hasCompletedDailyDestiny(dailyDestiny)) {
            completeDailyDestiny(result.id);
          }
        } else {
          // Intermediate: show round result, don't save history
          const partialPhrase = `Rodada ${newSession.rounds.length} registrada!`;
          const result = createSpinResult(activeRoulette, picked, partialPhrase);
          setCurrentResult(result);
          setIsIntermediateResult(true);
        }

      } else if (mode === "elimination") {
        const current = elimSession ?? initializeEliminationSession();
        const newSession = addEliminationRound(current, picked);
        setElimSession(newSession);

        if (isEliminationComplete(activeRoulette.options, newSession)) {
          const winner = getEliminationWinner(activeRoulette.options, newSession) ?? picked;
          const result = createSpinResult(activeRoulette, winner, after);
          setCurrentResult(result);
          setIsIntermediateResult(false);
          addHistory(result);
          if (isDailyDestiny && !hasCompletedDailyDestiny(dailyDestiny)) {
            completeDailyDestiny(result.id);
          }
        } else {
          // Intermediate: picked option was eliminated
          const elim = `${picked.label} foi eliminada.`;
          const result = createSpinResult(activeRoulette, picked, elim);
          setCurrentResult(result);
          setIsIntermediateResult(true);
        }
      }

      setSpinPhase("result");
    }, SPIN_DURATION_MS);
  }

  function handleSelectRoulette(id: string) {
    if (spinTimerRef.current) { clearTimeout(spinTimerRef.current); spinTimerRef.current = null; }
    const found = roulettes.find((r) => r.id === id);
    if (!found) return;
    setActiveRoulette(found);
    setSpinPhase("idle");
    setCurrentResult(null);
    setIsIntermediateResult(false);
    setVetoedIds([]);
    setBo3Session(null);
    setElimSession(null);
  }

  function handleToggleVeto(optionId: string) {
    setVetoedIds((prev) => toggleVetoOption(prev, optionId));
  }

  /** Accept / Continue — behaviour depends on mode and intermediate flag. */
  function handleAccept() {
    const mode = activeRoulette?.gameMode;
    if (isIntermediateResult) {
      // Go back to idle for the next spin (session preserved)
      setSpinPhase("idle");
      setCurrentResult(null);
      setIsIntermediateResult(false);
    } else {
      // Final result — reset session for the next full game
      setSpinPhase("idle");
      setCurrentResult(null);
      setIsIntermediateResult(false);
      if (mode === "best_of_3") setBo3Session(null);
      if (mode === "elimination") setElimSession(null);
    }
  }

  /** Restart the whole session and spin immediately. */
  function handleSpinAgain() {
    const mode = activeRoulette?.gameMode;
    setSpinPhase("idle");
    setCurrentResult(null);
    setIsIntermediateResult(false);
    if (mode === "best_of_3") setBo3Session(null);
    if (mode === "elimination") setElimSession(null);
    setTimeout(handleSpin, 180);
  }

  if (!activeRoulette) return null;

  const mode = activeRoulette.gameMode;
  const personality = personalities.find((p) => p.id === activeRoulette.personalityId);
  const dailyAlreadyDone = isDailyDestiny && hasCompletedDailyDestiny(dailyDestiny);

  // ── Result card copy by mode ──────────────────────────────────────────────

  function getResultCardProps() {
    if (!currentResult) return null;

    if (mode === "best_of_3") {
      if (isIntermediateResult) {
        const roundNum = bo3Session?.rounds.length ?? 1;
        return {
          title: "Rodada registrada",
          roundLabel: `Rodada ${roundNum} de 3`,
          acceptLabel: "Próxima rodada →",
          isFinalResult: false,
          onSpinAgain: undefined,
        };
      }
      return {
        title: "Melhor de 3 decidido!",
        roundLabel: "3 de 3 rodadas",
        acceptLabel: "Aceitar resultado",
        isFinalResult: true,
        onSpinAgain: handleSpinAgain,
        spinAgainLabel: "Jogar de novo",
      };
    }

    if (mode === "elimination") {
      if (isIntermediateResult) {
        return {
          title: "Eliminada!",
          acceptLabel: "Continuar eliminação 🔥",
          isFinalResult: false,
          onSpinAgain: undefined,
        };
      }
      return {
        title: "Sobreviveu ao caos!",
        acceptLabel: "Aceitar vencedor",
        isFinalResult: true,
        onSpinAgain: handleSpinAgain,
        spinAgainLabel: "Jogar de novo",
      };
    }

    // Classic / Veto
    return {
      title: undefined,
      roundLabel: undefined,
      acceptLabel: "Aceitar",
      isFinalResult: false,
      onSpinAgain: handleSpinAgain,
    };
  }

  const resultCardProps = getResultCardProps();

  // ── Daily badge ───────────────────────────────────────────────────────────

  const dailyBadge = isDailyDestiny && (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={
        dailyAlreadyDone
          ? { background: "#84A98C22", color: "#4A7A55", border: "1px solid #84A98C55" }
          : { background: "#F4C43020", color: "#B8860B", border: "1px solid #F4C43055" }
      }
    >
      {dailyAlreadyDone ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
      {dailyAlreadyDone ? "Destino do dia concluído" : "Destino do dia"}
    </div>
  );

  // ── Phrase area ───────────────────────────────────────────────────────────

  const phraseArea = (
    <AnimatePresence mode="wait">
      {spinPhase === "idle" && beforePhrase && (
        <motion.p key="before"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="text-center text-sm text-[#6B5E52] italic max-w-sm px-2"
        >
          "{beforePhrase}"
        </motion.p>
      )}
      {spinPhase === "spinning" && (
        <motion.p key="during"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className={`text-center text-sm font-semibold max-w-sm px-2 ${mode === "elimination" ? "text-[#C96A43]" : "text-[#E07B54]"}`}
        >
          {duringPhrase}
        </motion.p>
      )}
      {spinPhase === "result" && !isDesktop && (
        <motion.p key="result-hint"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="text-center text-sm text-[#A89880] max-w-sm px-2"
        >
          {mode === "elimination" && isIntermediateResult ? "Uma a menos na disputa..." : ""}
        </motion.p>
      )}
    </AnimatePresence>
  );

  // ── Mode-specific right panel content (desktop) ───────────────────────────

  function renderDesktopRightPanel() {
    return (
      <>
        {/* Mode panel */}
        {mode === "veto" && (
          <VetoPanel
            options={activeRoulette!.options}
            vetoedIds={vetoedIds}
            onToggleVeto={handleToggleVeto}
            layout="card"
          />
        )}
        {mode === "best_of_3" && (
          <BestOfThreePanel session={bo3Session} layout="card" />
        )}
        {mode === "elimination" && (
          <EliminationPanel
            options={activeRoulette!.options}
            session={elimSession}
            layout="card"
          />
        )}
        {mode === "classic" && (
          /* Classic: show simple options list */
          <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #E7DCCF" }}>
            <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-3">Opções</p>
            <div className="flex flex-col gap-2">
              {activeRoulette!.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: opt.color }} />
                  <span className="text-sm text-[#1C1917] flex-1 truncate">{opt.label}</span>
                  {opt.weight > 1 && (
                    <span className="text-[11px] text-[#A89880] shrink-0 font-medium">×{opt.weight}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode + personality summary */}
        <div className="rounded-2xl p-4 flex gap-4" style={{ background: "#F9F4EE", border: "1px solid #EDE5DA" }}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-1">Modo</p>
            <p className="text-sm font-semibold text-[#1C1917]">
              {gameModeLabel[mode] ?? mode}
            </p>
          </div>
          {personality && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-1">Personalidade</p>
              <p className="text-sm font-semibold text-[#1C1917]">
                {personalityEmoji[personality.id]} {personality.name}
              </p>
            </div>
          )}
        </div>

        {/* Result card */}
        <AnimatePresence>
          {spinPhase === "result" && currentResult && resultCardProps && (
            <SpinResultCard
              result={currentResult}
              onAccept={handleAccept}
              variant="inline"
              {...resultCardProps}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP layout
  // ─────────────────────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <div className="flex flex-col h-full bg-[#FFF8F0] overflow-y-auto">
        <div className="flex-1 flex items-start justify-center px-6 py-8">
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              maxWidth: 1100,
              background: "rgba(255,248,240,0.85)",
              boxShadow: "0 0 0 1px #E7DCCF, 0 12px 56px rgba(28,25,23,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* ── Stage header ───────────────────────────────────────────── */}
            <div
              className="px-8 pt-6 pb-4 flex items-center gap-4"
              style={{ borderBottom: "1px solid #F0E8DF" }}
            >
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectorOpen(true)}
                  className="flex items-center gap-2 mb-1.5 group cursor-pointer"
                >
                  <h2 className="text-2xl font-black text-[#1C1917] leading-tight truncate group-hover:text-[#E07B54] transition-colors">
                    {activeRoulette.name}
                  </h2>
                  <ChevronDown size={18} className="text-[#A89880] shrink-0 group-hover:text-[#E07B54] transition-colors" />
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                  {isDailyDestiny && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={
                        dailyAlreadyDone
                          ? { background: "#84A98C22", color: "#4A7A55", border: "1px solid #84A98C55" }
                          : { background: "#F4C43020", color: "#B8860B", border: "1px solid #F4C43055" }
                      }
                    >
                      {dailyAlreadyDone ? <CheckCircle2 size={10} /> : <Sparkles size={10} />}
                      {dailyAlreadyDone ? "Concluído" : "Destino do dia"}
                    </span>
                  )}
                  {personality && <Badge variant="primary">{personalityEmoji[personality.id]} {personality.name}</Badge>}
                  <Badge variant="muted">{gameModeLabel[mode] ?? mode}</Badge>
                  <Badge variant="secondary">{activeRoulette.options.length} opções</Badge>
                </div>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: "#F3EDE4", border: "1.5px solid #E7DCCF" }}
              >
                {personalityEmoji[activeRoulette.personalityId] ?? "🎲"}
              </div>
            </div>

            {/* ── Stage body ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-[1.2fr_0.8fr]">
              {/* Left: wheel area */}
              <div
                className="flex flex-col items-center justify-center gap-5 px-10 py-8"
                style={{ background: "rgba(243,237,228,0.35)" }}
              >
                {phraseArea}
                <RouletteWheel
                  options={wheelOptions}
                  rotation={rotation}
                  isSpinning={spinPhase === "spinning"}
                  size={wheelSize}
                />
                <AnimatePresence>
                  {spinPhase !== "result" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <SpinButton
                        isSpinning={spinPhase === "spinning"}
                        onClick={handleSpin}
                        disabled={!canSpin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: mode panels + result */}
              <div className="flex flex-col gap-3 px-6 py-8 overflow-y-auto">
                {renderDesktopRightPanel()}
              </div>
            </div>
          </div>
        </div>

        <RouletteSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          roulettes={roulettes}
          activeRouletteId={activeRoulette.id}
          onSelect={handleSelectRoulette}
          onCreateNew={onCreateNew}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE layout
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] relative overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        {isDailyDestiny && <div className="flex justify-center mb-2">{dailyBadge}</div>}
        <button
          type="button"
          onClick={() => setSelectorOpen(true)}
          className="w-full flex items-center gap-2 mb-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-black text-[#1C1917] leading-tight flex-1 truncate text-left group-hover:text-[#E07B54] transition-colors">
            {activeRoulette.name}
          </h2>
          <ChevronDown size={18} className="text-[#A89880] shrink-0 group-hover:text-[#E07B54] transition-colors" />
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {personality && <Badge variant="primary">{personalityEmoji[personality.id]} {personality.name}</Badge>}
          <Badge variant="muted">{gameModeLabel[mode] ?? mode}</Badge>
          <Badge variant="secondary">{activeRoulette.options.length} opções</Badge>
        </div>
      </div>

      {/* Veto compact panel — shown before wheel */}
      {mode === "veto" && spinPhase !== "result" && (
        <div className="pt-1 pb-2">
          <VetoPanel
            options={activeRoulette.options}
            vetoedIds={vetoedIds}
            onToggleVeto={handleToggleVeto}
            layout="compact"
          />
        </div>
      )}

      {/* Wheel + phrase + button */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-5 pb-4">
        {phraseArea}
        <RouletteWheel
          options={wheelOptions}
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
              <SpinButton
                isSpinning={spinPhase === "spinning"}
                onClick={handleSpin}
                disabled={!canSpin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Best of 3 compact panel — shown below button when idle */}
      {mode === "best_of_3" && spinPhase !== "result" && bo3Session && (
        <div className="pb-3">
          <BestOfThreePanel session={bo3Session} layout="compact" />
        </div>
      )}

      {/* Elimination compact panel */}
      {mode === "elimination" && spinPhase !== "result" && (
        <div className="pb-3">
          <EliminationPanel
            options={activeRoulette.options}
            session={elimSession}
            layout="compact"
          />
        </div>
      )}

      {/* Result overlay */}
      <AnimatePresence>
        {spinPhase === "result" && currentResult && resultCardProps && (
          <SpinResultCard
            result={currentResult}
            onAccept={handleAccept}
            variant="overlay"
            {...resultCardProps}
          />
        )}
      </AnimatePresence>

      <RouletteSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        roulettes={roulettes}
        activeRouletteId={activeRoulette.id}
        onSelect={handleSelectRoulette}
        onCreateNew={onCreateNew}
      />
    </div>
  );
}
