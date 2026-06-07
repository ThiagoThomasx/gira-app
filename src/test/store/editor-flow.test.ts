import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../store/useAppStore";
import { buildRouletteFromTemplate } from "../../utils/editor";
import { templates } from "../../data/templates";
import type { RouletteOption } from "../../types";

beforeEach(() => {
  useAppStore.setState({
    roulettes: [],
    history: [],
    dailyDestiny: undefined,
    preferences: { defaultPersonality: "cute", hasCompletedOnboarding: false },
  });
});

const baseOption = (): RouletteOption => ({
  id: "o1",
  label: "Opção",
  weight: 1,
  color: "#E07B54",
});

// ─── create from template ─────────────────────────────────────────────────────

describe("create roulette from template", () => {
  it("stores the correct number of options from the template", () => {
    const tmpl = templates[0];
    const draft = buildRouletteFromTemplate(tmpl);
    const created = useAppStore.getState().createRoulette(draft);

    const stored = useAppStore.getState().roulettes.find((r) => r.id === created.id)!;
    expect(stored.options).toHaveLength(tmpl.defaultOptions.length);
  });

  it("stores correct personalityId from the template", () => {
    const tmpl = templates[2]; // "O Que Comer?"
    const draft = buildRouletteFromTemplate(tmpl);
    const created = useAppStore.getState().createRoulette(draft);

    expect(created.personalityId).toBe(tmpl.recommendedPersonality);
  });

  it("stores correct gameMode from the template", () => {
    const tmpl = templates[2];
    const draft = buildRouletteFromTemplate(tmpl);
    const created = useAppStore.getState().createRoulette(draft);

    expect(created.gameMode).toBe(tmpl.recommendedGameMode);
  });

  it("stores the templateId reference", () => {
    const tmpl = templates[4]; // "Qual Tarefa Primeiro?"
    const draft = buildRouletteFromTemplate(tmpl);
    const created = useAppStore.getState().createRoulette(draft);

    expect(created.templateId).toBe(tmpl.id);
  });

  it("option labels match the template default options", () => {
    const tmpl = templates[0];
    const draft = buildRouletteFromTemplate(tmpl);
    const created = useAppStore.getState().createRoulette(draft);

    const storedLabels = created.options.map((o) => o.label);
    const templateLabels = tmpl.defaultOptions.map((o) => o.label);
    expect(storedLabels).toEqual(templateLabels);
  });
});

// ─── update preserves createdAt ───────────────────────────────────────────────

describe("update roulette from editor", () => {
  it("preserves createdAt after update", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({
      name: "Original",
      options: [baseOption(), { ...baseOption(), id: "o2", label: "B" }],
      personalityId: "cute",
      gameMode: "classic",
    });

    const originalCreatedAt = r.createdAt;
    updateRoulette(r.id, { name: "Atualizada" });

    const updated = useAppStore.getState().roulettes.find((x) => x.id === r.id)!;
    expect(updated.createdAt).toBe(originalCreatedAt);
  });

  it("updates name and options correctly", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({
      name: "Antes",
      options: [baseOption(), { ...baseOption(), id: "o2", label: "B" }],
      personalityId: "cute",
      gameMode: "classic",
    });

    const newOptions: RouletteOption[] = [
      { id: "n1", label: "Nova A", weight: 2, color: "#84A98C" },
      { id: "n2", label: "Nova B", weight: 1, color: "#9B59B6" },
      { id: "n3", label: "Nova C", weight: 1, color: "#F4C430" },
    ];
    updateRoulette(r.id, { name: "Depois", options: newOptions });

    const updated = useAppStore.getState().roulettes.find((x) => x.id === r.id)!;
    expect(updated.name).toBe("Depois");
    expect(updated.options).toHaveLength(3);
  });

  it("updates personalityId and gameMode", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({
      name: "Test",
      options: [baseOption(), { ...baseOption(), id: "o2", label: "B" }],
      personalityId: "cute",
      gameMode: "classic",
    });

    updateRoulette(r.id, { personalityId: "villain", gameMode: "best_of_3" });

    const updated = useAppStore.getState().roulettes.find((x) => x.id === r.id)!;
    expect(updated.personalityId).toBe("villain");
    expect(updated.gameMode).toBe("best_of_3");
  });
});

// ─── delete from list ─────────────────────────────────────────────────────────

describe("delete roulette from editor", () => {
  it("removes roulette from the store", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    const r = createRoulette({
      name: "Para excluir",
      options: [baseOption(), { ...baseOption(), id: "o2", label: "B" }],
      personalityId: "honest",
      gameMode: "classic",
    });
    deleteRoulette(r.id);
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)).toBeUndefined();
  });

  it("other roulettes survive deletion", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    const r1 = createRoulette({
      name: "Sobrevive",
      options: [baseOption(), { ...baseOption(), id: "o2", label: "B" }],
      personalityId: "cute",
      gameMode: "classic",
    });
    const r2 = createRoulette({
      name: "Removida",
      options: [baseOption(), { ...baseOption(), id: "o3", label: "C" }],
      personalityId: "cute",
      gameMode: "classic",
    });
    deleteRoulette(r2.id);
    expect(useAppStore.getState().roulettes.find((x) => x.id === r1.id)).toBeDefined();
    expect(useAppStore.getState().roulettes).toHaveLength(1);
  });
});

// ─── game mode selection ──────────────────────────────────────────────────────

describe("create roulette with each game mode", () => {
  const twoOptions = (): RouletteOption[] => [
    baseOption(),
    { ...baseOption(), id: "o2", label: "B" },
  ];

  it("stores classic mode correctly", () => {
    const r = useAppStore.getState().createRoulette({
      name: "Test", options: twoOptions(), personalityId: "cute", gameMode: "classic",
    });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("classic");
  });

  it("stores best_of_3 mode correctly", () => {
    const r = useAppStore.getState().createRoulette({
      name: "Test", options: twoOptions(), personalityId: "cute", gameMode: "best_of_3",
    });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("best_of_3");
  });

  it("stores veto mode correctly", () => {
    const r = useAppStore.getState().createRoulette({
      name: "Test", options: twoOptions(), personalityId: "cute", gameMode: "veto",
    });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("veto");
  });

  it("stores elimination mode correctly", () => {
    const r = useAppStore.getState().createRoulette({
      name: "Test", options: twoOptions(), personalityId: "cute", gameMode: "elimination",
    });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("elimination");
  });
});

describe("update roulette game mode", () => {
  const twoOptions = (): RouletteOption[] => [
    baseOption(),
    { ...baseOption(), id: "o2", label: "B" },
  ];

  it("can change from classic to best_of_3", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "T", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    updateRoulette(r.id, { gameMode: "best_of_3" });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("best_of_3");
  });

  it("can change from classic to veto", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "T", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    updateRoulette(r.id, { gameMode: "veto" });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("veto");
  });

  it("can change from classic to elimination", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "T", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    updateRoulette(r.id, { gameMode: "elimination" });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("elimination");
  });

  it("can revert any mode back to classic", () => {
    const { createRoulette, updateRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "T", options: twoOptions(), personalityId: "cute", gameMode: "elimination" });
    updateRoulette(r.id, { gameMode: "classic" });
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)!.gameMode).toBe("classic");
  });
});

// ─── all 10 templates build valid roulette drafts ─────────────────────────────

describe("all templates produce valid drafts", () => {
  it("each template draft can be stored without error", () => {
    for (const tmpl of templates) {
      const draft = buildRouletteFromTemplate(tmpl);
      const created = useAppStore.getState().createRoulette(draft);
      expect(created.id).toBeTruthy();
      expect(created.options.length).toBeGreaterThanOrEqual(2);
    }
    expect(useAppStore.getState().roulettes).toHaveLength(templates.length);
  });
});
