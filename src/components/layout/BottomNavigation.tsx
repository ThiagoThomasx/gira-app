import { Home, LayoutGrid, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";

export type Tab = "home" | "explore" | "spin" | "history" | "settings";

interface BottomNavigationProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const LEFT_TABS = [
  { id: "home" as Tab, label: "Início", Icon: Home },
  { id: "explore" as Tab, label: "Explorar", Icon: LayoutGrid },
];
const RIGHT_TABS = [
  { id: "history" as Tab, label: "Histórico", Icon: Clock },
  { id: "settings" as Tab, label: "Config", Icon: Settings },
];

function NavTab({
  id, label, Icon, active, onChange,
}: {
  id: Tab; label: string; Icon: typeof Home;
  active: boolean; onChange: (t: Tab) => void;
}) {
  return (
    <button
      onClick={() => onChange(id)}
      className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors cursor-pointer flex-1"
    >
      <div className="relative">
        {active && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute inset-0 -m-1.5 bg-[#E07B54]/10 rounded-xl"
          />
        )}
        <Icon
          size={22}
          className={active ? "text-[#E07B54]" : "text-[#A89880]"}
          strokeWidth={active ? 2.5 : 1.8}
        />
      </div>
      <span className={`text-[10px] font-semibold ${active ? "text-[#E07B54]" : "text-[#A89880]"}`}>
        {label}
      </span>
    </button>
  );
}

export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  const isSpinActive = active === "spin";

  return (
    /*
     * No `fixed` positioning — this nav lives at the bottom of the AppLayout
     * flex column and is therefore naturally contained within the app shell.
     * `pb-safe` adds env(safe-area-inset-bottom) padding for iPhone home bar.
     */
    <nav
      className="bg-white/95 backdrop-blur-md border-t border-[#E7DCCF] shrink-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-xl mx-auto">
        {LEFT_TABS.map(({ id, label, Icon }) => (
          <NavTab key={id} id={id} label={label} Icon={Icon}
            active={active === id} onChange={onChange} />
        ))}

        {/* Center hero spin button */}
        <div className="flex flex-col items-center flex-1">
          <motion.button
            onClick={() => onChange("spin")}
            whileTap={{ scale: 0.92 }}
            className="relative flex items-center justify-center rounded-full cursor-pointer"
            style={{
              width: 52, height: 52,
              background: isSpinActive
                ? "linear-gradient(135deg, #C96A43, #A85535)"
                : "linear-gradient(135deg, #E07B54, #C96A43)",
              boxShadow: isSpinActive
                ? "0 2px 12px rgba(224,123,84,0.4)"
                : "0 4px 16px rgba(224,123,84,0.45)",
              marginTop: -22,
            }}
            aria-label="Girar"
          >
            <div className="absolute inset-0 rounded-full"
              style={{ border: "3px solid white", margin: -3 }} />
            <span style={{ fontSize: 24 }}>🎯</span>
          </motion.button>
          <span
            className="text-[10px] font-semibold mt-0.5"
            style={{ color: isSpinActive ? "#E07B54" : "#A89880" }}
          >
            Girar
          </span>
        </div>

        {RIGHT_TABS.map(({ id, label, Icon }) => (
          <NavTab key={id} id={id} label={label} Icon={Icon}
            active={active === id} onChange={onChange} />
        ))}
      </div>
    </nav>
  );
}
