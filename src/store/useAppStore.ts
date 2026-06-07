import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Roulette, SpinResult, AppPreferences } from "../types";
import { getTodayKey } from "../utils/date";

interface AppStore extends AppState {
  // ── Roletas ──────────────────────────────────────────────────────────────
  createRoulette: (roulette: Omit<Roulette, "id" | "createdAt" | "updatedAt">) => Roulette;
  updateRoulette: (id: string, updates: Partial<Omit<Roulette, "id" | "createdAt">>) => void;
  deleteRoulette: (id: string) => void;
  pinRoulette: (id: string, pinned: boolean) => void;
  // ── Histórico ────────────────────────────────────────────────────────────
  addHistory: (result: SpinResult) => void;
  clearHistory: () => void;
  // ── Preferências ─────────────────────────────────────────────────────────
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  setLastActiveRouletteId: (rouletteId: string) => void;
  // ── Destino do Dia ───────────────────────────────────────────────────────
  startDailyDestiny: (rouletteId?: string) => void;
  completeDailyDestiny: (resultId: string) => void;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      roulettes: [],
      history: [],
      dailyDestiny: undefined,
      preferences: {
        defaultPersonality: "cute",
        hasCompletedOnboarding: false,
        soundEnabled: true,
      },

      // ── Roletas ────────────────────────────────────────────────────────

      createRoulette: (data) => {
        const now = new Date().toISOString();
        const roulette: Roulette = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ roulettes: [roulette, ...state.roulettes] }));
        return roulette;
      },

      updateRoulette: (id, updates) => {
        set((state) => ({
          roulettes: state.roulettes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteRoulette: (id) => {
        set((state) => {
          const wasActive = state.preferences.lastActiveRouletteId === id;
          return {
            roulettes: state.roulettes.filter((r) => r.id !== id),
            preferences: wasActive
              ? { ...state.preferences, lastActiveRouletteId: undefined }
              : state.preferences,
          };
        });
      },

      pinRoulette: (id, pinned) => {
        set((state) => ({
          roulettes: state.roulettes.map((r) =>
            r.id === id ? { ...r, isPinned: pinned, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      // ── Histórico ──────────────────────────────────────────────────────

      addHistory: (result) => {
        set((state) => ({
          history: [result, ...state.history].slice(0, 100),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      // ── Preferências ───────────────────────────────────────────────────

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      setLastActiveRouletteId: (rouletteId) => {
        set((state) => ({
          preferences: { ...state.preferences, lastActiveRouletteId: rouletteId },
        }));
      },

      // ── Destino do Dia ─────────────────────────────────────────────────

      startDailyDestiny: (rouletteId) => {
        set({
          dailyDestiny: {
            date: getTodayKey(),
            rouletteId,
            resultId: undefined,
            completed: false,
          },
        });
      },

      completeDailyDestiny: (resultId) => {
        set((state) => ({
          dailyDestiny: state.dailyDestiny
            ? { ...state.dailyDestiny, resultId, completed: true }
            : { date: getTodayKey(), resultId, completed: true },
        }));
      },
    }),
    {
      name: "gira-app-storage",
    }
  )
);
