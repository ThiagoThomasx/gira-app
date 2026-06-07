import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "accent" | "highlight" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#F3EDE4] text-[#1C1917]",
  primary: "bg-[#E07B54]/15 text-[#C96A43]",
  secondary: "bg-[#84A98C]/15 text-[#4A7A5B]",
  accent: "bg-[#9B59B6]/15 text-[#7D3F9E]",
  highlight: "bg-[#F4C430]/20 text-[#A07A00]",
  muted: "bg-[#E7DCCF] text-[#6B5E52]",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
