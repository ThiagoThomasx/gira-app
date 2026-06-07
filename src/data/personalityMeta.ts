/**
 * personalityMeta.ts
 *
 * Shared lookup tables for personality display data.
 * Single source of truth — replaces duplicate maps in
 * HomePage, SpinPage, HistoryPage and SettingsPage.
 */

export const personalityEmoji: Record<string, string> = {
  dramatic:     "🎭",
  snarky:       "😏",
  cute:         "🌸",
  honest:       "🎯",
  villain:      "😈",
  advisor:      "🧘",
  chaotic:      "🌀",
  professional: "💼",
};
