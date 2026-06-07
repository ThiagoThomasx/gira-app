import { motion } from "framer-motion";
import { CheckCircle, RefreshCw, Sparkles } from "lucide-react";
import type { SpinResult } from "../../types";

interface SpinResultCardProps {
  result: SpinResult;
  onAccept: () => void;
  onSpinAgain: () => void;
}

export function SpinResultCard({ result, onAccept, onSpinAgain }: SpinResultCardProps) {
  const color = result.selectedOption.color ?? "#E07B54";

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl overflow-hidden"
      style={{
        background: "white",
        boxShadow: "0 -8px 40px rgba(28,25,23,0.18)",
      }}
    >
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />

      <div className="px-6 pt-5 pb-8">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-5">
          <Sparkles size={14} className="text-[#F4C430]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A89880]">
            O destino escolheu
          </p>
        </div>

        {/* Main result */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-4 mb-5"
        >
          {/* Color badge */}
          <div
            className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-2xl"
            style={{
              background: `${color}20`,
              border: `2.5px solid ${color}`,
            }}
          >
            🎲
          </div>
          <div className="min-w-0">
            <p
              className="text-2xl font-black leading-tight break-words"
              style={{ color: "#1C1917" }}
            >
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
            className="rounded-xl px-4 py-3 mb-6"
            style={{ background: "#F3EDE4" }}
          >
            <p className="text-sm italic text-[#6B5E52] leading-relaxed">
              "{result.phrase}"
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-base cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              boxShadow: `0 4px 16px ${color}44`,
            }}
          >
            <CheckCircle size={18} />
            Aceitar
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSpinAgain}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[#1C1917] text-base cursor-pointer"
            style={{
              background: "#F3EDE4",
              border: "1.5px solid #E7DCCF",
            }}
          >
            <RefreshCw size={16} />
            Girar de novo
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
