/**
 * Utilities for daily-scoped logic (Destino do Dia).
 * All functions are pure and timezone-aware to local time.
 */

/** Returns today's date as "YYYY-MM-DD" using local time. */
export function getTodayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns true if both keys represent the same calendar day. */
export function isSameDayKey(a: string, b: string): boolean {
  return a === b;
}

/**
 * Returns true when the dailyDestiny was already completed today.
 * False if undefined, not completed, or from a previous day.
 */
export function hasCompletedDailyDestiny(
  dailyDestiny: { date: string; completed: boolean } | undefined
): boolean {
  if (!dailyDestiny) return false;
  return dailyDestiny.completed && isSameDayKey(dailyDestiny.date, getTodayKey());
}

/**
 * Returns true when Destino do Dia is available to be used today
 * (either never used or last used on a previous day).
 */
export function isDailyDestinyAvailable(
  dailyDestiny: { date: string; completed: boolean } | undefined
): boolean {
  return !hasCompletedDailyDestiny(dailyDestiny);
}
