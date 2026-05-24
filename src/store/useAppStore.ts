import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  playerName: string;
  score: number;
  /** Highest unlocked macro-level number (1 = only Misi 1 playable) */
  currentIpasLevel: number;
  /** Progress percentage for each mission (e.g. { 1: 100, 2: 50 }) */
  missionProgress: Record<number, number>;
  setPlayerName: (name: string) => void;
  addScore: (points: number) => void;
  /** Unlocks the next macro-level (max 5) */
  unlockNextIpasLevel: () => void;
  updateMissionProgress: (level: number, progress: number) => void;
  resetSpecificLevel: (level: number) => void;
  resetStore: () => void;
}

/**
 * Capitalizes the first letter of each word in the player's name.
 */
export const capitalizeName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      playerName: '',
      score: 0,
      currentIpasLevel: 1,
      missionProgress: {},

      setPlayerName: (name: string) => {
        set({ playerName: name });
      },

      addScore: (points: number) => {
        set((state) => ({ score: state.score + points }));
      },

      unlockNextIpasLevel: () => {
        set((state) => {
          // Cap at 5 — one slot for each macro-level in the hub
          const nextLevel = Math.min(5, state.currentIpasLevel + 1);
          return { currentIpasLevel: nextLevel };
        });
      },

      updateMissionProgress: (level: number, progress: number) => {
        set((state) => ({
          missionProgress: {
            ...state.missionProgress,
            [level]: progress
          }
        }));
      },

      resetSpecificLevel: (level: number) => {
        // Reset the progress percentage without changing currentIpasLevel locks
        set((state) => ({
          missionProgress: {
            ...state.missionProgress,
            [level]: 0
          }
        }));
      },

      resetStore: () => {
        set({
          playerName: '',
          score: 0,
          currentIpasLevel: 1,
          missionProgress: {},
        });
      },
    }),
    {
      name: 'flora-fauna-app-state', // local storage key for app config
    }
  )
);
