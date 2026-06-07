import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Plus } from "lucide-react";
import type { Roulette } from "../../types";

const personalityEmoji: Record<string, string> = {
  dramatic: "🎭", snarky: "😏", cute: "🌸", honest: "🎯",
  villain: "😈", advisor: "🧘", chaotic: "🌀", professional: "💼",
};

const gameModeLabel: Record<string, string> = {
  classic: "Clássico", best_of_3: "Melhor de 3",
  veto: "Veto", elimination: "Eliminação",
};

interface RouletteSelectorProps {
  open: boolean;
  onClose: () => void;
  roulettes: Roulette[];
  activeRouletteId?: string;
  onSelect: (rouletteId: string) => void;
  onCreateNew: () => void;
}

export function RouletteSelector({
  open,
  onClose,
  roulettes,
  activeRouletteId,
  onSelect,
  onCreateNew,
}: RouletteSelectorProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50"
          >
            {/* Max-width container — centered on desktop */}
            <div
              className="mx-auto rounded-t-3xl overflow-hidden"
              style={{
                maxWidth: 560,
                background: "white",
                boxShadow: "0 -8px 48px rgba(28,25,23,0.18)",
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#E7DCCF]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-3">
                <div>
                  <h3 className="text-lg font-black text-[#1C1917]">Trocar roleta</h3>
                  <p className="text-xs text-[#A89880]">
                    {roulettes.length > 0
                      ? `${roulettes.length} roleta${roulettes.length > 1 ? "s" : ""} disponível`
                      : "Nenhuma roleta criada ainda"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F3EDE4] cursor-pointer"
                >
                  <X size={16} className="text-[#6B5E52]" />
                </button>
              </div>

              {/* List */}
              <div
                className="overflow-y-auto px-3 pb-2"
                style={{ maxHeight: "min(58vh, 440px)" }}
              >
                {roulettes.length === 0 ? (
                  <div className="flex flex-col items-center py-10 px-4 text-center gap-2">
                    <span className="text-4xl">🎲</span>
                    <p className="font-bold text-[#1C1917]">Nenhuma roleta ainda</p>
                    <p className="text-sm text-[#A89880]">
                      Crie sua primeira roleta e volte aqui para girar.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {roulettes.map((r) => {
                      const isActive = r.id === activeRouletteId;
                      const iconColor = r.options[0]?.color ?? "#E07B54";
                      return (
                        <motion.button
                          key={r.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { onSelect(r.id); onClose(); }}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors cursor-pointer"
                          style={{
                            background: isActive ? "#FFF0E8" : "transparent",
                            border: isActive ? "1.5px solid #E07B54" : "1.5px solid transparent",
                          }}
                        >
                          {/* Icon */}
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: `${iconColor}22` }}
                          >
                            {personalityEmoji[r.personalityId] ?? "🎲"}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate leading-tight ${isActive ? "text-[#E07B54]" : "text-[#1C1917]"}`}>
                              {r.name}
                            </p>
                            {r.description ? (
                              <p className="text-xs text-[#6B5E52] truncate mt-0.5">
                                {r.description}
                              </p>
                            ) : (
                              <p className="text-xs text-[#A89880] mt-0.5">
                                {r.options.length} opções
                                {" · "}
                                {personalityEmoji[r.personalityId]}{" "}
                                {gameModeLabel[r.gameMode] ?? r.gameMode}
                              </p>
                            )}
                          </div>

                          {/* Active check */}
                          {isActive ? (
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "#E07B54" }}
                            >
                              <Check size={14} className="text-white" strokeWidth={2.5} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-[#E7DCCF] shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer: criar nova roleta */}
              <div
                className="px-4 py-3 mt-1"
                style={{ borderTop: "1px solid #F3EDE4" }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onCreateNew(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                  style={{ background: "#F3EDE4", color: "#6B5E52", border: "1.5px dashed #D4C4B5" }}
                >
                  <Plus size={16} />
                  Criar nova roleta
                </motion.button>
              </div>

              {/* Safe-area iOS */}
              <div style={{ height: "env(safe-area-inset-bottom, 8px)" }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
