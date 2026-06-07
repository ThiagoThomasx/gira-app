import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import type { Tab } from "./BottomNavigation";

interface AppLayoutProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}

export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  return (
    <div className="min-h-svh bg-[#FFF8F0] flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>
      <BottomNavigation active={activeTab} onChange={onTabChange} />
    </div>
  );
}
