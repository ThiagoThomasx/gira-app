import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { personalities } from "../data/personalities";

const personalityEmoji: Record<string, string> = {
  dramatic: "🎭",
  snarky: "😏",
  cute: "🌸",
  honest: "🎯",
  villain: "😈",
  advisor: "🧘",
  chaotic: "🌀",
  professional: "💼",
};

export function SettingsPage() {
  const { preferences, updatePreferences, roulettes, history, clearHistory } =
    useAppStore();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClearHistory() {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  }

  return (
    <div className="px-4 pb-6">
      <PageHeader title="Configurações" />

      <div className="flex flex-col gap-5">

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-[#E07B54]">{roulettes.length}</p>
            <p className="text-xs text-[#6B5E52] mt-0.5">Roletas criadas</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-[#84A98C]">{history.length}</p>
            <p className="text-xs text-[#6B5E52] mt-0.5">Giros realizados</p>
          </Card>
        </div>

        {/* ── Default personality ───────────────────────────────────────────── */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider">
              Personalidade padrão
            </p>
            <p className="text-[11px] text-[#C0B4A8] mt-0.5">
              Usada ao criar novas roletas.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {personalities.map((p) => {
              const isSelected = preferences.defaultPersonality === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updatePreferences({ defaultPersonality: p.id })}
                  className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer w-full"
                  style={{
                    borderColor: isSelected ? "#E07B54" : "#E7DCCF",
                    background: isSelected ? "rgba(224,123,84,0.05)" : "white",
                    boxShadow: isSelected ? "0 0 0 1.5px #E07B54" : undefined,
                  }}
                >
                  <span className="text-2xl leading-none shrink-0">
                    {personalityEmoji[p.id]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold leading-tight"
                      style={{ color: isSelected ? "#E07B54" : "#1C1917" }}
                    >
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#A89880] mt-0.5 truncate">
                      {p.tone}
                    </p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#E07B54" }}
                    >
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 3L3 5L7 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Preferências ──────────────────────────────────────────────────── */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider">
              Preferências
            </p>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "#E7DCCF", background: "white" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">Sons da roleta</p>
                <p className="text-xs text-[#A89880] mt-0.5">
                  Tiques e ding ao girar.
                </p>
              </div>
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={preferences.soundEnabled ?? true}
                onClick={() =>
                  updatePreferences({ soundEnabled: !(preferences.soundEnabled ?? true) })
                }
                className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B54] focus-visible:ring-offset-2"
                style={{
                  background:
                    (preferences.soundEnabled ?? true) ? "#E07B54" : "#D4C9BC",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{
                    transform:
                      (preferences.soundEnabled ?? true)
                        ? "translateX(20px)"
                        : "translateX(0)",
                  }}
                />
                <span className="sr-only">
                  {(preferences.soundEnabled ?? true) ? "Desativar sons" : "Ativar sons"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Danger zone ───────────────────────────────────────────────────── */}
        <div>
          <div className="mb-2 px-1 flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-[#A89880]" />
            <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider">
              Dados
            </p>
          </div>
          <div
            className="rounded-2xl border p-4 flex flex-col gap-3"
            style={{ borderColor: "#E7DCCF", background: "white" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">
                  Limpar histórico
                </p>
                <p className="text-xs text-[#A89880] mt-0.5">
                  Remove todos os {history.length} giro{history.length !== 1 ? "s" : ""} registrado{history.length !== 1 ? "s" : ""}.
                </p>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleClearHistory}
                disabled={history.length === 0}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={
                  confirmClear
                    ? {
                        background: "rgba(239,68,68,0.10)",
                        color: "#EF4444",
                        border: "1.5px solid rgba(239,68,68,0.35)",
                      }
                    : {
                        background: "white",
                        color: "#A89880",
                        border: "1.5px solid #E7DCCF",
                      }
                }
              >
                {confirmClear ? "Confirmar?" : "Limpar"}
              </motion.button>
            </div>

            <AnimatePresence>
              {confirmClear && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#EF4444]"
                >
                  Isso não pode ser desfeito.{" "}
                  <button
                    type="button"
                    className="underline cursor-pointer"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancelar
                  </button>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── About ─────────────────────────────────────────────────────────── */}
        <Card padding="md" className="bg-[#F3EDE4] border-none">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <p className="font-bold text-[#1C1917]">Gira.app</p>
            </div>
            <Badge variant="muted">v0.1.0</Badge>
          </div>
          <p className="text-xs text-[#6B5E52] leading-relaxed">
            Sua roleta de decisão com personalidade. Porque decidir sozinha é
            sobrevaliado — deixa o universo fazer isso por você.
          </p>
          <p className="text-[10px] text-[#A89880] mt-2">Em desenvolvimento ✨</p>
        </Card>

      </div>
    </div>
  );
}
