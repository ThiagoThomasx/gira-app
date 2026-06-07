import { motion } from "framer-motion";
import { personalities } from "../../data/personalities";
import type { PersonalityId } from "../../types";

const personalityEmoji: Record<PersonalityId, string> = {
  dramatic: "🎭",
  snarky: "😏",
  cute: "🌸",
  honest: "🎯",
  villain: "😈",
  advisor: "🧘",
  chaotic: "🌀",
  professional: "💼",
};

interface PersonalitySelectorProps {
  value: PersonalityId;
  onChange: (id: PersonalityId) => void;
}

export function PersonalitySelector({ value, onChange }: PersonalitySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {personalities.map((p) => {
        const selected = p.id === value;
        return (
          <motion.button
            key={p.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(p.id)}
            className="flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer"
            style={{
              background: selected ? "#E07B54/5" : "white",
              backgroundColor: selected ? "rgba(224,123,84,0.06)" : "white",
              borderColor: selected ? "#E07B54" : "#E7DCCF",
              boxShadow: selected ? "0 0 0 1.5px #E07B54" : undefined,
            }}
            aria-pressed={selected}
          >
            <span className="text-xl leading-none mt-0.5 shrink-0">
              {personalityEmoji[p.id]}
            </span>
            <div className="min-w-0">
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: selected ? "#E07B54" : "#1C1917" }}
              >
                {p.name}
              </p>
              <p className="text-[10px] text-[#6B5E52] leading-snug mt-0.5 line-clamp-2">
                {p.tone}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
