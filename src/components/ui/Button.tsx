import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#E07B54] text-white shadow-sm hover:bg-[#C96A43] active:scale-95",
  secondary:
    "bg-[#84A98C] text-white shadow-sm hover:bg-[#6B9474] active:scale-95",
  ghost:
    "bg-transparent text-[#1C1917] border border-[#E7DCCF] hover:bg-[#F3EDE4] active:scale-95",
  danger:
    "bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-95",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3.5 text-lg rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "font-semibold transition-all duration-150 cursor-pointer select-none",
        "flex items-center justify-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </motion.button>
  );
}
