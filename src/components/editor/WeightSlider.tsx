import { motion } from "framer-motion";

interface WeightSliderProps {
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

const WEIGHTS = [1, 2, 3, 4, 5];

export function WeightSlider({ value, onChange, color = "#E07B54" }: WeightSliderProps) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Peso: ${value}`}>
      {WEIGHTS.map((w) => {
        const active = w <= value;
        return (
          <motion.button
            key={w}
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => onChange(w)}
            aria-label={`Peso ${w}`}
            aria-pressed={active}
            className="rounded-full cursor-pointer transition-all duration-150 focus:outline-none"
            style={{
              width: 20,
              height: 20,
              background: active ? color : "#E7DCCF",
              border: `2px solid ${active ? color : "#D4C8BC"}`,
              flexShrink: 0,
            }}
          />
        );
      })}
      <span className="text-xs font-semibold text-[#A89880] ml-1 w-4 text-center tabular-nums">
        {value}
      </span>
    </div>
  );
}
