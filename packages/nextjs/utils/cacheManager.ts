/**
 * Cache management utilities for blockchain checkers
 * This module provides centralized cache clearing functionality
 */
import { clearNFTMintCache } from "./nftChecker";
import { clearPonziHeroCache } from "./ponziHeroChecker";
import { clearVaultStakeCache } from "./vaultStakeChecker";

/**
 * Clear all blockchain checker caches when wallet changes
 * This prevents showing cached data from previous wallet
 */
export function clearAllCheckerCaches(): void {
  console.log("🗑️ Starting to clear all blockchain checker caches...");

  // Clear NFT mint cache
  console.log("🗑️ Clearing NFT mint cache...");
  clearNFTMintCache();

  // Clear vault stake cache
  console.log("🗑️ Clearing vault stake cache...");
  clearVaultStakeCache();

  // Clear Ponzi Hero interaction cache
  console.log("🗑️ Clearing Ponzi Hero interaction cache...");
  clearPonziHeroCache();

  console.log("✅ All blockchain checker caches cleared successfully");
}

/**
 * Clear caches for a specific user
 * @param userAddress - The user address to clear caches for
 */
export function clearUserCaches(userAddress: string): void {
  // Clear NFT mint cache for user
  clearNFTMintCache(userAddress as any);

  // Clear vault stake cache for user
  clearVaultStakeCache(userAddress as any);

  // Clear Ponzi Hero interaction cache for user
  clearPonziHeroCache(userAddress as any);

  console.log(`🗑️ Cleared all caches for user ${userAddress}`);
}
