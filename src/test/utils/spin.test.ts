import { describe, it, expect } from "vitest";
import {
  getAvailableOptions,
  weightedRandomPick,
  getRandomPersonalityPhrase,
  createSpinResult,
  computeSegmentAngles,
  calculateFinalRotation,
} from "../../utils/spin";
import { personalities } from "../../data/personalities";
import type { RouletteOption, Roulette } from "../../types";

// ─── fixtures ────────────────────────────────────────────────────────────────

const makeOption = (overrides: Partial<RouletteOption> = {}): RouletteOption => ({
  id: `opt-${Math.random().toString(36).slice(2)}`,
  label: "Opção",
  weight: 1,
  color: "#E07B54",
  ...overrides,
});

const makeRoulette = (overrides: Partial<Roulette> = {}): Roulette => ({
  id: "roulette-1",
  name: "Roleta Teste",
  options: [makeOption(), makeOption()],
  personalityId: "cute",
  gameMode: "classic",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// ─── getAvailableOptions ─────────────────────────────────────────────────────

describe("getAvailableOptions", () => {
  it("returns all options when none are vetoed or eliminated", () => {
    const options = [makeOption(), makeOption(), makeOption()];
    expect(getAvailableOptions(options)).toHaveLength(3);
  });

  it("removes vetoed options", () => {
    const options = [
      makeOption({ isVetoed: true }),
      makeOption(),
      makeOption({ isVetoed: true }),
    ];
    const result = getAvailableOptions(options);
    expect(result).toHaveLength(1);
    expect(result[0].isVetoed).toBeFalsy();
  });

  it("removes eliminated options", () => {
    const options = [
      makeOption({ isEliminated: true }),
      makeOption(),
    ];
    const result = getAvailableOptions(options);
    expect(result).toHaveLength(1);
    expect(result[0].isEliminated).toBeFalsy();
  });

  it("removes both vetoed and eliminated in one call", () => {
    const options = [
      makeOption({ isVetoed: true }),
      makeOption({ isEliminated: true }),
      makeOption(),
    ];
    expect(getAvailableOptions(options)).toHaveLength(1);
  });

  it("returns empty array when all options are unavailable", () => {
    const options = [
      makeOption({ isVetoed: true }),
      makeOption({ isEliminated: true }),
    ];
    expect(getAvailableOptions(options)).toHaveLength(0);
  });
});

// ─── weightedRandomPick ───────────────────────────────────────────────────────

describe("weightedRandomPick", () => {
  it("returns null for an empty list (fallback)", () => {
    expect(weightedRandomPick([])).toBeNull();
  });

  it("always returns the only option when list has one item", () => {
    const opt = makeOption();
    expect(weightedRandomPick([opt])).toBe(opt);
  });

  it("returns one of the provided options", () => {
    const options = [makeOption({ label: "A" }), makeOption({ label: "B" })];
    const result = weightedRandomPick(options);
    expect(result).not.toBeNull();
    expect(options).toContain(result);
  });

  it("returns a valid option across many calls", () => {
    const options = [makeOption(), makeOption(), makeOption()];
    for (let i = 0; i < 50; i++) {
      const result = weightedRandomPick(options);
      expect(options).toContain(result);
    }
  });

  it("heavily-weighted option is picked more often in a large sample", () => {
    const rare = makeOption({ id: "rare", label: "Raro", weight: 1 });
    const common = makeOption({ id: "common", label: "Comum", weight: 99 });
    const options = [rare, common];

    let commonCount = 0;
    const TRIALS = 1000;
    for (let i = 0; i < TRIALS; i++) {
      if (weightedRandomPick(options)?.id === "common") commonCount++;
    }

    // With weight 99:1, common should appear >85% of the time
    expect(commonCount / TRIALS).toBeGreaterThan(0.85);
  });

  it("equal-weight options are picked with roughly equal frequency", () => {
    const opts = [
      makeOption({ id: "a", weight: 1 }),
      makeOption({ id: "b", weight: 1 }),
    ];
    const counts: Record<string, number> = { a: 0, b: 0 };
    for (let i = 0; i < 1000; i++) {
      const picked = weightedRandomPick(opts)!;
      counts[picked.id]++;
    }
    // Each should be picked roughly 50% of the time (±15%)
    expect(counts.a / 1000).toBeGreaterThan(0.35);
    expect(counts.b / 1000).toBeGreaterThan(0.35);
  });
});

// ─── getRandomPersonalityPhrase ──────────────────────────────────────────────

describe("getRandomPersonalityPhrase", () => {
  it("returns a non-empty string for a valid personality and phase", () => {
    const phrase = getRandomPersonalityPhrase(personalities, "cute", "before");
    expect(typeof phrase).toBe("string");
    expect(phrase.trim()).not.toBe("");
  });

  it("returns a phrase from the correct phase", () => {
    const personality = personalities.find((p) => p.id === "dramatic")!;
    const phrase = getRandomPersonalityPhrase(personalities, "dramatic", "after");
    expect(personality.phrases.after).toContain(phrase);
  });

  it("returns phrases from all three phases", () => {
    const phases = ["before", "during", "after"] as const;
    for (const phase of phases) {
      const phrase = getRandomPersonalityPhrase(personalities, "honest", phase);
      expect(phrase).toBeTruthy();
    }
  });

  it("returns empty string for unknown personalityId", () => {
    const phrase = getRandomPersonalityPhrase(
      personalities,
      "nonexistent" as never,
      "before"
    );
    expect(phrase).toBe("");
  });

  it("returns different phrases across multiple calls (probabilistic)", () => {
    const results = new Set<string>();
    for (let i = 0; i < 30; i++) {
      results.add(
        getRandomPersonalityPhrase(personalities, "chaotic", "during")
      );
    }
    // Chaotic has 3 during phrases; at least 2 should appear in 30 calls
    expect(results.size).toBeGreaterThanOrEqual(2);
  });
});

// ─── createSpinResult ─────────────────────────────────────────────────────────

describe("createSpinResult", () => {
  const roulette = makeRoulette();
  const option = makeOption({ label: "Sushi", color: "#84A98C" });
  const phrase = "Era sempre esse!";

  it("returns an object with all required fields", () => {
    const result = createSpinResult(roulette, option, phrase);
    expect(result.id).toBeTruthy();
    expect(result.rouletteId).toBe(roulette.id);
    expect(result.rouletteName).toBe(roulette.name);
    expect(result.selectedOption).toBe(option);
    expect(result.personalityId).toBe(roulette.personalityId);
    expect(result.gameMode).toBe(roulette.gameMode);
    expect(result.spunAt).toBeTruthy();
    expect(result.phrase).toBe(phrase);
  });

  it("spunAt is a valid ISO date string", () => {
    const result = createSpinResult(roulette, option, phrase);
    expect(() => new Date(result.spunAt)).not.toThrow();
    expect(isNaN(new Date(result.spunAt).getTime())).toBe(false);
  });

  it("generates unique ids on successive calls", () => {
    const id1 = createSpinResult(roulette, option, phrase).id;
    const id2 = createSpinResult(roulette, option, phrase).id;
    expect(id1).not.toBe(id2);
  });
});

// ─── computeSegmentAngles ─────────────────────────────────────────────────────

describe("computeSegmentAngles", () => {
  it("starts the first segment at -90° (top of wheel)", () => {
    const options = [makeOption(), makeOption()];
    const [first] = computeSegmentAngles(options);
    expect(first.startAngle).toBe(-90);
  });

  it("last segment ends at 270° (full circle from -90)", () => {
    const options = [makeOption(), makeOption(), makeOption()];
    const angles = computeSegmentAngles(options);
    expect(angles[angles.length - 1].endAngle).toBeCloseTo(270, 5);
  });

  it("equal-weight options each span 180° for 2 options", () => {
    const options = [makeOption({ weight: 1 }), makeOption({ weight: 1 })];
    const [a, b] = computeSegmentAngles(options);
    expect(a.endAngle - a.startAngle).toBeCloseTo(180, 5);
    expect(b.endAngle - b.startAngle).toBeCloseTo(180, 5);
  });

  it("centerAngle is the midpoint of start and end angles", () => {
    const options = [makeOption(), makeOption(), makeOption()];
    for (const seg of computeSegmentAngles(options)) {
      expect(seg.centerAngle).toBeCloseTo(
        (seg.startAngle + seg.endAngle) / 2,
        5
      );
    }
  });
});

// ─── calculateFinalRotation ───────────────────────────────────────────────────

describe("calculateFinalRotation", () => {
  it("final rotation is greater than current rotation", () => {
    const final = calculateFinalRotation(0, -45);
    expect(final).toBeGreaterThan(0);
  });

  it("includes at least the requested minimum spins", () => {
    const current = 0;
    const final = calculateFinalRotation(current, -45, 5);
    expect(final - current).toBeGreaterThanOrEqual(5 * 360);
  });

  it("after applying final rotation, pointer (270°) aligns with segment center", () => {
    const segCenter = 45; // 45° from East
    const final = calculateFinalRotation(0, segCenter, 6);
    const alignedAngle = ((segCenter + final) % 360 + 360) % 360;
    expect(alignedAngle).toBeCloseTo(270, 1);
  });

  it("works correctly from a non-zero current rotation", () => {
    const current = 2430;
    const segCenter = 135;
    const final = calculateFinalRotation(current, segCenter, 5);
    const alignedAngle = ((segCenter + final) % 360 + 360) % 360;
    expect(alignedAngle).toBeCloseTo(270, 1);
    expect(final).toBeGreaterThan(current + 5 * 360);
  });
});
