import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAppStore } from "../store/useAppStore";
import { personalities } from "../data/personalities";

const personalityEmoji: Record<string, string> = {
  dramatic: "🎭",
  snarky: "😏",
  cute: "🌸",
  honest: "🎯",
  villain: "😈",
  advisor: "🧘",
  chaotic: "🌀",
  professional: "💼",
};

export function SettingsPage() {
  const { preferences, updatePreferences, roulettes, history } = useAppStore();

  return (
    <div className="px-4 pb-6">
      <PageHeader title="Configurações" />

      <div className="flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-[#E07B54]">{roulettes.length}</p>
            <p className="text-xs text-[#6B5E52]">Roletas criadas</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-black text-[#84A98C]">{history.length}</p>
            <p className="text-xs text-[#6B5E52]">Giros realizados</p>
          </Card>
        </div>

        {/* Default personality */}
        <div>
          <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider mb-2 px-1">
            Personalidade padrão
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {personalities.map((p) => {
              const isSelected = preferences.defaultPersonality === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => updatePreferences({ defaultPersonality: p.id })}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#E07B54] bg-[#E07B54]/5"
                      : "border-[#E7DCCF] bg-white"
                  }`}
                >
                  <span className="text-xl">{personalityEmoji[p.id]}</span>
                  <span className={`text-sm font-semibold ${isSelected ? "text-[#E07B54]" : "text-[#1C1917]"}`}>
                    {p.name}
                  </span>
                  {isSelected && <Badge variant="primary" className="ml-auto">✓</Badge>}
                </button>
              );
            })}
          </div>
        </div>

        {/* About */}
        <Card padding="md" className="bg-[#F3EDE4] border-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎯</span>
            <p className="font-bold text-[#1C1917]">Gira.app</p>
          </div>
          <p className="text-xs text-[#6B5E52]">
            Sua roleta de decisão com personalidade. Porque decidir sozinha é sobrevaliado.
          </p>
          <p className="text-xs text-[#A89880] mt-2">v0.1.0 — Em desenvolvimento</p>
        </Card>
      </div>
    </div>
  );
}
