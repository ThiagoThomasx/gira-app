import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className = "" }: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between px-4 pt-6 pb-2 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917] leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B5E52] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}
