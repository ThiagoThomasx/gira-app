import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  padding = "md",
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: "0 8px 24px rgba(28,25,23,0.10)" } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={[
        "bg-white rounded-2xl border border-[#E7DCCF]",
        "shadow-[0_2px_8px_rgba(28,25,23,0.06)]",
        paddingStyles[padding],
        hoverable || onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </motion.div>
  );
}
