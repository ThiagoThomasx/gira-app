import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAppStore } from "../../store/useAppStore";
import { hasCompletedDailyDestiny } from "../../utils/date";

// ─── Reset store before each test ────────────────────────────────────────────

beforeEach(() => {
  useAppStore.setState({
    roulettes: [],
    history: [],
    dailyDestiny: undefined,
    preferences: {
      defaultPersonality: "cute",
      hasCompletedOnboarding: false,
    },
  });
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2025, 5, 7)); // June 7, 2025 → "2025-06-07"
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── startDailyDestiny ────────────────────────────────────────────────────────

describe("startDailyDestiny", () => {
  it("sets date to today and completed=false", () => {
    const { startDailyDestiny } = useAppStore.getState();
    startDailyDestiny();
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.date).toBe("2025-06-07");
    expect(dailyDestiny?.completed).toBe(false);
  });

  it("sets rouletteId when provided", () => {
    const { startDailyDestiny } = useAppStore.getState();
    startDailyDestiny("roulette-abc");
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.rouletteId).toBe("roulette-abc");
  });

  it("sets rouletteId as undefined when not provided", () => {
    const { startDailyDestiny } = useAppStore.getState();
    startDailyDestiny();
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.rouletteId).toBeUndefined();
  });

  it("overrides a previous daily destiny from another day", () => {
    useAppStore.setState({
      dailyDestiny: { date: "2025-06-06", completed: true, resultId: "old-result" },
    });
    const { startDailyDestiny } = useAppStore.getState();
    startDailyDestiny("new-roulette");
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.date).toBe("2025-06-07");
    expect(dailyDestiny?.completed).toBe(false);
    expect(dailyDestiny?.rouletteId).toBe("new-roulette");
  });
});

// ─── completeDailyDestiny ─────────────────────────────────────────────────────

describe("completeDailyDestiny", () => {
  it("marks completed=true and saves resultId", () => {
    const { startDailyDestiny, completeDailyDestiny } = useAppStore.getState();
    startDailyDestiny("roulette-123");
    completeDailyDestiny("result-xyz");
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.completed).toBe(true);
    expect(dailyDestiny?.resultId).toBe("result-xyz");
  });

  it("preserves date and rouletteId when completing", () => {
    const { startDailyDestiny, completeDailyDestiny } = useAppStore.getState();
    startDailyDestiny("roulette-123");
    completeDailyDestiny("result-xyz");
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.date).toBe("2025-06-07");
    expect(dailyDestiny?.rouletteId).toBe("roulette-123");
  });

  it("after completeDailyDestiny, hasCompletedDailyDestiny returns true", () => {
    const { startDailyDestiny, completeDailyDestiny } = useAppStore.getState();
    startDailyDestiny();
    completeDailyDestiny("result-1");
    const { dailyDestiny } = useAppStore.getState();
    expect(hasCompletedDailyDestiny(dailyDestiny)).toBe(true);
  });

  it("creates dailyDestiny from scratch if none existed", () => {
    const { completeDailyDestiny } = useAppStore.getState();
    completeDailyDestiny("result-fallback");
    const { dailyDestiny } = useAppStore.getState();
    expect(dailyDestiny?.completed).toBe(true);
    expect(dailyDestiny?.resultId).toBe("result-fallback");
    expect(dailyDestiny?.date).toBe("2025-06-07");
  });
});

// ─── setLastActiveRouletteId ──────────────────────────────────────────────────

describe("setLastActiveRouletteId", () => {
  it("saves rouletteId in preferences", () => {
    const { setLastActiveRouletteId } = useAppStore.getState();
    setLastActiveRouletteId("roulette-xyz");
    const { preferences } = useAppStore.getState();
    expect(preferences.lastActiveRouletteId).toBe("roulette-xyz");
  });

  it("overwrites a previous lastActiveRouletteId", () => {
    const { setLastActiveRouletteId } = useAppStore.getState();
    setLastActiveRouletteId("roulette-a");
    setLastActiveRouletteId("roulette-b");
    const { preferences } = useAppStore.getState();
    expect(preferences.lastActiveRouletteId).toBe("roulette-b");
  });

  it("preserves other preferences when setting lastActiveRouletteId", () => {
    const { setLastActiveRouletteId } = useAppStore.getState();
    setLastActiveRouletteId("roulette-123");
    const { preferences } = useAppStore.getState();
    expect(preferences.defaultPersonality).toBe("cute");
    expect(preferences.hasCompletedOnboarding).toBe(false);
  });
});

// ─── daily destiny availability logic ────────────────────────────────────────

describe("daily destiny availability", () => {
  it("is available when no record exists", () => {
    const { dailyDestiny } = useAppStore.getState();
    expect(hasCompletedDailyDestiny(dailyDestiny)).toBe(false);
  });

  it("is not available after being completed today", () => {
    const { startDailyDestiny, completeDailyDestiny } = useAppStore.getState();
    startDailyDestiny();
    completeDailyDestiny("result-1");
    const { dailyDestiny } = useAppStore.getState();
    expect(hasCompletedDailyDestiny(dailyDestiny)).toBe(true);
  });

  it("becomes available again on the next day", () => {
    // Complete today
    const { startDailyDestiny, completeDailyDestiny } = useAppStore.getState();
    startDailyDestiny();
    completeDailyDestiny("result-1");

    // Advance to next day
    vi.setSystemTime(new Date(2025, 5, 8)); // June 8, 2025

    const { dailyDestiny } = useAppStore.getState();
    // dailyDestiny.date is still "2025-06-07" from yesterday
    expect(hasCompletedDailyDestiny(dailyDestiny)).toBe(false);
  });
});
