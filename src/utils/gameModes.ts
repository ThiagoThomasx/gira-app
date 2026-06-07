/**
 * Pure game mode utilities — no side effects, fully testable.
 * All functions return new objects; none mutate their inputs.
 */
import type {
  RouletteOption,
  BestOfThreeSession,
  EliminationSession,
} from "../types";

// ── Best of 3 ─────────────────────────────────────────────────────────────────

export function initializeBestOfThreeSession(): BestOfThreeSession {
  return { rounds: [], isComplete: false, winner: null };
}

/**
 * Records one round result.
 * If the session is already complete or at 3 rounds, returns it unchanged.
 */
export function addBestOfThreeRound(
  session: BestOfThreeSession,
  selectedOption: RouletteOption
): BestOfThreeSession {
  if (session.isComplete || session.rounds.length >= 3) return session;

  const rounds = [
    ...session.rounds,
    { roundNumber: session.rounds.length + 1, selectedOption },
  ];
  const isComplete = rounds.length === 3;
  const winner = isComplete
    ? computeBestOfThreeWinner(rounds)
    : null;

  return { rounds, isComplete, winner };
}

/** Computes winner from a completed set of rounds (called internally). */
function computeBestOfThreeWinner(
  rounds: BestOfThreeSession["rounds"]
): RouletteOption {
  // Count how many times each option appears
  const counts = new Map<string, { option: RouletteOption; count: number }>();
  for (const { selectedOption } of rounds) {
    const entry = counts.get(selectedOption.id);
    if (entry) {
      entry.count++;
    } else {
      counts.set(selectedOption.id, { option: selectedOption, count: 1 });
    }
  }

  // Find the maximum count
  let maxCount = 0;
  for (const { count } of counts.values()) {
    if (count > maxCount) maxCount = count;
  }

  // If exactly one option has the max count → clear winner
  const leaders = [...counts.values()].filter((e) => e.count === maxCount);
  if (leaders.length === 1) return leaders[0].option;

  // Tie-break: last round wins
  return rounds[rounds.length - 1].selectedOption;
}

/** Returns the winner of a completed session, or null if not yet complete. */
export function getBestOfThreeWinner(
  session: BestOfThreeSession
): RouletteOption | null {
  return session.winner;
}

export function isBestOfThreeComplete(session: BestOfThreeSession): boolean {
  return session.isComplete;
}

// ── Veto ─────────────────────────────────────────────────────────────────────

/** Toggles an option's veto status; does not mutate the input array. */
export function toggleVetoOption(
  vetoedIds: string[],
  optionId: string
): string[] {
  return vetoedIds.includes(optionId)
    ? vetoedIds.filter((id) => id !== optionId)
    : [...vetoedIds, optionId];
}

/** Returns options that are NOT in the veto list. */
export function getVetoAvailableOptions(
  options: RouletteOption[],
  vetoedIds: string[]
): RouletteOption[] {
  return options.filter((o) => !vetoedIds.includes(o.id));
}

/** True when at least 2 options are still available to spin. */
export function canSpinWithVeto(
  options: RouletteOption[],
  vetoedIds: string[]
): boolean {
  return getVetoAvailableOptions(options, vetoedIds).length >= 2;
}

// ── Elimination ───────────────────────────────────────────────────────────────

export function initializeEliminationSession(): EliminationSession {
  return { eliminatedIds: [], winner: null, isComplete: false };
}

/**
 * Records the option that was eliminated this round.
 * Ignores duplicates. Returns session unchanged if already complete.
 */
export function addEliminationRound(
  session: EliminationSession,
  eliminatedOption: RouletteOption
): EliminationSession {
  if (session.isComplete) return session;
  if (session.eliminatedIds.includes(eliminatedOption.id)) return session;
  return {
    ...session,
    eliminatedIds: [...session.eliminatedIds, eliminatedOption.id],
  };
}

/** Returns options that have NOT been eliminated yet. */
export function getRemainingEliminationOptions(
  options: RouletteOption[],
  session: EliminationSession
): RouletteOption[] {
  return options.filter((o) => !session.eliminatedIds.includes(o.id));
}

/**
 * True when exactly one option remains (the survivor/winner).
 * Requires the full roulette options list to compute remaining count.
 */
export function isEliminationComplete(
  options: RouletteOption[],
  session: EliminationSession
): boolean {
  return getRemainingEliminationOptions(options, session).length === 1;
}

/** Returns the last surviving option, or null if more than one remains. */
export function getEliminationWinner(
  options: RouletteOption[],
  session: EliminationSession
): RouletteOption | null {
  const remaining = getRemainingEliminationOptions(options, session);
  return remaining.length === 1 ? remaining[0] : null;
}
