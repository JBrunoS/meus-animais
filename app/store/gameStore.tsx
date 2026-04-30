import { create } from 'zustand';

export const useGameStore = create((set) => ({
  unlocked: [],
  phaseNumber: 0,

  addUnlocked: (id) =>
    set((state) => ({
      unlocked: state.unlocked.includes(id)
        ? state.unlocked
        : [...state.unlocked, id],
    })),

  nextPhase: () =>
    set((state) => ({
      phaseNumber: state.phaseNumber + 1,
    })),

  resetGame: () =>
    set({
      unlocked: [],
      phaseNumber: 0,
    }),
}));