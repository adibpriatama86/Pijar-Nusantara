import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedItems: string[];
  score: number;
  isMuted: boolean;
  completeItem: (id: string, points: number) => boolean; // returns true if newly completed
  addScore: (points: number) => void;
  toggleMute: () => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedItems: [],
      score: 0,
      isMuted: false,

      completeItem: (id: string, points: number) => {
        const { completedItems, score } = get();
        if (completedItems.includes(id)) {
          return false;
        }
        set({
          completedItems: [...completedItems, id],
          score: score + points,
        });
        return true;
      },

      addScore: (points: number) => {
        set((state) => ({ score: state.score + points }));
      },

      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },

      resetProgress: () => {
        set({
          completedItems: [],
          score: 0,
        });
      },
    }),
    {
      name: 'flora-fauna-explorer-progress', // local storage key
    }
  )
);
