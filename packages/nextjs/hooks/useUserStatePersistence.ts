import { useCallback, useEffect } from "react";
import { useStatelessModeState } from "./useStatelessMode";
import { useAccount } from "wagmi";
import { useUserState } from "~~/services/store/userState";
import { clearAllCheckerCaches } from "~~/utils/cacheManager";

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
      console.log("📥 Loading user state for wallet:", walletAddr);

      if (isStatelessMode) {
        console.log("🔄 Stateless mode: Skipping state load");
        return;
      }

      try {
        console.log("🌐 Fetching user state from API...");
        const response = await fetch(`/api/user-state?walletAddress=${walletAddr}`);

        if (response.ok) {
          const userState = await response.json();
          console.log("📦 User state loaded from API:", userState);

          // Update Zustand store with loaded state
          if (userState.questProgress && userState.questProgress.length > 0) {
            console.log("🔄 Updating quest progress from saved state...");
            userState.questProgress.forEach((quest: any) => {
              if (quest.completed) {
                console.log(`✅ Restoring completed quest ${quest.id} with ${quest.xpEarned} XP`);
                updateQuestProgress(quest.id, true, quest.xpEarned);
              }
            });
            console.log("✅ Quest progress restored from saved state");
          } else {
            console.log("ℹ️ No saved quest progress found - starting fresh");
          }
        } else {
          console.log("ℹ️ No saved state found for this wallet - starting fresh");
        }
      } catch (error) {
        console.error("❌ Failed to load user state:", error);
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
    console.log("🔄 Wallet connection change detected:", { isConnected, address });

    if (isConnected && address) {
      console.log("✅ Wallet connected:", address);

      // Clear all blockchain checker caches when wallet changes
      console.log("🗑️ Clearing all blockchain checker caches...");
      clearAllCheckerCaches();

      // Reset user state when switching wallets (address changes)
      console.log("🔄 Resetting user state for new wallet...");
      resetUserState();

      console.log("📍 Setting wallet address:", address);
      setWalletAddress(address);

      console.log("📥 Loading user state for new wallet...");
      loadUserState(address);
    } else if (!isConnected) {
      console.log("❌ Wallet disconnected");

      // Clear all blockchain checker caches when disconnecting
      console.log("🗑️ Clearing all blockchain checker caches...");
      clearAllCheckerCaches();

      console.log("📍 Clearing wallet address");
      setWalletAddress(null);

      console.log("🔄 Resetting user state...");
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
