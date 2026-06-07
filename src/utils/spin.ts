import type {
  RouletteOption,
  Roulette,
  SpinResult,
  PersonalityId,
  Personality,
} from "../types";

/** Filters out vetoed and eliminated options. */
export function getAvailableOptions(options: RouletteOption[]): RouletteOption[] {
  return options.filter((o) => !o.isVetoed && !o.isEliminated);
}

/**
 * Picks one option using weighted random selection.
 * Expects pre-filtered (available) options.
 * Returns null when the list is empty.
 */
export function weightedRandomPick(options: RouletteOption[]): RouletteOption | null {
  if (options.length === 0) return null;

  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const option of options) {
    cursor -= option.weight;
    if (cursor <= 0) return option;
  }

  // Floating-point safety fallback
  return options[options.length - 1];
}

/** Returns a random phrase from the requested phase for the given personality. */
export function getRandomPersonalityPhrase(
  personalities: Personality[],
  personalityId: PersonalityId,
  phase: "before" | "during" | "after"
): string {
  const personality = personalities.find((p) => p.id === personalityId);
  if (!personality) return "";

  const phrases = personality.phrases[phase];
  if (phrases.length === 0) return "";

  return phrases[Math.floor(Math.random() * phrases.length)];
}

/** Builds a SpinResult from a roulette and its selected option. */
export function createSpinResult(
  roulette: Roulette,
  selectedOption: RouletteOption,
  phrase: string
): SpinResult {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    rouletteId: roulette.id,
    rouletteName: roulette.name,
    selectedOption,
    personalityId: roulette.personalityId,
    gameMode: roulette.gameMode,
    spunAt: new Date().toISOString(),
    phrase,
  };
}

/**
 * Computes the per-segment angular data for wheel drawing.
 * Segments are laid out clockwise starting from the top (−90° from East).
 */
export function computeSegmentAngles(
  options: RouletteOption[]
): Array<{ startAngle: number; endAngle: number; centerAngle: number }> {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let cursor = -90; // top of wheel in SVG degrees (East = 0)

  return options.map((option) => {
    const sweep = (option.weight / totalWeight) * 360;
    const startAngle = cursor;
    const endAngle = cursor + sweep;
    const centerAngle = cursor + sweep / 2;
    cursor = endAngle;
    return { startAngle, endAngle, centerAngle };
  });
}

/**
 * Calculates the cumulative rotation (degrees, always increasing) so that
 * the wheel pointer (fixed at the top = 270° from East) aligns with the
 * center of the target segment after the spin animation.
 *
 * @param currentRotation - current cumulative CSS rotation in degrees
 * @param segmentCenterAngle - the drawn center angle of the target segment
 * @param minSpins - minimum full revolutions to guarantee drama
 */
export function calculateFinalRotation(
  currentRotation: number,
  segmentCenterAngle: number,
  minSpins = 6
): number {
  // Pointer at top = 270° (from East). After rotating by R degrees clockwise:
  //   drawnAngle + R ≡ 270  (mod 360)
  //   R ≡ 270 - drawnAngle  (mod 360)
  const targetMod = ((270 - segmentCenterAngle) % 360 + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta <= 0) delta += 360; // always spin forward at least one step
  return currentRotation + delta + minSpins * 360;
}
