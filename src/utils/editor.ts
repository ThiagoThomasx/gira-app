import type { Roulette, RouletteTemplate } from "../types";
import { OPTION_COLORS } from "../data/colors";

export interface EditorErrors {
  nameError: string | null;
  optionsError: string | null;
}

export interface OptionDraft {
  id: string;
  label: string;
  weight: number;
  color: string;
}

/** Generates a unique id for drafts and options. */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validates editor form data.
 * Options with empty labels are treated as non-existent for counting purposes.
 */
export function validateEditorForm(
  name: string,
  options: OptionDraft[]
): EditorErrors {
  const nameError = name.trim() === "" ? "Essa roleta precisa de um nome." : null;

  const filledOptions = options.filter((o) => o.label.trim() !== "");
  const optionsError =
    filledOptions.length < 2
      ? "Adicione pelo menos 2 opções para o destino trabalhar."
      : null;

  return { nameError, optionsError };
}

/** Creates a blank option draft at the given index. */
export function createBlankOption(index: number): OptionDraft {
  return {
    id: generateId(),
    label: "",
    weight: 1,
    color: OPTION_COLORS[index % OPTION_COLORS.length],
  };
}

/**
 * Builds the data needed for createRoulette() from a template.
 * Option ids are generated here so they are stable before hitting the store.
 */
export function buildRouletteFromTemplate(
  template: RouletteTemplate
): Omit<Roulette, "id" | "createdAt" | "updatedAt"> {
  return {
    name: template.name,
    description: template.description,
    options: template.defaultOptions.map((o, i) => ({
      id: generateId(),
      label: o.label,
      weight: Math.min(5, Math.max(1, o.weight)),
      color: o.color ?? OPTION_COLORS[i % OPTION_COLORS.length],
    })),
    personalityId: template.recommendedPersonality,
    gameMode: template.recommendedGameMode,
    templateId: template.id,
  };
}

/** Converts OptionDraft[] to the final RouletteOption[] ready for the store. */
export function draftsToOptions(
  drafts: OptionDraft[]
): Roulette["options"] {
  return drafts
    .filter((d) => d.label.trim() !== "")
    .map((d) => ({
      id: d.id,
      label: d.label.trim(),
      weight: d.weight,
      color: d.color,
    }));
}
