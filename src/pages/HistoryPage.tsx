import { Clock } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { useAppStore } from "../store/useAppStore";
import { Card } from "../components/ui/Card";

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

export function HistoryPage() {
  const { history, clearHistory } = useAppStore();

  return (
    <div className="px-4 pb-6">
      <PageHeader
        title="Histórico"
        subtitle={history.length > 0 ? `${history.length} giros registrados` : undefined}
        action={
          history.length > 0 ? (
            <Button size="sm" variant="ghost" onClick={clearHistory}>
              Limpar
            </Button>
          ) : undefined
        }
      />

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock size={40} className="text-[#A89880]" />}
          title="Nenhum giro ainda"
          description="Quando você girar uma roleta, o resultado vai aparecer aqui."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {history.map((result) => (
            <Card key={result.id} padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3EDE4] flex items-center justify-center text-xl shrink-0">
                  {personalityEmoji[result.personalityId] ?? "🎲"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#6B5E52]">{result.rouletteName}</p>
                  <p className="font-bold text-[#1C1917] truncate">
                    {result.selectedOption.label}
                  </p>
                </div>
                <span className="text-xs text-[#A89880] shrink-0">
                  {new Date(result.spunAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
