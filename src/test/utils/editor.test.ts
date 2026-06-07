import { describe, it, expect } from "vitest";
import {
  validateEditorForm,
  buildRouletteFromTemplate,
  draftsToOptions,
  createBlankOption,
  generateId,
  type OptionDraft,
} from "../../utils/editor";
import { templates } from "../../data/templates";
import { personalities } from "../../data/personalities";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeDraft(label: string, weight = 1): OptionDraft {
  return { id: generateId(), label, weight, color: "#E07B54" };
}

// ─── validateEditorForm ───────────────────────────────────────────────────────

describe("validateEditorForm", () => {
  it("returns no errors for valid name and 2+ filled options", () => {
    const { nameError, optionsError } = validateEditorForm("Minha Roleta", [
      makeDraft("Pizza"),
      makeDraft("Sushi"),
    ]);
    expect(nameError).toBeNull();
    expect(optionsError).toBeNull();
  });

  it("returns nameError when name is empty", () => {
    const { nameError } = validateEditorForm("", [makeDraft("A"), makeDraft("B")]);
    expect(nameError).toBeTruthy();
  });

  it("returns nameError when name is only whitespace", () => {
    const { nameError } = validateEditorForm("   ", [makeDraft("A"), makeDraft("B")]);
    expect(nameError).toBeTruthy();
  });

  it("returns optionsError when fewer than 2 filled options", () => {
    const { optionsError } = validateEditorForm("Roleta", [makeDraft("Pizza"), makeDraft("")]);
    expect(optionsError).toBeTruthy();
  });

  it("returns optionsError when all options are empty", () => {
    const { optionsError } = validateEditorForm("Roleta", [makeDraft(""), makeDraft("")]);
    expect(optionsError).toBeTruthy();
  });

  it("ignores options with empty labels when counting valid options", () => {
    const { optionsError } = validateEditorForm("Roleta", [
      makeDraft("A"),
      makeDraft("B"),
      makeDraft(""),   // empty → ignored
      makeDraft("  "), // whitespace → also ignored
    ]);
    expect(optionsError).toBeNull(); // 2 filled = valid
  });

  it("returns both errors when name and options are invalid", () => {
    const { nameError, optionsError } = validateEditorForm("", [makeDraft("")]);
    expect(nameError).toBeTruthy();
    expect(optionsError).toBeTruthy();
  });

  it("accepts 3+ filled options without error", () => {
    const { optionsError } = validateEditorForm("Roleta", [
      makeDraft("A"), makeDraft("B"), makeDraft("C"),
    ]);
    expect(optionsError).toBeNull();
  });
});

// ─── buildRouletteFromTemplate ────────────────────────────────────────────────

describe("buildRouletteFromTemplate", () => {
  const tmpl = templates[0]; // "O Que Fazer Agora"

  it("uses template name and description", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    expect(draft.name).toBe(tmpl.name);
    expect(draft.description).toBe(tmpl.description);
  });

  it("generates the same number of options as the template", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    expect(draft.options).toHaveLength(tmpl.defaultOptions.length);
  });

  it("uses recommendedPersonality", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    expect(draft.personalityId).toBe(tmpl.recommendedPersonality);
  });

  it("uses recommendedGameMode", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    expect(draft.gameMode).toBe(tmpl.recommendedGameMode);
  });

  it("sets templateId on the draft", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    expect(draft.templateId).toBe(tmpl.id);
  });

  it("each option has a non-empty label, weight ≥ 1, and a color", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    for (const opt of draft.options) {
      expect(opt.label.trim()).not.toBe("");
      expect(opt.weight).toBeGreaterThanOrEqual(1);
      expect(opt.color).toBeTruthy();
    }
  });

  it("each option gets a generated id", () => {
    const draft = buildRouletteFromTemplate(tmpl);
    const ids = draft.options.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length); // all unique
  });

  it("works for all 10 templates", () => {
    for (const t of templates) {
      const draft = buildRouletteFromTemplate(t);
      expect(draft.options.length).toBeGreaterThanOrEqual(2);
      expect(draft.personalityId).toBeTruthy();
    }
  });

  it("recommendedPersonality matches a known personality", () => {
    const knownIds = personalities.map((p) => p.id);
    for (const t of templates) {
      expect(knownIds).toContain(buildRouletteFromTemplate(t).personalityId);
    }
  });
});

// ─── draftsToOptions ──────────────────────────────────────────────────────────

describe("draftsToOptions", () => {
  it("filters out empty-label drafts", () => {
    const drafts = [makeDraft("Pizza"), makeDraft(""), makeDraft("Sushi")];
    const result = draftsToOptions(drafts);
    expect(result).toHaveLength(2);
  });

  it("trims whitespace from labels", () => {
    const drafts = [makeDraft("  Pizza  "), makeDraft("  Sushi  ")];
    const result = draftsToOptions(drafts);
    expect(result[0].label).toBe("Pizza");
    expect(result[1].label).toBe("Sushi");
  });

  it("preserves weight and color", () => {
    const draft: OptionDraft = { id: "x", label: "Test", weight: 3, color: "#84A98C" };
    const [opt] = draftsToOptions([draft, makeDraft("B")]);
    expect(opt.weight).toBe(3);
    expect(opt.color).toBe("#84A98C");
  });

  it("returns empty array when all labels are empty", () => {
    expect(draftsToOptions([makeDraft(""), makeDraft("  ")])).toHaveLength(0);
  });
});

// ─── createBlankOption ────────────────────────────────────────────────────────

describe("createBlankOption", () => {
  it("creates an option with empty label and weight 1", () => {
    const opt = createBlankOption(0);
    expect(opt.label).toBe("");
    expect(opt.weight).toBe(1);
  });

  it("assigns a color based on index", () => {
    const opt0 = createBlankOption(0);
    const opt8 = createBlankOption(8); // wraps around palette
    expect(opt0.color).toBe(opt8.color); // palette has 8 colors
    expect(opt0.color).toBeTruthy();
  });

  it("generates a non-empty id", () => {
    expect(createBlankOption(0).id).toBeTruthy();
  });
});

// ─── generateId ───────────────────────────────────────────────────────────────

describe("generateId", () => {
  it("returns a non-empty string", () => {
    expect(generateId()).toBeTruthy();
  });

  it("generates unique ids", () => {
    const ids = Array.from({ length: 100 }, generateId);
    expect(new Set(ids).size).toBe(100);
  });
});
