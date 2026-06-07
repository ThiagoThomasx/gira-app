import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import { WeightSlider } from "./WeightSlider";
import type { OptionDraft } from "../../utils/editor";
import { createBlankOption } from "../../utils/editor";

interface OptionEditorProps {
  options: OptionDraft[];
  onChange: (options: OptionDraft[]) => void;
  error?: string | null;
}

export function OptionEditor({ options, onChange, error }: OptionEditorProps) {
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  function updateOption(id: string, updates: Partial<OptionDraft>) {
    onChange(options.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }

  function addOption() {
    const newOpt = createBlankOption(options.length);
    onChange([...options, newOpt]);
    // Focus new input on next tick
    requestAnimationFrame(() => {
      inputRefs.current.get(newOpt.id)?.focus();
    });
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;
    onChange(options.filter((o) => o.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const idx = options.findIndex((o) => o.id === id);
    const isLast = idx === options.length - 1;
    const current = options[idx];

    if (isLast && current.label.trim() !== "") {
      addOption();
    } else if (!isLast) {
      const nextId = options[idx + 1].id;
      inputRefs.current.get(nextId)?.focus();
    }
  }

  const canDelete = options.length > 2;

  return (
    <div>
      <AnimatePresence initial={false}>
        {options.map((opt, idx) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-[#E7DCCF] px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
              {/* Color swatch */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: opt.color }}
              />

              {/* Label input */}
              <input
                ref={(el) => {
                  if (el) inputRefs.current.set(opt.id, el);
                  else inputRefs.current.delete(opt.id);
                }}
                type="text"
                value={opt.label}
                placeholder={`Opção ${idx + 1}`}
                maxLength={60}
                onChange={(e) => updateOption(opt.id, { label: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, opt.id)}
                className="flex-1 text-sm font-medium text-[#1C1917] placeholder-[#C0B4A8] bg-transparent outline-none min-w-0"
              />

              {/* Weight */}
              <div className="shrink-0">
                <WeightSlider
                  value={opt.weight}
                  onChange={(w) => updateOption(opt.id, { weight: w })}
                  color={opt.color}
                />
              </div>

              {/* Delete */}
              <motion.button
                type="button"
                whileTap={canDelete ? { scale: 0.88 } : undefined}
                onClick={() => removeOption(opt.id)}
                disabled={!canDelete}
                title={canDelete ? "Remover opção" : "Mínimo de 2 opções"}
                className="shrink-0 ml-1 rounded-lg p-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
                style={{ color: canDelete ? "#E07B54" : "#D4C8BC" }}
              >
                <Trash2 size={15} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 font-medium mb-2 px-1">{error}</p>
      )}

      {/* Add option button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={addOption}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#E07B54]/50 text-[#E07B54] text-sm font-semibold mt-1 cursor-pointer hover:bg-[#E07B54]/5 transition-colors"
      >
        <Plus size={16} />
        Adicionar opção
      </motion.button>
    </div>
  );
}
