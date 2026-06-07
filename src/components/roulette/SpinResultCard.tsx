import { motion } from "framer-motion";
import { CheckCircle, RefreshCw } from "lucide-react";
import type { SpinResult } from "../../types";

interface SpinResultCardProps {
  result: SpinResult;
  onAccept: () => void;
  /** When provided, shows a "Girar de novo" secondary action button. */
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

// Derive a 1–2 char initial from an option label for the medallion
function getInitial(label: string): string {
  const words = label.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return label.slice(0, 2).toUpperCase();
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
  const initial = getInitial(result.selectedOption.label);

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
      {/* ── Tinted header band ──────────────────────────────────────────────── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ background: `${color}12` }}
      >
        {/* Round label */}
        {roundLabel && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: `${color}BB` }}
          >
            {roundLabel}
          </motion.p>
        )}

        {/* Header row: medallion + label + subtitle */}
        <div className="flex items-center gap-4">
          {/* Colour medallion — replaces generic 🎲 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
            className="shrink-0 flex items-center justify-center rounded-2xl font-black text-white select-none"
            style={{
              width: 52,
              height: 52,
              background: isFinalResult
                ? `linear-gradient(135deg, #F4C430, #E0A800)`
                : `linear-gradient(135deg, ${color}, ${color}CC)`,
              boxShadow: `0 4px 16px ${color}44`,
              fontSize: initial.length === 1 ? 22 : 16,
              letterSpacing: "-0.02em",
            }}
          >
            {isFinalResult ? "🏆" : initial}
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* "O destino escolheu" subtitle */}
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: `${color}99` }}
            >
              {headerLabel}
            </p>

            {/* Main result — big, bold, coloured */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ease: "easeOut" }}
              className="font-black leading-tight break-words"
              style={{
                color: "#1C1917",
                fontSize: result.selectedOption.label.length > 22 ? "1.1rem" : "1.35rem",
              }}
            >
              {result.selectedOption.label}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className={isOverlay ? "px-5 pt-3 pb-8" : "px-5 pt-3 pb-5"}>
        {/* Personality phrase */}
        {result.phrase && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="rounded-xl px-3 py-2.5 mb-4"
            style={{
              background: "#F3EDE4",
              borderLeft: `3px solid ${color}55`,
            }}
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
            transition={{ delay: 0.38 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm cursor-pointer"
            style={{
              background: isFinalResult
                ? "linear-gradient(135deg, #84A98C, #6B8F72)"
                : `linear-gradient(135deg, ${color}, ${color}CC)`,
              boxShadow: isFinalResult
                ? "0 4px 16px rgba(132,169,140,0.40)"
                : `0 4px 16px ${color}44`,
            }}
          >
            {isFinalResult && <CheckCircle size={16} />}
            {acceptLabel}
          </motion.button>

          {onSpinAgain && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSpinAgain}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[#1C1917] text-sm cursor-pointer"
              style={{ background: "#F3EDE4", border: "1.5px solid #E7DCCF" }}
            >
              <RefreshCw size={15} />
              {spinAgainLabel}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
