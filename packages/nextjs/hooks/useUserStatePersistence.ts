import { useCallback, useEffect } from "react";
import { useStatelessModeState } from "./useStatelessMode";
import { useAccount } from "wagmi";
import { useUserState } from "~~/services/store/userState";

export const useUserStatePersistence = () => {
  const { address, isConnected } = useAccount();
  const { isStatelessMode } = useStatelessModeState();
  const {
    questProgress,
    totalXP,
    level,
    questCompletionPercentage,
    setWalletAddress,
    updateQuestProgress,
    resetUserState,
  } = useUserState();

  // Load user state from Vercel KV (disabled in stateless mode)
  const loadUserState = useCallback(
    async (walletAddr: string) => {
      if (isStatelessMode) {
        console.log("🔄 Stateless mode: Skipping state load");
        return;
      }

      try {
        const response = await fetch(`/api/user-state?walletAddress=${walletAddr}`);
        if (response.ok) {
          const userState = await response.json();

          // Update Zustand store with loaded state
          if (userState.questProgress && userState.questProgress.length > 0) {
            userState.questProgress.forEach((quest: any) => {
              if (quest.completed) {
                updateQuestProgress(quest.id, true, quest.xpEarned);
              }
            });
          }
        }
      } catch (error) {
        console.error("Failed to load user state:", error);
      }
    },
    [updateQuestProgress, isStatelessMode],
  );

  // Save user state to Vercel KV (disabled in stateless mode)
  const saveUserState = useCallback(async () => {
    if (!address) return;

    if (isStatelessMode) {
      console.log("🔄 Stateless mode: Skipping state save");
      return;
    }

    try {
      const response = await fetch("/api/user-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          questProgress,
          totalXP,
          level,
          questCompletionPercentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user state");
      }
    } catch (error) {
      console.error("Failed to save user state:", error);
    }
  }, [address, questProgress, totalXP, level, questCompletionPercentage, isStatelessMode]);

  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      loadUserState(address);
    } else if (!isConnected) {
      setWalletAddress(null);
      resetUserState();
    }
  }, [isConnected, address, setWalletAddress, loadUserState, resetUserState]);

  // Auto-save when quest progress changes
  useEffect(() => {
    if (address && questProgress.some(quest => quest.completed)) {
      const timeoutId = setTimeout(() => {
        saveUserState();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [address, questProgress, saveUserState]);

  return {
    loadUserState,
    saveUserState,
  };
};
