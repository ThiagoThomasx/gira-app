import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#1C1917] mb-2">{title}</h3>
      <p className="text-sm text-[#6B5E52] mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
