import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { DecorativeBackground } from "./DecorativeBackground";
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
 *
 * Layering:
 *   DecorativeBackground — fixed, z-index -1 (gutter ambience, desktop only)
 *   App card             — relative, z-index 0 (sits above background)
 */
export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  return (
    <>
      {/* Decorative gutter ambience — hidden on mobile, subtle on desktop */}
      <DecorativeBackground />

      {/* App card — centered column, sits above the decorative layer */}
      <div
        className={[
          // Centering & sizing
          "relative z-0 w-full h-svh mx-auto flex flex-col",
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
    </>
  );
}
