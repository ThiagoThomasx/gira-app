import { motion } from "framer-motion";
import { CheckCircle, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import type { SpinResult } from "../../types";

interface SpinResultCardProps {
  result: SpinResult;
  onAccept: () => void;
  /** When provided, shows a "Girar de novo" / secondary action button. */
  onSpinAgain?: () => void;
  /**
   * "overlay" (default) — slides up from the bottom, covers the wheel.
   * "inline" — normal block with x-slide, rendered inside a panel column.
   */
  variant?: "overlay" | "inline";
  /** Overrides the header label. Default: "O destino escolheu" */
  title?: string;
  /** Short label shown above the title (e.g. "Rodada 2 de 3"). */
  roundLabel?: string;
  /** Overrides the primary button text. Default: "Aceitar" */
  acceptLabel?: string;
  /** When true, adds a winner/final flourish to the card. */
  isFinalResult?: boolean;
  /** Secondary action label. Default: "Girar de novo". */
  spinAgainLabel?: string;
}

export function SpinResultCard({
  result,
  onAccept,
  onSpinAgain,
  variant = "overlay",
  title,
  roundLabel,
  acceptLabel = "Aceitar",
  isFinalResult = false,
  spinAgainLabel = "Girar de novo",
}: SpinResultCardProps) {
  const color = result.selectedOption.color ?? "#E07B54";
  const isOverlay = variant === "overlay";

  const headerLabel = title ?? (isFinalResult ? "Vencedor escolhido" : "O destino escolheu");

  return (
    <motion.div
      initial={isOverlay ? { opacity: 0, y: "100%" } : { opacity: 0, x: 24 }}
      animate={isOverlay ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
      exit={isOverlay ? { opacity: 0, y: "100%" } : { opacity: 0, x: 24 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={
        isOverlay
          ? "absolute inset-x-0 bottom-0 z-30 rounded-t-3xl overflow-hidden"
          : "rounded-2xl overflow-hidden"
      }
      style={{
        background: "white",
        boxShadow: isOverlay
          ? "0 -8px 40px rgba(28,25,23,0.18)"
          : "0 4px 24px rgba(28,25,23,0.10)",
        border: isOverlay ? undefined : "1px solid #E7DCCF",
      }}
    >
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />

      <div className={isOverlay ? "px-6 pt-5 pb-8" : "px-5 pt-4 pb-5"}>
        {/* Round label */}
        {roundLabel && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-[#A89880] mb-1"
          >
            {roundLabel}
          </motion.p>
        )}

        {/* Header */}
        <div className="flex items-center gap-1.5 mb-4">
          {isFinalResult
            ? <span className="text-sm">🏆</span>
            : <Sparkles size={14} className="text-[#F4C430]" />
          }
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A89880]">
            {headerLabel}
          </p>
        </div>

        {/* Main result */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-4 mb-4"
        >
          <div
            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-2xl"
            style={{ background: `${color}20`, border: `2.5px solid ${color}` }}
          >
            {isFinalResult ? "🏆" : "🎲"}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black leading-tight break-words" style={{ color: "#1C1917" }}>
              {result.selectedOption.label}
            </p>
          </div>
        </motion.div>

        {/* Personality phrase */}
        {result.phrase && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl px-3 py-2.5 mb-4"
            style={{ background: "#F3EDE4" }}
          >
            <p className="text-sm italic text-[#6B5E52] leading-relaxed">
              "{result.phrase}"
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm cursor-pointer"
            style={{
              background: isFinalResult
                ? `linear-gradient(135deg, #84A98C, #6B8F72)`
                : `linear-gradient(135deg, ${color}, ${color}cc)`,
              boxShadow: isFinalResult
                ? "0 4px 16px rgba(132,169,140,0.40)"
                : `0 4px 16px ${color}44`,
            }}
          >
            {isFinalResult ? <CheckCircle size={16} /> : <ChevronRight size={16} />}
            {acceptLabel}
          </motion.button>

          {onSpinAgain && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSpinAgain}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[#1C1917] text-sm cursor-pointer"
              style={{ background: "#F3EDE4", border: "1.5px solid #E7DCCF" }}
            >
              <RefreshCw size={16} />
              {spinAgainLabel}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
