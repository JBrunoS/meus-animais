import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useGameStore = create(
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
