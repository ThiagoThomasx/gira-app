import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getTodayKey,
  isSameDayKey,
  hasCompletedDailyDestiny,
  isDailyDestinyAvailable,
} from "../../utils/date";

// ─── getTodayKey ──────────────────────────────────────────────────────────────

describe("getTodayKey", () => {
  it("returns a string in YYYY-MM-DD format", () => {
    const key = getTodayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("pads month and day with leading zeros", () => {
    // Mock a date where month and day are single-digit
    const mockDate = new Date(2025, 0, 5); // January 5, 2025
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    const key = getTodayKey();
    expect(key).toBe("2025-01-05");

    vi.useRealTimers();
  });

  it("matches current date components", () => {
    const now = new Date();
    const expectedYear = now.getFullYear();
    const expectedMonth = String(now.getMonth() + 1).padStart(2, "0");
    const expectedDay = String(now.getDate()).padStart(2, "0");
    const expected = `${expectedYear}-${expectedMonth}-${expectedDay}`;

    expect(getTodayKey()).toBe(expected);
  });
});

// ─── isSameDayKey ─────────────────────────────────────────────────────────────

describe("isSameDayKey", () => {
  it("returns true for identical day keys", () => {
    expect(isSameDayKey("2025-06-07", "2025-06-07")).toBe(true);
  });

  it("returns false for different days", () => {
    expect(isSameDayKey("2025-06-07", "2025-06-08")).toBe(false);
  });

  it("returns false for different months", () => {
    expect(isSameDayKey("2025-05-07", "2025-06-07")).toBe(false);
  });

  it("returns false for different years", () => {
    expect(isSameDayKey("2024-06-07", "2025-06-07")).toBe(false);
  });
});

// ─── hasCompletedDailyDestiny ─────────────────────────────────────────────────

describe("hasCompletedDailyDestiny", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 7)); // June 7, 2025
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false when dailyDestiny is undefined", () => {
    expect(hasCompletedDailyDestiny(undefined)).toBe(false);
  });

  it("returns false when not completed even if same day", () => {
    expect(
      hasCompletedDailyDestiny({ date: "2025-06-07", completed: false })
    ).toBe(false);
  });

  it("returns true when completed today", () => {
    expect(
      hasCompletedDailyDestiny({ date: "2025-06-07", completed: true })
    ).toBe(true);
  });

  it("returns false when completed on a previous day", () => {
    expect(
      hasCompletedDailyDestiny({ date: "2025-06-06", completed: true })
    ).toBe(false);
  });

  it("returns false when completed on a future date (clock mismatch)", () => {
    expect(
      hasCompletedDailyDestiny({ date: "2025-06-08", completed: true })
    ).toBe(false);
  });
});

// ─── isDailyDestinyAvailable ──────────────────────────────────────────────────

describe("isDailyDestinyAvailable", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 7));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when dailyDestiny is undefined", () => {
    expect(isDailyDestinyAvailable(undefined)).toBe(true);
  });

  it("returns true when not completed today", () => {
    expect(
      isDailyDestinyAvailable({ date: "2025-06-07", completed: false })
    ).toBe(true);
  });

  it("returns true when completed on a previous day (new day = available again)", () => {
    expect(
      isDailyDestinyAvailable({ date: "2025-06-06", completed: true })
    ).toBe(true);
  });

  it("returns false when completed today", () => {
    expect(
      isDailyDestinyAvailable({ date: "2025-06-07", completed: true })
    ).toBe(false);
  });
});
