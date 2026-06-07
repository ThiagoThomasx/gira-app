import { motion } from "framer-motion";
import type { GameMode } from "../../types";

interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  emoji: string;
}

const MODES: GameModeInfo[] = [
  {
    id: "classic",
    name: "Clássico",
    description: "Gira uma vez e aceita o destino.",
    emoji: "🎯",
  },
  {
    id: "best_of_3",
    name: "Melhor de 3",
    description: "Três rodadas. Quem vencer mais, leva.",
    emoji: "🏆",
  },
  {
    id: "veto",
    name: "Veto",
    description: "Remova opções antes do destino agir.",
    emoji: "🚫",
  },
  {
    id: "elimination",
    name: "Eliminação",
    description: "A cada giro, uma opção cai fora até sobrar a campeã.",
    emoji: "⚡",
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
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(mode.id)}
            className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all w-full cursor-pointer"
            style={{
              backgroundColor: selected ? "rgba(224,123,84,0.06)" : "white",
              borderColor: selected ? "#E07B54" : "#E7DCCF",
              boxShadow: selected ? "0 0 0 1.5px #E07B54" : undefined,
            }}
            aria-pressed={selected}
          >
            <span className="text-xl leading-none shrink-0">{mode.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold"
                style={{ color: selected ? "#E07B54" : "#1C1917" }}
              >
                {mode.name}
              </p>
              <p className="text-xs text-[#6B5E52] mt-0.5">{mode.description}</p>
            </div>
            {selected && (
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
  );
}
