import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/layout/PageHeader";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { personalityEmoji } from "../data/personalityMeta";

// ─── constants ────────────────────────────────────────────────────────────────

const gameModeLabel: Record<string, string> = {
  classic: "Clássico",
  best_of_3: "Melhor de 3",
  veto: "Veto",
  elimination: "Eliminação",
};

function formatSpunAt(spunAt: string | number): string {
  const d = new Date(spunAt);
  const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dateStr} · ${timeStr}`;
}

// ─── props ────────────────────────────────────────────────────────────────────

interface HistoryPageProps {
  onGoSpin?: () => void;
}

// ─── component ───────────────────────────────────────────────────────────────

export function HistoryPage({ onGoSpin }: HistoryPageProps) {
  const { history, clearHistory } = useAppStore();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  }

  return (
    <div className="px-4 pb-6">
      <PageHeader
        title="Histórico"
        subtitle={
          history.length > 0
            ? `${history.length} giro${history.length !== 1 ? "s" : ""} registrado${history.length !== 1 ? "s" : ""}`
            : undefined
        }
        action={
          history.length > 0 ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={
                confirmClear
                  ? {
                      background: "rgba(239,68,68,0.08)",
                      color: "#EF4444",
                      border: "1.5px solid rgba(239,68,68,0.30)",
                    }
                  : {
                      background: "white",
                      color: "#A89880",
                      border: "1.5px solid #E7DCCF",
                    }
              }
            >
              <Trash2 size={12} />
              {confirmClear ? "Confirmar limpeza" : "Limpar"}
            </motion.button>
          ) : undefined
        }
      />

      {confirmClear && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[#EF4444] text-right mb-3 -mt-1"
        >
          Clique novamente para confirmar.{" "}
          <button
            type="button"
            className="underline cursor-pointer"
            onClick={() => setConfirmClear(false)}
          >
            Cancelar
          </button>
        </motion.p>
      )}

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock size={40} className="text-[#A89880]" />}
          title="O universo ainda não foi consultado"
          description="Gire uma roleta e suas decisões épicas vão aparecer aqui."
          action={
            onGoSpin ? (
              <button
                type="button"
                onClick={onGoSpin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #E07B54, #C96A43)",
                  boxShadow: "0 4px 12px rgba(224,123,84,0.35)",
                }}
              >
                🎰 Ir girar agora
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <AnimatePresence>
            {history.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-[#E7DCCF] shadow-sm overflow-hidden"
                style={{
                  borderLeftColor: result.selectedOption.color,
                  borderLeftWidth: 3,
                }}
              >
                <div className="p-3 flex items-center gap-3">
                  {/* Personality icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${result.selectedOption.color}18` }}
                  >
                    {personalityEmoji[result.personalityId] ?? "🎲"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1C1917] truncate leading-tight">
                      {result.selectedOption.label}
                    </p>
                    <p className="text-xs text-[#A89880] truncate mt-0.5">
                      {result.rouletteName}
                    </p>
                  </div>

                  {/* Right meta */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-[#A89880]">
                      {formatSpunAt(result.spunAt)}
                    </span>
                    {result.gameMode !== "classic" && (
                      <Badge variant="muted" className="text-[10px]">
                        {gameModeLabel[result.gameMode] ?? result.gameMode}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
