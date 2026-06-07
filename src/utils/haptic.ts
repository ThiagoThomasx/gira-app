/**
 * haptic.ts — thin wrapper around the Vibration API.
 *
 * navigator.vibrate is not available on:
 *   • iOS Safari (never implemented)
 *   • some desktop browsers
 *
 * All calls are guarded with optional chaining so they are
 * silently ignored when unavailable — no try/catch needed.
 */

/** Short tap: 8 ms — confirms a user action (spin start). */
export function hapticTap(): void {
  navigator.vibrate?.(8);
}

/**
 * Celebratory pattern: pause → short → pause → medium.
 * Communicates "result revealed" without being intrusive.
 * Pattern: [wait 0ms, buzz 10ms, wait 80ms, buzz 20ms]
 */
export function hapticResult(): void {
  navigator.vibrate?.([0, 10, 80, 20]);
}
