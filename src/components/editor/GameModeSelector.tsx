import { motion } from "framer-motion";
import type { GameMode } from "../../types";

interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  emoji: string;
  available: boolean;
}

const MODES: GameModeInfo[] = [
  {
    id: "classic",
    name: "Clássico",
    description: "Um giro, um destino. Simples, direto, sem drama.",
    emoji: "🎯",
    available: true,
  },
  {
    id: "best_of_3",
    name: "Melhor de 3",
    description: "Gira 3 vezes. A opção que aparecer mais vence.",
    emoji: "🏆",
    available: false,
  },
  {
    id: "veto",
    name: "Veto",
    description: "Elimine opções indesejadas antes de girar.",
    emoji: "🚫",
    available: false,
  },
  {
    id: "elimination",
    name: "Eliminação",
    description: "Cada opção sorteada sai da roleta. Até restar uma.",
    emoji: "⚡",
    available: false,
  },
];

interface GameModeSelectorProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export function GameModeSelector({ value, onChange }: GameModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {MODES.map((mode) => {
        const selected = mode.id === value;
        return (
          <motion.button
            key={mode.id}
            type="button"
            whileTap={mode.available ? { scale: 0.98 } : undefined}
            onClick={() => mode.available && onChange(mode.id)}
            disabled={!mode.available}
            className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all w-full cursor-pointer disabled:cursor-default"
            style={{
              backgroundColor: selected ? "rgba(224,123,84,0.06)" : "white",
              borderColor: selected ? "#E07B54" : "#E7DCCF",
              boxShadow: selected ? "0 0 0 1.5px #E07B54" : undefined,
              opacity: !mode.available && !selected ? 0.55 : 1,
            }}
            aria-pressed={selected}
          >
            <span className="text-xl leading-none shrink-0">{mode.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p
                  className="text-sm font-bold"
                  style={{ color: selected ? "#E07B54" : "#1C1917" }}
                >
                  {mode.name}
                </p>
                {!mode.available && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#F3EDE4] text-[#A89880]">
                    Em breve
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B5E52] mt-0.5">{mode.description}</p>
            </div>
            {selected && (
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#E07B54" }}
              >
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
