import { motion, AnimatePresence } from "framer-motion";
import { ShieldOff, RotateCcw } from "lucide-react";
import type { RouletteOption } from "../../types";
import { getVetoAvailableOptions, canSpinWithVeto } from "../../utils/gameModes";

interface VetoPanelProps {
  options: RouletteOption[];
  vetoedIds: string[];
  onToggleVeto: (optionId: string) => void;
  /** "compact" = mobile chip row; "card" = desktop card panel */
  layout?: "compact" | "card";
}

export function VetoPanel({
  options,
  vetoedIds,
  onToggleVeto,
  layout = "card",
}: VetoPanelProps) {
  const available = getVetoAvailableOptions(options, vetoedIds).length;
  const spinnable = canSpinWithVeto(options, vetoedIds);

  if (layout === "compact") {
    return (
      <div className="w-full px-4 pb-1">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89880]">
            Sabote o destino
          </p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: spinnable ? "#84A98C22" : "#E07B5422",
              color: spinnable ? "#4A7A55" : "#C96A43",
            }}
          >
            {available} de {options.length} disponível{available !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Horizontal scrollable chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {options.map((opt) => {
            const isVetoed = vetoedIds.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => onToggleVeto(opt.id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                style={{
                  background: isVetoed ? "#1C191710" : `${opt.color}18`,
                  border: isVetoed
                    ? "1.5px solid #1C191730"
                    : `1.5px solid ${opt.color}55`,
                  color: isVetoed ? "#A89880" : "#1C1917",
                  textDecoration: isVetoed ? "line-through" : "none",
                  opacity: isVetoed ? 0.6 : 1,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isVetoed ? "#A89880" : opt.color }}
                />
                {opt.label}
                <span className="text-[10px] opacity-70 ml-0.5">
                  {isVetoed ? "+" : "×"}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Warning */}
        <AnimatePresence>
          {!spinnable && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="text-[11px] text-[#C96A43] font-medium mt-2 text-center"
            >
              Libere pelo menos 2 opções para girar
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Card layout (desktop right panel) ──────────────────────────────────────

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "white", border: "1px solid #E7DCCF" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold text-[#A89880] uppercase tracking-widest">
            Sabote o destino
          </p>
          <p className="text-xs text-[#6B5E52] mt-0.5">
            Antes de girar, vete algumas opções.
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
          style={{
            background: spinnable ? "#84A98C22" : "#E07B5422",
            color: spinnable ? "#4A7A55" : "#C96A43",
          }}
        >
          {available}/{options.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const isVetoed = vetoedIds.includes(opt.id);
          return (
            <div
              key={opt.id}
              className="flex items-center gap-2.5"
              style={{ opacity: isVetoed ? 0.55 : 1 }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: isVetoed ? "#C0B4A8" : opt.color }}
              />
              <span
                className="text-sm flex-1 truncate"
                style={{
                  color: "#1C1917",
                  textDecoration: isVetoed ? "line-through" : "none",
                }}
              >
                {opt.label}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleVeto(opt.id)}
                className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                style={{
                  background: isVetoed ? "#F3EDE4" : "#FFE8E0",
                  color: isVetoed ? "#84A98C" : "#C96A43",
                  border: isVetoed ? "1px solid #D4C4B5" : "1px solid #E07B5444",
                }}
              >
                {isVetoed
                  ? <><RotateCcw size={10} /> Retomar</>
                  : <><ShieldOff size={10} /> Vetar</>
                }
              </motion.button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {!spinnable && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-[#C96A43] font-medium mt-3 pt-3"
            style={{ borderTop: "1px solid #F3EDE4" }}
          >
            ⚠️ Libere pelo menos 2 opções para girar.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
