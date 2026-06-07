import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/layout/PageHeader";
import { templates } from "../data/templates";

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

interface ExplorePageProps {
  onUseTemplate: (templateId: string) => void;
}

export function ExplorePage({ onUseTemplate }: ExplorePageProps) {
  const [search, setSearch] = useState("");

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-6">
      <PageHeader title="Explorar" subtitle="Templates prontos pra girar" />

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89880]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar templates..."
          className="w-full bg-white border border-[#E7DCCF] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1C1917] placeholder-[#A89880] outline-none focus:border-[#E07B54] focus:ring-2 focus:ring-[#E07B54]/15"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((tmpl, i) => (
          <motion.div
            key={tmpl.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card padding="md">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F3EDE4] flex items-center justify-center text-2xl shrink-0">
                  {categoryEmoji[tmpl.category] ?? "🎲"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-[#1C1917] text-sm">{tmpl.name}</p>
                    <Badge variant="muted">{categoryLabel[tmpl.category]}</Badge>
                  </div>
                  <p className="text-xs text-[#6B5E52] line-clamp-2 mb-2">
                    {tmpl.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#A89880]">
                      {tmpl.defaultOptions.length} opções
                    </p>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onUseTemplate(tmpl.id)}
                    >
                      Usar template
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#A89880] text-sm">
            Nenhum template encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
