import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GameState = {
  unlocked: string[];
  phaseNumber: number;
  addUnlocked: (id: string) => void;
  nextPhase: () => void;
  resetProgress: () => void;
  resetAll: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      unlocked: [],
      phaseNumber: 0,

      addUnlocked: (id) =>
        set((state) => ({
          unlocked: [...new Set([...state.unlocked, id])],
        })),

      nextPhase: () =>
        set((state) => ({
          phaseNumber: state.phaseNumber + 1,
        })),

      // ✅ reset só progresso
      resetProgress: () =>
        set({
          phaseNumber: 0,
        }),

      // ⚠️ reset total (inclui álbum)
      resetAll: () =>
        set({
          unlocked: [],
          phaseNumber: 0,
        }),
    }),
    {
      name: "game-storage", // chave no storage
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
