import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Roulette, SpinResult, AppPreferences } from "../types";

interface AppStore extends AppState {
  createRoulette: (roulette: Omit<Roulette, "id" | "createdAt" | "updatedAt">) => Roulette;
  updateRoulette: (id: string, updates: Partial<Omit<Roulette, "id" | "createdAt">>) => void;
  deleteRoulette: (id: string) => void;
  pinRoulette: (id: string, pinned: boolean) => void;
  addHistory: (result: SpinResult) => void;
  clearHistory: () => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
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
      },

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
        set((state) => ({
          roulettes: state.roulettes.filter((r) => r.id !== id),
        }));
      },

      pinRoulette: (id, pinned) => {
        set((state) => ({
          roulettes: state.roulettes.map((r) =>
            r.id === id ? { ...r, isPinned: pinned, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      addHistory: (result) => {
        set((state) => ({
          history: [result, ...state.history].slice(0, 100),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },
    }),
    {
      name: "gira-app-storage",
    }
  )
);
