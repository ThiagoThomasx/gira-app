import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../store/useAppStore";
import type { RouletteOption, SpinResult } from "../../types";

// ─── helpers ──────────────────────────────────────────────────────────────────

function baseOption(id = "o1", label = "A"): RouletteOption {
  return { id, label, weight: 1, color: "#E07B54" };
}

function twoOptions(): RouletteOption[] {
  return [baseOption("o1", "A"), baseOption("o2", "B")];
}

function makeSpinResult(rouletteId: string, rouletteName: string): SpinResult {
  return {
    id: `spin-${Date.now()}`,
    rouletteId,
    rouletteName,
    selectedOption: baseOption(),
    personalityId: "cute",
    gameMode: "classic",
    spunAt: new Date().toISOString(),
  };
}

// ─── reset before each test ───────────────────────────────────────────────────

beforeEach(() => {
  useAppStore.setState({
    roulettes: [],
    history: [],
    dailyDestiny: undefined,
    preferences: { defaultPersonality: "cute", hasCompletedOnboarding: false },
  });
});

// ─── basic deletion ───────────────────────────────────────────────────────────

describe("deleteRoulette — basic behaviour", () => {
  it("removes the target roulette", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "X", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    deleteRoulette(r.id);
    expect(useAppStore.getState().roulettes.find((x) => x.id === r.id)).toBeUndefined();
  });

  it("leaves other roulettes untouched", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    const r1 = createRoulette({ name: "Keep", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    const r2 = createRoulette({ name: "Delete", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    deleteRoulette(r2.id);
    expect(useAppStore.getState().roulettes).toHaveLength(1);
    expect(useAppStore.getState().roulettes[0].id).toBe(r1.id);
  });

  it("is idempotent — deleting a non-existent id changes nothing", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    createRoulette({ name: "Keep", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    deleteRoulette("does-not-exist");
    expect(useAppStore.getState().roulettes).toHaveLength(1);
  });
});

// ─── history preservation ─────────────────────────────────────────────────────

describe("deleteRoulette — history is preserved", () => {
  it("does not remove history entries for the deleted roulette", () => {
    const { createRoulette, deleteRoulette, addHistory } = useAppStore.getState();
    const r = createRoulette({ name: "Girada", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    addHistory(makeSpinResult(r.id, r.name));
    deleteRoulette(r.id);
    expect(useAppStore.getState().history).toHaveLength(1);
    expect(useAppStore.getState().history[0].rouletteId).toBe(r.id);
  });

  it("does not remove history entries for other roulettes", () => {
    const { createRoulette, deleteRoulette, addHistory } = useAppStore.getState();
    const r1 = createRoulette({ name: "Mantida", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    const r2 = createRoulette({ name: "Excluída", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    addHistory(makeSpinResult(r1.id, r1.name));
    addHistory(makeSpinResult(r2.id, r2.name));
    deleteRoulette(r2.id);
    expect(useAppStore.getState().history).toHaveLength(2);
  });
});

// ─── lastActiveRouletteId management ─────────────────────────────────────────

describe("deleteRoulette — lastActiveRouletteId", () => {
  it("clears lastActiveRouletteId when the deleted roulette was active", () => {
    const { createRoulette, deleteRoulette, setLastActiveRouletteId } = useAppStore.getState();
    const r = createRoulette({ name: "Ativa", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    setLastActiveRouletteId(r.id);
    expect(useAppStore.getState().preferences.lastActiveRouletteId).toBe(r.id);
    deleteRoulette(r.id);
    expect(useAppStore.getState().preferences.lastActiveRouletteId).toBeUndefined();
  });

  it("preserves lastActiveRouletteId when a different roulette is deleted", () => {
    const { createRoulette, deleteRoulette, setLastActiveRouletteId } = useAppStore.getState();
    const r1 = createRoulette({ name: "Ativa", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    const r2 = createRoulette({ name: "Excluída", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    setLastActiveRouletteId(r1.id);
    deleteRoulette(r2.id);
    expect(useAppStore.getState().preferences.lastActiveRouletteId).toBe(r1.id);
  });

  it("leaves lastActiveRouletteId undefined when none was set", () => {
    const { createRoulette, deleteRoulette } = useAppStore.getState();
    const r = createRoulette({ name: "X", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    deleteRoulette(r.id);
    expect(useAppStore.getState().preferences.lastActiveRouletteId).toBeUndefined();
  });
});

// ─── dailyDestiny is not broken ───────────────────────────────────────────────

describe("deleteRoulette — dailyDestiny is not affected", () => {
  it("preserves dailyDestiny when it references a different roulette", () => {
    const { createRoulette, deleteRoulette, startDailyDestiny } = useAppStore.getState();
    const r1 = createRoulette({ name: "Destino", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    const r2 = createRoulette({ name: "Excluída", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    startDailyDestiny(r1.id);
    deleteRoulette(r2.id);
    expect(useAppStore.getState().dailyDestiny?.rouletteId).toBe(r1.id);
    expect(useAppStore.getState().dailyDestiny?.completed).toBe(false);
  });

  it("keeps dailyDestiny intact even when the referenced roulette is deleted", () => {
    // dailyDestiny stores the rouletteId for reference — deleting the roulette
    // does NOT wipe dailyDestiny (it keeps the history reference intentionally)
    const { createRoulette, deleteRoulette, startDailyDestiny } = useAppStore.getState();
    const r = createRoulette({ name: "Destino", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    startDailyDestiny(r.id);
    deleteRoulette(r.id);
    // dailyDestiny itself is preserved (UI handles missing roulette gracefully)
    expect(useAppStore.getState().dailyDestiny).toBeDefined();
    expect(useAppStore.getState().dailyDestiny?.date).toBeTruthy();
  });

  it("preserves a completed dailyDestiny after deletion", () => {
    const { createRoulette, deleteRoulette, startDailyDestiny, completeDailyDestiny } =
      useAppStore.getState();
    const r = createRoulette({ name: "Destino", options: twoOptions(), personalityId: "cute", gameMode: "classic" });
    startDailyDestiny(r.id);
    completeDailyDestiny("spin-abc");
    deleteRoulette(r.id);
    expect(useAppStore.getState().dailyDestiny?.completed).toBe(true);
    expect(useAppStore.getState().dailyDestiny?.resultId).toBe("spin-abc");
  });
});

// ─── other preferences survive ────────────────────────────────────────────────

describe("deleteRoulette — other preferences are not mutated", () => {
  it("keeps defaultPersonality intact", () => {
    const { createRoulette, deleteRoulette, updatePreferences } = useAppStore.getState();
    updatePreferences({ defaultPersonality: "villain" });
    const r = createRoulette({ name: "X", options: twoOptions(), personalityId: "villain", gameMode: "classic" });
    deleteRoulette(r.id);
    expect(useAppStore.getState().preferences.defaultPersonality).toBe("villain");
  });
});
