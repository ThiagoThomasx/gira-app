import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import type { Tab } from "./BottomNavigation";

interface AppLayoutProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}

/**
 * App shell — inner-scroll pattern.
 *
 * The shell itself takes the full viewport height (h-svh) and is centered
 * on large screens. The <main> grows to fill remaining space and scrolls
 * independently. The BottomNavigation sits at the bottom of the flex column
 * (no fixed/absolute positioning needed), so it is naturally contained within
 * the app shell on desktop.
 *
 * Breakpoints:
 *   mobile  (<768px)  : full width, single column
 *   tablet  (768px+)  : max-w-2xl  (672px)  centered
 *   desktop (1024px+) : max-w-5xl  (1024px) centered, with subtle shadow
 */
export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  return (
    <div
      className={[
        // Centering & sizing
        "w-full h-svh mx-auto flex flex-col",
        "md:max-w-2xl lg:max-w-5xl",
        // Visual framing on desktop
        "bg-[#FFF8F0]",
        "lg:shadow-[0_0_0_1px_#E7DCCF,0_8px_48px_rgba(28,25,23,0.12)]",
      ].join(" ")}
    >
      {/* Scrollable content — fills remaining height */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>

      {/* Nav stays at the bottom of the flex column — no fixed positioning */}
      <BottomNavigation active={activeTab} onChange={onTabChange} />
    </div>
  );
}
