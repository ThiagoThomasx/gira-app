import { motion } from "framer-motion";
import type { BestOfThreeSession } from "../../types";

interface BestOfThreePanelProps {
  session: BestOfThreeSession | null;
  layout?: "compact" | "card";
}

const TOTAL_ROUNDS = 3;

export function BestOfThreePanel({ session, layout = "card" }: BestOfThreePanelProps) {
  const rounds = session?.rounds ?? [];
  const nextRound = rounds.length + 1;
  const isComplete = session?.isComplete ?? false;

  if (layout === "compact") {
    return (
      <div className="w-full px-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89880]">
            Melhor de 3
          </p>
          {!isComplete && (
            <span className="text-[10px] font-semibold text-[#E07B54]">
              {rounds.length < TOTAL_ROUNDS
                ? `Rodada ${nextRound} de ${TOTAL_ROUNDS}`
                : "Calculando..."}
            </span>
          )}
        </div>

        {/* Round dots */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
            const round = rounds[i];
            return (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: round ? round.selectedOption.color : "#E7DCCF",
                    border: round ? "none" : "1.5px solid #C0B4A8",
                  }}
                />
                <span className="text-xs truncate" style={{ color: round ? "#1C1917" : "#C0B4A8" }}>
                  {round ? round.selectedOption.label : `R${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Card layout (desktop) ─────────────────────────────────────────────────

  // Build score map
  const scoreMap = new Map<string, { label: string; color: string; count: number }>();
  for (const { selectedOption } of rounds) {
    const entry = scoreMap.get(selectedOption.id);
    if (entry) {
      entry.count++;
    } else {
      scoreMap.set(selectedOption.id, {
        label: selectedOption.label,
        color: selectedOption.color,
        count: 1,
      });
    }
  }
  const scores = [...scoreMap.values()].sort((a, b) => b.count - a.count);

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "white", border: "1px solid #E7DCCF" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest">
          Melhor de 3
        </p>
        <span className="text-[10px] font-semibold text-[#E07B54]">
          {isComplete ? "Concluído" : `Rodada ${Math.min(nextRound, TOTAL_ROUNDS)} de ${TOTAL_ROUNDS}`}
        </span>
      </div>

      {/* Round timeline */}
      <div className="flex flex-col gap-2 mb-3">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
          const round = rounds[i];
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-[#A89880] font-semibold w-14 shrink-0">
                Rodada {i + 1}
              </span>
              {round ? (
                <motion.div
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 flex-1"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: round.selectedOption.color }}
                  />
                  <span className="text-xs font-semibold text-[#1C1917] truncate">
                    {round.selectedOption.label}
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-2 h-2 rounded-full border border-dashed border-[#C0B4A8]" />
                  <span className="text-xs text-[#C0B4A8]">aguardando...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score if there are multiple options */}
      {scores.length > 1 && (
        <div style={{ borderTop: "1px solid #F3EDE4", paddingTop: 10 }}>
          <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest mb-2">
            Placar parcial
          </p>
          <div className="flex flex-col gap-1.5">
            {scores.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-[#1C1917] flex-1 truncate">{s.label}</span>
                <div className="flex gap-1 shrink-0">
                  {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{ background: i < s.count ? s.color : "#E7DCCF" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
