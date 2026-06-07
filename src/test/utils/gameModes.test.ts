import { describe, it, expect } from "vitest";
import {
  // Best of 3
  initializeBestOfThreeSession,
  addBestOfThreeRound,
  getBestOfThreeWinner,
  isBestOfThreeComplete,
  // Veto
  toggleVetoOption,
  getVetoAvailableOptions,
  canSpinWithVeto,
  // Elimination
  initializeEliminationSession,
  addEliminationRound,
  getRemainingEliminationOptions,
  isEliminationComplete,
  getEliminationWinner,
} from "../../utils/gameModes";
import type { RouletteOption } from "../../types";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeOption(id: string, label = id): RouletteOption {
  return { id, label, weight: 1, color: "#E07B54" };
}

const OPT_A = makeOption("a", "Pizza");
const OPT_B = makeOption("b", "Hambúrguer");
const OPT_C = makeOption("c", "Japonês");
const OPT_D = makeOption("d", "Mexicano");

// ─── Best of 3 ────────────────────────────────────────────────────────────────

describe("initializeBestOfThreeSession", () => {
  it("initializes with 0 rounds", () => {
    const session = initializeBestOfThreeSession();
    expect(session.rounds).toHaveLength(0);
  });

  it("starts as not complete", () => {
    const session = initializeBestOfThreeSession();
    expect(session.isComplete).toBe(false);
  });

  it("starts with no winner", () => {
    const session = initializeBestOfThreeSession();
    expect(session.winner).toBeNull();
  });
});

describe("addBestOfThreeRound", () => {
  it("adds first round correctly", () => {
    const s0 = initializeBestOfThreeSession();
    const s1 = addBestOfThreeRound(s0, OPT_A);
    expect(s1.rounds).toHaveLength(1);
    expect(s1.rounds[0].selectedOption.id).toBe("a");
    expect(s1.rounds[0].roundNumber).toBe(1);
  });

  it("adds second round correctly", () => {
    const s0 = initializeBestOfThreeSession();
    const s1 = addBestOfThreeRound(s0, OPT_A);
    const s2 = addBestOfThreeRound(s1, OPT_B);
    expect(s2.rounds).toHaveLength(2);
    expect(s2.rounds[1].roundNumber).toBe(2);
    expect(s2.isComplete).toBe(false);
  });

  it("marks complete after 3 rounds", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_A);
    expect(s.isComplete).toBe(true);
  });

  it("does not add more than 3 rounds", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_A);
    const before = s.rounds.length;
    s = addBestOfThreeRound(s, OPT_C); // 4th attempt — ignored
    expect(s.rounds).toHaveLength(before);
  });

  it("does not mutate input session", () => {
    const s0 = initializeBestOfThreeSession();
    const s1 = addBestOfThreeRound(s0, OPT_A);
    expect(s0.rounds).toHaveLength(0); // original unchanged
    expect(s1.rounds).toHaveLength(1);
  });
});

describe("getBestOfThreeWinner", () => {
  it("returns null for incomplete session", () => {
    const s = initializeBestOfThreeSession();
    expect(getBestOfThreeWinner(s)).toBeNull();
  });

  it("returns winner by majority (A wins 2-1)", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_A);
    expect(getBestOfThreeWinner(s)?.id).toBe("a");
  });

  it("returns winner by majority (B wins 2-1)", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_B);
    expect(getBestOfThreeWinner(s)?.id).toBe("b");
  });

  it("resolves 3-way tie using the last round (each option once)", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_C);
    // All tied 1-1-1, so last round (C) wins
    expect(getBestOfThreeWinner(s)?.id).toBe("c");
  });

  it("resolves 1-1-1 tie correctly with tiebreaker", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_C);
    expect(getBestOfThreeWinner(s)?.id).toBe("c"); // last round wins tie
  });
});

describe("isBestOfThreeComplete", () => {
  it("returns false before 3 rounds", () => {
    let s = initializeBestOfThreeSession();
    expect(isBestOfThreeComplete(s)).toBe(false);
    s = addBestOfThreeRound(s, OPT_A);
    expect(isBestOfThreeComplete(s)).toBe(false);
    s = addBestOfThreeRound(s, OPT_B);
    expect(isBestOfThreeComplete(s)).toBe(false);
  });

  it("returns true exactly after 3 rounds", () => {
    let s = initializeBestOfThreeSession();
    s = addBestOfThreeRound(s, OPT_A);
    s = addBestOfThreeRound(s, OPT_B);
    s = addBestOfThreeRound(s, OPT_C);
    expect(isBestOfThreeComplete(s)).toBe(true);
  });
});

// ─── Veto ─────────────────────────────────────────────────────────────────────

describe("toggleVetoOption", () => {
  it("adds optionId when not vetoed", () => {
    const result = toggleVetoOption([], "a");
    expect(result).toContain("a");
    expect(result).toHaveLength(1);
  });

  it("removes optionId when already vetoed", () => {
    const result = toggleVetoOption(["a", "b"], "a");
    expect(result).not.toContain("a");
    expect(result).toContain("b");
  });

  it("does not mutate the original array", () => {
    const original = ["a"];
    toggleVetoOption(original, "b");
    expect(original).toHaveLength(1); // unchanged
  });

  it("can veto multiple options", () => {
    let vetoed: string[] = [];
    vetoed = toggleVetoOption(vetoed, "a");
    vetoed = toggleVetoOption(vetoed, "b");
    vetoed = toggleVetoOption(vetoed, "c");
    expect(vetoed).toHaveLength(3);
  });
});

describe("getVetoAvailableOptions", () => {
  const options = [OPT_A, OPT_B, OPT_C];

  it("returns all options when none are vetoed", () => {
    const result = getVetoAvailableOptions(options, []);
    expect(result).toHaveLength(3);
  });

  it("excludes vetoed options", () => {
    const result = getVetoAvailableOptions(options, ["a", "c"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });

  it("returns empty array when all are vetoed", () => {
    const result = getVetoAvailableOptions(options, ["a", "b", "c"]);
    expect(result).toHaveLength(0);
  });

  it("does not mutate original options", () => {
    const original = [...options];
    getVetoAvailableOptions(options, ["a"]);
    expect(options).toHaveLength(original.length);
  });
});

describe("canSpinWithVeto", () => {
  const options = [OPT_A, OPT_B, OPT_C, OPT_D];

  it("returns true when 2 or more options are available", () => {
    expect(canSpinWithVeto(options, [])).toBe(true); // 4 available
    expect(canSpinWithVeto(options, ["a", "b"])).toBe(true); // 2 available
  });

  it("returns false when only 1 option is available", () => {
    expect(canSpinWithVeto(options, ["a", "b", "c"])).toBe(false); // 1 left
  });

  it("returns false when 0 options are available", () => {
    expect(canSpinWithVeto(options, ["a", "b", "c", "d"])).toBe(false);
  });
});

// ─── Elimination ──────────────────────────────────────────────────────────────

describe("initializeEliminationSession", () => {
  it("initializes with empty eliminatedIds", () => {
    const session = initializeEliminationSession();
    expect(session.eliminatedIds).toHaveLength(0);
  });

  it("initializes as not complete", () => {
    const session = initializeEliminationSession();
    expect(session.isComplete).toBe(false);
  });

  it("initializes with no winner", () => {
    const session = initializeEliminationSession();
    expect(session.winner).toBeNull();
  });
});

describe("addEliminationRound", () => {
  it("adds eliminated option id", () => {
    const s0 = initializeEliminationSession();
    const s1 = addEliminationRound(s0, OPT_A);
    expect(s1.eliminatedIds).toContain("a");
  });

  it("does not add duplicate ids", () => {
    const s0 = initializeEliminationSession();
    const s1 = addEliminationRound(s0, OPT_A);
    const s2 = addEliminationRound(s1, OPT_A); // duplicate
    expect(s2.eliminatedIds).toHaveLength(1);
  });

  it("does not mutate input session", () => {
    const s0 = initializeEliminationSession();
    addEliminationRound(s0, OPT_A);
    expect(s0.eliminatedIds).toHaveLength(0);
  });

  it("accumulates multiple eliminations", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_A);
    s = addEliminationRound(s, OPT_B);
    s = addEliminationRound(s, OPT_C);
    expect(s.eliminatedIds).toHaveLength(3);
    expect(s.eliminatedIds).toContain("a");
    expect(s.eliminatedIds).toContain("b");
    expect(s.eliminatedIds).toContain("c");
  });

  it("returns session unchanged when already complete", () => {
    const s = { eliminatedIds: ["a", "b", "c"], winner: OPT_D, isComplete: true };
    const s2 = addEliminationRound(s, OPT_D);
    expect(s2.eliminatedIds).toHaveLength(3); // unchanged
  });
});

describe("getRemainingEliminationOptions", () => {
  const options = [OPT_A, OPT_B, OPT_C, OPT_D];

  it("returns all options when none eliminated", () => {
    const session = initializeEliminationSession();
    const remaining = getRemainingEliminationOptions(options, session);
    expect(remaining).toHaveLength(4);
  });

  it("excludes eliminated options", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_A);
    s = addEliminationRound(s, OPT_C);
    const remaining = getRemainingEliminationOptions(options, s);
    expect(remaining).toHaveLength(2);
    expect(remaining.map((o) => o.id)).toEqual(["b", "d"]);
  });

  it("does not mutate original options", () => {
    const s = initializeEliminationSession();
    getRemainingEliminationOptions(options, s);
    expect(options).toHaveLength(4);
  });
});

describe("isEliminationComplete", () => {
  const options = [OPT_A, OPT_B, OPT_C];

  it("returns false when multiple options remain", () => {
    const session = initializeEliminationSession();
    expect(isEliminationComplete(options, session)).toBe(false);
  });

  it("returns false when exactly 2 options remain", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_A);
    expect(isEliminationComplete(options, s)).toBe(false);
  });

  it("returns true when exactly 1 option remains", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_A);
    s = addEliminationRound(s, OPT_B);
    expect(isEliminationComplete(options, s)).toBe(true);
  });
});

describe("getEliminationWinner", () => {
  const options = [OPT_A, OPT_B, OPT_C];

  it("returns null when multiple options remain", () => {
    const session = initializeEliminationSession();
    expect(getEliminationWinner(options, session)).toBeNull();
  });

  it("returns the last remaining option", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_A);
    s = addEliminationRound(s, OPT_B);
    const winner = getEliminationWinner(options, s);
    expect(winner?.id).toBe("c");
  });

  it("correctly identifies winner regardless of order", () => {
    let s = initializeEliminationSession();
    s = addEliminationRound(s, OPT_C);
    s = addEliminationRound(s, OPT_B);
    const winner = getEliminationWinner(options, s);
    expect(winner?.id).toBe("a");
  });

  it("does not mutate original roulette options", () => {
    const s = initializeEliminationSession();
    getEliminationWinner(options, s);
    expect(options).toHaveLength(3);
  });
});
