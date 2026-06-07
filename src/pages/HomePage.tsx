import { motion } from "framer-motion";
import { Plus, Sparkles, Pin, ChevronRight, Zap, Pencil, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/layout/PageHeader";
import { useAppStore } from "../store/useAppStore";
import { hasCompletedDailyDestiny } from "../utils/date";
import { personalities } from "../data/personalities";
import { templates } from "../data/templates";
import { personalityEmoji } from "../data/personalityMeta";

// ─── constants ────────────────────────────────────────────────────────────────

const categoryEmoji: Record<string, string> = {
  daily: "☀️", couple: "💑", work: "💼", friends: "🎉",
  selfcare: "🌸", food: "🍕", entertainment: "🎬",
  chores: "🧹", challenges: "⚡", random: "🎲",
};

const gameModeLabel: Record<string, string> = {
  classic: "Clássico", best_of_3: "Melhor de 3",
  veto: "Veto", elimination: "Eliminação",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ─── props ────────────────────────────────────────────────────────────────────

interface HomePageProps {
  onNewRoulette: () => void;
  onOpenRoulette: (id: string) => void;
  onEditRoulette: (id: string) => void;
  onUseTemplate: (templateId: string) => void;
  onDailyDestiny: () => void;
}

// ─── component ───────────────────────────────────────────────────────────────

export function HomePage({
  onNewRoulette,
  onOpenRoulette,
  onEditRoulette,
  onUseTemplate,
  onDailyDestiny,
}: HomePageProps) {
  const { roulettes, history, dailyDestiny } = useAppStore();
  const dailyCompleted = hasCompletedDailyDestiny(dailyDestiny);

  const pinned = roulettes.filter((r) => r.isPinned);
  const recent = roulettes.slice(0, 6);
  const lastResult = history[0];

  // ── Reusable blocks ─────────────────────────────────────────────────────────

  const heroHeader = (
    <motion.div variants={itemVariants} className="pt-8 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl">🎯</span>
        <h1 className="text-3xl font-black text-[#1C1917] tracking-tight">
          Gira<span className="text-[#E07B54]">.</span>app
        </h1>
      </div>
      <p className="text-[#6B5E52] text-sm">Sua roleta de decisão com personalidade ✨</p>
    </motion.div>
  );

  const dailyDestinyBanner = (
    <motion.div variants={itemVariants}>
      {dailyCompleted ? (
        /* ── Concluído ── */
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onDailyDestiny}
          className="w-full text-left relative overflow-hidden rounded-2xl p-4 mb-5 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #84A98C, #6B8F72)",
            boxShadow: "0 4px 20px rgba(107,143,114,0.30)",
          }}
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-white/90" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                Destino do dia
              </span>
            </div>
            <p className="text-white font-bold text-lg leading-snug mb-1">
              Destino de hoje decidido ✓
            </p>
            <p className="text-white/75 text-xs">
              Toque para ver a roleta usada
            </p>
          </div>
        </motion.button>
      ) : (
        /* ── Disponível ── */
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onDailyDestiny}
          className="w-full text-left relative overflow-hidden rounded-2xl p-4 mb-5 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #E07B54, #C96A43)",
            boxShadow: "0 4px 20px rgba(224,123,84,0.35)",
          }}
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-2 w-16 h-16 rounded-full bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#F4C430]" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                Destino do dia
              </span>
            </div>
            <p className="text-white font-bold text-lg leading-snug mb-3">
              O que o universo tem pra você hoje?
            </p>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)" }}
            >
              <Zap size={14} />
              Descobrir agora
            </span>
          </div>
        </motion.button>
      )}
    </motion.div>
  );

  const lastResultBlock = lastResult && (
    <motion.div variants={itemVariants}>
      <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider mb-2 px-1">
        Último giro
      </p>
      <Card className="mb-5 bg-[#F3EDE4] border-[#E7DCCF]" padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E07B54]/15 flex items-center justify-center text-xl">
            🎰
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6B5E52]">{lastResult.rouletteName}</p>
            <p className="font-bold text-[#1C1917] truncate">
              {lastResult.selectedOption.label}
            </p>
          </div>
          <Badge variant="muted" className="shrink-0 text-xs">
            {new Date(lastResult.spunAt).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "short",
            })}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );

  const pinnedBlock = pinned.length > 0 && (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-2 mb-2 px-1">
        <Pin size={13} className="text-[#E07B54]" />
        <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider">
          Fixadas
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-5">
        {pinned.map((r) => {
          const personality = personalities.find((p) => p.id === r.personalityId);
          return (
            <RouletteCard
              key={r.id}
              name={r.name}
              description={r.description}
              optionCount={r.options.length}
              personalityName={personality?.name}
              personalityEmoji={personalityEmoji[r.personalityId] ?? "🎲"}
              gameMode={r.gameMode}
              accentColor="#9B59B6"
              bgColor="#9B59B6"
              onOpen={() => onOpenRoulette(r.id)}
              onEdit={() => onEditRoulette(r.id)}
            />
          );
        })}
      </div>
    </motion.div>
  );

  const myRoulettesBlock = (
    <motion.div variants={itemVariants}>
      <PageHeader
        title="Minhas Roletas"
        subtitle={roulettes.length > 0 ? `${roulettes.length} criadas` : undefined}
        action={
          <Button size="sm" variant="primary" onClick={onNewRoulette}>
            <Plus size={15} />
            Nova
          </Button>
        }
        className="px-1 pt-0 pb-3"
      />
      {recent.length === 0 ? (
        <EmptyState
          icon="🎲"
          title="Nenhuma roleta ainda"
          description="Crie sua primeira roleta e deixa a sorte decidir por você."
          action={
            <Button variant="primary" size="md" onClick={onNewRoulette}>
              <Plus size={16} />
              Criar minha primeira roleta
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {recent.map((r) => {
            const personality = personalities.find((p) => p.id === r.personalityId);
            return (
              <RouletteCard
                key={r.id}
                name={r.name}
                description={r.description}
                optionCount={r.options.length}
                personalityName={personality?.name}
                personalityEmoji={personalityEmoji[r.personalityId] ?? "🎲"}
                gameMode={r.gameMode}
                accentColor="#84A98C"
                bgColor="#84A98C"
                onOpen={() => onOpenRoulette(r.id)}
                onEdit={() => onEditRoulette(r.id)}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );

  const templatesBlock = (
    <motion.div variants={itemVariants} className="mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-[#A89880] uppercase tracking-wider">
          Templates em destaque
        </p>
      </div>
      {/* Desktop: grid 2 cols. Mobile: horizontal scroll */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-3">
        {templates.slice(0, 6).map((tmpl) => (
          <motion.div
            key={tmpl.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onUseTemplate(tmpl.id)}
            className="flex items-center gap-3 bg-white rounded-2xl border border-[#E7DCCF] p-3 cursor-pointer shadow-sm"
          >
            <div className="text-2xl shrink-0">{categoryEmoji[tmpl.category] ?? "🎲"}</div>
            <div className="min-w-0">
              <p className="font-bold text-[#1C1917] text-sm leading-tight truncate">{tmpl.name}</p>
              <p className="text-[10px] text-[#6B5E52] leading-snug line-clamp-1">{tmpl.tagline}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {templates.slice(0, 5).map((tmpl) => (
          <motion.div
            key={tmpl.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onUseTemplate(tmpl.id)}
            className="shrink-0 w-36 bg-white rounded-2xl border border-[#E7DCCF] p-3 cursor-pointer shadow-sm"
          >
            <div className="text-2xl mb-2">{categoryEmoji[tmpl.category] ?? "🎲"}</div>
            <p className="font-bold text-[#1C1917] text-sm leading-tight mb-1">{tmpl.name}</p>
            <p className="text-[10px] text-[#6B5E52] leading-snug line-clamp-2">{tmpl.tagline}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="px-4 pb-6">
      {heroHeader}

      {/* Mobile: single column, natural order */}
      <div className="lg:hidden">
        {dailyDestinyBanner}
        {lastResultBlock}
        {pinnedBlock}
        {myRoulettesBlock}
        {templatesBlock}
      </div>

      {/* Desktop: two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-[1.4fr_0.8fr] lg:gap-6 lg:items-start">
        {/* Left column — roulettes + templates */}
        <div>
          {pinnedBlock}
          {myRoulettesBlock}
          {templatesBlock}
        </div>
        {/* Right column — daily destiny + last result */}
        <div>
          {dailyDestinyBanner}
          {lastResultBlock}
        </div>
      </div>
    </motion.div>
  );
}

// ─── sub-component: roulette card ─────────────────────────────────────────────

interface RouletteCardProps {
  name: string;
  description?: string;
  optionCount: number;
  personalityName?: string;
  personalityEmoji: string;
  gameMode: string;
  accentColor: string;
  bgColor: string;
  onOpen: () => void;
  onEdit: () => void;
}

function RouletteCard({
  name, description, optionCount, personalityName, personalityEmoji,
  gameMode, bgColor, onOpen, onEdit,
}: RouletteCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7DCCF] shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${bgColor}20` }}
        >
          {personalityEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1C1917] truncate">{name}</p>
          {description ? (
            <p className="text-xs text-[#6B5E52] truncate">{description}</p>
          ) : (
            <p className="text-xs text-[#A89880]">
              {optionCount} opções · {personalityName} · {gameModeLabel[gameMode] ?? gameMode}
            </p>
          )}
        </div>
        <ChevronRight size={16} className="text-[#A89880] shrink-0" />
      </button>

      {/* Edit button strip */}
      <div className="border-t border-[#F3EDE4] px-3 py-1.5 flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant="muted">{optionCount} opções</Badge>
          {personalityName && <Badge variant="primary">{personalityEmoji} {personalityName}</Badge>}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1 text-xs text-[#A89880] hover:text-[#E07B54] transition-colors cursor-pointer px-1 py-0.5"
        >
          <Pencil size={12} />
          Editar
        </button>
      </div>
    </div>
  );
}
