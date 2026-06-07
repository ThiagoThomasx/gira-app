import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react";
import { OptionEditor } from "../components/editor/OptionEditor";
import { PersonalitySelector } from "../components/editor/PersonalitySelector";
import { GameModeSelector } from "../components/editor/GameModeSelector";
import { useAppStore } from "../store/useAppStore";
import { templates } from "../data/templates";
import {
  validateEditorForm,
  buildRouletteFromTemplate,
  draftsToOptions,
  createBlankOption,
  type OptionDraft,
} from "../utils/editor";
import type { GameMode, PersonalityId } from "../types";
import { OPTION_COLORS } from "../data/colors";

// ─── props ───────────────────────────────────────────────────────────────────

interface EditorPageProps {
  /** When set, editor opens in edit mode for that roulette. */
  rouletteId?: string;
  /** When set, editor pre-fills from that template. */
  templateId?: string;
  onSaved: (rouletteId: string) => void;
  onCancel: () => void;
  /** Called after a roulette is successfully deleted (edit mode only). */
  onDeleted?: () => void;
}

// ─── section wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#A89880] mb-1 px-1">
        {title}
      </p>
      {hint && (
        <p className="text-xs text-[#A89880] mb-2 px-1">{hint}</p>
      )}
      {children}
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export function EditorPage({
  rouletteId,
  templateId,
  onSaved,
  onCancel,
  onDeleted,
}: EditorPageProps) {
  const { roulettes, createRoulette, updateRoulette, deleteRoulette } = useAppStore();

  // ── Form state ────────────────────────────────────────────────────────────

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([
    createBlankOption(0),
    createBlankOption(1),
  ]);
  const [personalityId, setPersonalityId] = useState<PersonalityId>("cute");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [nameError, setNameError] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm">("idle");

  const nameInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(rouletteId);
  const title = isEditMode ? "Editar roleta" : "Criar roleta";

  // ── Seed form on mount ────────────────────────────────────────────────────

  useEffect(() => {
    if (rouletteId) {
      // Edit mode: load existing roulette
      const existing = roulettes.find((r) => r.id === rouletteId);
      if (existing) {
        setName(existing.name);
        setDescription(existing.description ?? "");
        setOptions(
          existing.options.map((o) => ({
            id: o.id,
            label: o.label,
            weight: o.weight,
            color: o.color,
          }))
        );
        setPersonalityId(existing.personalityId);
        setGameMode(existing.gameMode);
      }
      return;
    }

    if (templateId) {
      // Template mode: pre-fill from template
      const tmpl = templates.find((t) => t.id === templateId);
      if (tmpl) {
        const draft = buildRouletteFromTemplate(tmpl);
        setName(draft.name);
        setDescription(draft.description ?? "");
        setOptions(
          draft.options.map((o) => ({
            id: o.id,
            label: o.label,
            weight: o.weight,
            color: o.color,
          }))
        );
        setPersonalityId(draft.personalityId);
        setGameMode(draft.gameMode);
      }
      return;
    }

    // Creation mode: focus name input
    nameInputRef.current?.focus();
  }, []);

  // ── Save handler ──────────────────────────────────────────────────────────

  function handleSave() {
    const { nameError: ne, optionsError: oe } = validateEditorForm(name, options);
    setNameError(ne);
    setOptionsError(oe);
    if (ne || oe) return;

    const finalOptions = draftsToOptions(options).map((o, i) => ({
      ...o,
      color: o.color || OPTION_COLORS[i % OPTION_COLORS.length],
    }));

    if (isEditMode && rouletteId) {
      updateRoulette(rouletteId, {
        name: name.trim(),
        description: description.trim() || undefined,
        options: finalOptions,
        personalityId,
        gameMode,
      });
      onSaved(rouletteId);
    } else {
      const created = createRoulette({
        name: name.trim(),
        description: description.trim() || undefined,
        options: finalOptions,
        personalityId,
        gameMode,
      });
      onSaved(created.id);
    }
  }

  // ── Delete handler ────────────────────────────────────────────────────────

  function handleDelete() {
    if (!rouletteId) return;
    deleteRoulette(rouletteId);
    onDeleted?.();
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-svh bg-[#FFF8F0] flex flex-col max-w-md lg:max-w-2xl mx-auto">

      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#E7DCCF] px-4 py-3 flex items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onCancel}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E7DCCF] cursor-pointer"
        >
          <ArrowLeft size={18} className="text-[#1C1917]" />
        </motion.button>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-black text-[#1C1917] leading-tight">
            {title}
          </h1>
          <p className="text-xs text-[#A89880]">Configure e salve sua roleta.</p>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #E07B54, #C96A43)",
            boxShadow: "0 4px 12px rgba(224,123,84,0.35)",
          }}
        >
          <Save size={14} />
          {isEditMode ? "Salvar" : "Salvar e girar"}
        </motion.button>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-10">

        {/* Name */}
        <Section title="Nome da roleta">
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Ex: O que comer hoje? 🍕"
            maxLength={80}
            className="w-full bg-white border rounded-xl px-4 py-3 text-base font-semibold text-[#1C1917] placeholder-[#C0B4A8] outline-none transition-all"
            style={{
              borderColor: nameError ? "#EF4444" : "#E7DCCF",
              boxShadow: nameError ? "0 0 0 2px rgba(239,68,68,0.15)" : undefined,
            }}
          />
          {nameError && (
            <p className="text-xs text-red-500 font-medium mt-1.5 px-1">
              {nameError}
            </p>
          )}
        </Section>

        {/* Description */}
        <Section title="Descrição" hint="Opcional. Aparece na tela de giro.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Usada quando o grupo não consegue decidir o jantar."
            maxLength={200}
            rows={2}
            className="w-full bg-white border border-[#E7DCCF] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#C0B4A8] outline-none resize-none focus:border-[#E07B54] focus:ring-2 focus:ring-[#E07B54]/15 transition-all"
          />
        </Section>

        {/* Options */}
        <Section title="Opções do destino" hint="Mínimo 2. Ajuste o peso para que uma opção apareça com mais frequência.">
          <OptionEditor
            options={options}
            onChange={(updated) => {
              setOptions(updated);
              if (optionsError) setOptionsError(null);
            }}
            error={optionsError}
          />
        </Section>

        {/* Personality */}
        <Section title="Personalidade" hint="Define o tom das frases durante o giro.">
          <PersonalitySelector value={personalityId} onChange={setPersonalityId} />
        </Section>

        {/* Game mode */}
        <Section title="Modo de jogo" hint="Define como as rodadas funcionam.">
          <GameModeSelector value={gameMode} onChange={setGameMode} />
        </Section>

        {/* ── Danger zone (edit mode only) ─────────────────────────────── */}
        {isEditMode && (
          <div className="mt-8 pt-6 border-t border-[#F3EDE4]">
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <AlertTriangle size={12} className="text-[#EF4444]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#EF4444]">
                Zona de perigo
              </p>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: "rgba(239,68,68,0.20)", background: "rgba(239,68,68,0.03)" }}
            >
              <p className="text-sm text-[#6B5E52] mb-4 leading-relaxed">
                Excluir esta roleta remove suas opções e configurações.{" "}
                <span className="font-semibold text-[#1C1917]">
                  O histórico dos giros anteriores será mantido.
                </span>
              </p>

              <AnimatePresence mode="wait">
                {deleteStep === "idle" ? (
                  <motion.button
                    key="delete-btn"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteStep("confirm")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                    style={{
                      borderColor: "rgba(239,68,68,0.30)",
                      color: "#EF4444",
                      background: "white",
                    }}
                  >
                    <Trash2 size={14} />
                    Excluir roleta
                  </motion.button>
                ) : (
                  <motion.div
                    key="delete-confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="text-sm font-semibold text-[#EF4444]">
                      Tem certeza? Essa ação não pode ser desfeita.
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setDeleteStep("idle")}
                        className="flex-1 py-2.5 rounded-xl border border-[#E7DCCF] bg-white text-sm font-semibold text-[#6B5E52] cursor-pointer"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={handleDelete}
                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #EF4444, #DC2626)",
                          boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
                        }}
                      >
                        Excluir definitivamente
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
