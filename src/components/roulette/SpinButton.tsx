import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface SpinButtonProps {
  isSpinning: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SpinButton({ isSpinning, onClick, disabled = false }: SpinButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isSpinning}
      whileTap={!isSpinning ? { scale: 0.93 } : undefined}
      whileHover={!isSpinning ? { scale: 1.04 } : undefined}
      className="relative overflow-hidden rounded-2xl cursor-pointer disabled:cursor-not-allowed"
      style={{
        background: isSpinning
          ? "linear-gradient(135deg, #C96A43, #A85535)"
          : "linear-gradient(135deg, #E07B54, #C96A43)",
        padding: "16px 40px",
        boxShadow: isSpinning
          ? "0 4px 20px rgba(224,123,84,0.25)"
          : "0 6px 24px rgba(224,123,84,0.45)",
      }}
      aria-label={isSpinning ? "Girando..." : "Girar a roleta"}
    >
      {/* Shimmer effect when idle */}
      {!isSpinning && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
        />
      )}

      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={18} className="text-white" fill="white" />
            </motion.div>
            <span className="text-white font-bold text-base leading-none">
              O destino está trabalhando...
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <Zap size={20} className="text-white" fill="white" />
            <span className="text-white font-bold text-lg leading-none">
              Girar
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
