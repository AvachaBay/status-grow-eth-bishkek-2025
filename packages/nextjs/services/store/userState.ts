import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuestProgress {
  id: number;
  completed: boolean;
  completedAt?: number;
  xpEarned: number;
}

export interface UserState {
  // User identification
  walletAddress: string | null;

  // Quest progress
  questProgress: QuestProgress[];

  // XP and leveling
  totalXP: number;
  level: number;
  questCompletionPercentage: number;

  // Timestamps
  lastUpdated: number;
  createdAt: number;

  // Actions
  setWalletAddress: (address: string | null) => void;
  updateQuestProgress: (questId: number, completed: boolean, xpEarned: number) => void;
  resetUserState: () => void;
  calculateStats: () => void;
}

const initialQuestProgress: QuestProgress[] = [
  { id: 1, completed: false, xpEarned: 0 },
  { id: 2, completed: false, xpEarned: 0 },
  { id: 3, completed: false, xpEarned: 0 },
  { id: 4, completed: false, xpEarned: 0 },
  { id: 5, completed: false, xpEarned: 0 },
  { id: 6, completed: false, xpEarned: 0 },
  { id: 7, completed: false, xpEarned: 0 },
];

const XP_PER_LEVEL = 100; // XP required to level up

export const useUserState = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      walletAddress: null,
      questProgress: initialQuestProgress,
      totalXP: 0,
      level: 1,
      questCompletionPercentage: 0,
      lastUpdated: Date.now(),
      createdAt: Date.now(),

      // Actions
      setWalletAddress: (address: string | null) => {
        set({ walletAddress: address, lastUpdated: Date.now() });
      },

      updateQuestProgress: (questId: number, completed: boolean, xpEarned: number) => {
        const state = get();
        const updatedProgress = state.questProgress.map(quest =>
          quest.id === questId
            ? {
                ...quest,
                completed,
                xpEarned: completed ? xpEarned : 0,
                completedAt: completed ? Date.now() : undefined,
              }
            : quest,
        );

        const newTotalXP = updatedProgress.reduce((total, quest) => total + quest.xpEarned, 0);
        const completedQuests = updatedProgress.filter(quest => quest.completed).length;
        const completionPercentage = (completedQuests / updatedProgress.length) * 100;
        const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;

        set({
          questProgress: updatedProgress,
          totalXP: newTotalXP,
          level: newLevel,
          questCompletionPercentage: completionPercentage,
          lastUpdated: Date.now(),
        });
      },

      resetUserState: () => {
        set({
          walletAddress: null,
          questProgress: initialQuestProgress,
          totalXP: 0,
          level: 1,
          questCompletionPercentage: 0,
          lastUpdated: Date.now(),
          createdAt: Date.now(),
        });
      },

      calculateStats: () => {
        const state = get();
        const completedQuests = state.questProgress.filter(quest => quest.completed).length;
        const completionPercentage = (completedQuests / state.questProgress.length) * 100;
        const newLevel = Math.floor(state.totalXP / XP_PER_LEVEL) + 1;

        set({
          questCompletionPercentage: completionPercentage,
          level: newLevel,
          lastUpdated: Date.now(),
        });
      },
    }),
    {
      name: "user-quest-state", // unique name for localStorage
      partialize: state => ({
        walletAddress: state.walletAddress,
        questProgress: state.questProgress,
        totalXP: state.totalXP,
        level: state.level,
        questCompletionPercentage: state.questCompletionPercentage,
        lastUpdated: state.lastUpdated,
        createdAt: state.createdAt,
      }),
    },
  ),
);
