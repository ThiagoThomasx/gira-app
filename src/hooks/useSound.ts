/**
 * useSound — gate for all Gira.app audio
 *
 * Reads `soundEnabled` from persisted preferences and exposes
 * the three sound actions. All methods are no-ops when sound is disabled.
 */

import { useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import { soundManager } from "../utils/sound";

export function useSound() {
  const soundEnabled = useAppStore(
    (s) => s.preferences.soundEnabled ?? true
  );

  const playTick = useCallback(() => {
    if (soundEnabled) soundManager.playTick();
  }, [soundEnabled]);

  const playResult = useCallback(() => {
    if (soundEnabled) soundManager.playResult();
  }, [soundEnabled]);

  const scheduleTicks = useCallback(
    (durationMs: number): (() => void) => {
      if (soundEnabled) return soundManager.scheduleTicks(durationMs);
      // Return a no-op cleanup when sound is disabled
      return () => undefined;
    },
    [soundEnabled]
  );

  return { playTick, playResult, scheduleTicks };
}
