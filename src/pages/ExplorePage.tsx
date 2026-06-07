import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/layout/PageHeader";
import { templates } from "../data/templates";

// ─── constants ────────────────────────────────────────────────────────────────

const categoryEmoji: Record<string, string> = {
  daily: "☀️", couple: "💑", work: "💼", friends: "🎉",
  selfcare: "🌸", food: "🍕", entertainment: "🎬",
  chores: "🧹", challenges: "⚡", random: "🎲",
};

const categoryLabel: Record<string, string> = {
  daily: "Dia a dia", couple: "Casal", work: "Trabalho",
  friends: "Amigos", selfcare: "Autocuidado", food: "Comida",
  entertainment: "Entretenimento", chores: "Tarefas",
  challenges: "Desafios", random: "Aleatório",
};

const personalityEmoji: Record<string, string> = {
  dramatic: "🎭", snarky: "😏", cute: "🌸", honest: "🎯",
  villain: "😈", advisor: "🧘", chaotic: "🌀", professional: "💼",
};

const gameModeLabel: Record<string, string> = {
  classic: "Clássico", best_of_3: "Melhor de 3",
  veto: "Veto", elimination: "Eliminação",
};

// ─── props ────────────────────────────────────────────────────────────────────

interface ExplorePageProps {
  onUseTemplate: (templateId: string) => void;
}

// ─── component ───────────────────────────────────────────────────────────────

export function ExplorePage({ onUseTemplate }: ExplorePageProps) {
  const [search, setSearch] = useState("");

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-6">
      <PageHeader
        title="Explorar"
        subtitle="Templates prontos pra girar"
      />

      {/* ── Search bar ──────────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89880]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou tema..."
          className="w-full bg-white border border-[#E7DCCF] rounded-xl pl-9 pr-10 py-2.5 text-sm text-[#1C1917] placeholder-[#A89880] outline-none focus:border-[#E07B54] focus:ring-2 focus:ring-[#E07B54]/15 transition-all"
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#E7DCCF] cursor-pointer hover:bg-[#D4C5B5] transition-colors"
            >
              <X size={11} className="text-[#6B5E52]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Template grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((tmpl, i) => (
            <motion.div
              key={tmpl.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card padding="md">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F3EDE4] flex items-center justify-center text-2xl shrink-0">
                    {categoryEmoji[tmpl.category] ?? "🎲"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-[#1C1917] text-sm leading-tight">
                        {tmpl.name}
                      </p>
                      <Badge variant="muted" className="shrink-0">
                        {categoryLabel[tmpl.category]}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6B5E52] line-clamp-2 mb-2.5">
                      {tmpl.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#A89880] font-medium">
                          {tmpl.defaultOptions.length} opções
                        </span>
                        {tmpl.recommendedPersonality && (
                          <span className="text-[10px] text-[#A89880]">
                            · {personalityEmoji[tmpl.recommendedPersonality]}
                          </span>
                        )}
                        {tmpl.recommendedGameMode && tmpl.recommendedGameMode !== "classic" && (
                          <Badge variant="primary" className="text-[10px]">
                            {gameModeLabel[tmpl.recommendedGameMode] ?? tmpl.recommendedGameMode}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onUseTemplate(tmpl.id)}
                      >
                        Usar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Empty search state ─────────────────────────────────────────── */}
        {filtered.length === 0 && search && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-12 flex flex-col items-center gap-3 text-center"
          >
            <span className="text-5xl">🔍</span>
            <div>
              <p className="font-bold text-[#1C1917] mb-1">
                Nenhum template pra "{search}"
              </p>
              <p className="text-sm text-[#A89880]">
                Tenta uma palavra diferente ou{" "}
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-[#E07B54] font-semibold underline cursor-pointer"
                >
                  veja todos
                </button>
                .
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
