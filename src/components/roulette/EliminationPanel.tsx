import { motion, AnimatePresence } from "framer-motion";
import type { RouletteOption, EliminationSession } from "../../types";
import { getRemainingEliminationOptions } from "../../utils/gameModes";

interface EliminationPanelProps {
  options: RouletteOption[];
  session: EliminationSession | null;
  layout?: "compact" | "card";
}

export function EliminationPanel({
  options,
  session,
  layout = "card",
}: EliminationPanelProps) {
  const emptySession = { eliminatedIds: [], winner: null, isComplete: false };
  const activeSession = session ?? emptySession;
  const remaining = getRemainingEliminationOptions(options, activeSession);
  const eliminatedIds = activeSession.eliminatedIds;
  const eliminated = options.filter((o) => eliminatedIds.includes(o.id));
  const isComplete = remaining.length === 1;

  if (layout === "compact") {
    return (
      <div className="w-full px-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89880]">
            Eliminação
          </p>
          <span className="text-[10px] font-semibold text-[#E07B54]">
            {isComplete
              ? "Sobrevivente encontrado!"
              : `${remaining.length} restante${remaining.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Option chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {options.map((opt) => {
            const isElim = eliminatedIds.includes(opt.id);
            return (
              <div
                key={opt.id}
                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-semibold"
                style={{
                  background: isElim ? "#1C191708" : `${opt.color}18`,
                  border: isElim ? "1.5px dashed #C0B4A840" : `1.5px solid ${opt.color}44`,
                  color: isElim ? "#A89880" : "#1C1917",
                  textDecoration: isElim ? "line-through" : "none",
                  opacity: isElim ? 0.5 : 1,
                }}
              >
                {isElim ? "💨" : "●"} {opt.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Card layout (desktop) ─────────────────────────────────────────────────

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "white", border: "1px solid #E7DCCF" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest">
          Eliminação
        </p>
        <span className="text-[10px] font-semibold text-[#E07B54]">
          {isComplete
            ? "Sobrevivente! 🏆"
            : `${remaining.length} de ${options.length} na arena`}
        </span>
      </div>

      {/* Remaining */}
      {remaining.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-[#84A98C] font-bold uppercase tracking-widest mb-1.5">
            Na arena
          </p>
          <div className="flex flex-col gap-1.5">
            <AnimatePresence>
              {remaining.map((opt) => (
                <motion.div
                  key={opt.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: opt.color }}
                  />
                  <span className="text-sm font-semibold text-[#1C1917] truncate">
                    {opt.label}
                  </span>
                  {isComplete && <span className="text-sm ml-auto">👑</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Eliminated */}
      {eliminated.length > 0 && (
        <div style={{ borderTop: "1px solid #F3EDE4", paddingTop: 10 }}>
          <p className="text-[10px] text-[#C96A43] font-bold uppercase tracking-widest mb-1.5">
            Eliminadas 💨
          </p>
          <div className="flex flex-col gap-1">
            {eliminated.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2 opacity-50">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: opt.color, filter: "grayscale(1)" }}
                />
                <span className="text-xs text-[#A89880] truncate line-through">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
