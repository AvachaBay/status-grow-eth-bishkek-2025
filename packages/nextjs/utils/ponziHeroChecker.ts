import { BLOCK_RANGE, NETWORK_CONFIG, START_BLOCK } from "./constants";
import { type Address, createPublicClient, http } from "viem";

// Status Sepolia network configuration
const STATUS_SEPOLIA_CHAIN = {
  id: NETWORK_CONFIG.CHAIN_ID,
  name: "Status Sepolia",
  network: "statusSepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [NETWORK_CONFIG.RPC_URL] },
    public: { http: [NETWORK_CONFIG.RPC_URL] },
  },
  blockExplorers: {
    default: { name: "StatusScan", url: NETWORK_CONFIG.BLOCK_EXPLORER_URL },
  },
} as const;

// Ponzi-Hero Player contract addresses
const PONZI_HERO_PROXY = "0xdeFa3b4431C0570225460B127d16594FE3D4Dfe6" as const;
const PONZI_HERO_IMPLEMENTATION = "0x908b6e3aFD83633bbFB71Fb73a2bEc7972327FDd" as const;

// Use START_BLOCK from constants for consistency

// Types for Ponzi-Hero interactions
export interface PonziHeroInteraction {
  transactionHash: string;
  blockNumber: bigint;
  from: Address;
  to: Address;
  input: string;
  methodId: string;
}

// Cache for storing results to prevent duplicate calls
interface CacheEntry {
  interactions: PonziHeroInteraction[];
  lastCheckedBlock: bigint;
  timestamp: number;
}

const interactionCache = new Map<string, CacheEntry>();

// Create provider instance
const createProvider = () => {
  return createPublicClient({
    chain: STATUS_SEPOLIA_CHAIN,
    transport: http("https://public.sepolia.rpc.status.network"),
  });
};

/**
 * Check if a user has interacted with the Ponzi-Hero Player contract
 * @param userAddress - The address to check for interactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
 * @returns Promise<PonziHeroInteraction[]> - Array of interactions found
 */
export async function checkUserPonziHeroInteractions(userAddress: Address): Promise<PonziHeroInteraction[]> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  // Check cache first - use lastCheckedBlock as fromBlock if cached
  const cacheKey = userAddress.toLowerCase();
  const cachedEntry = interactionCache.get(cacheKey);
  const now = Date.now();

  const provider = createProvider();

  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();

    // Use lastCheckedBlock as fromBlock if we have cached data, otherwise use search range
    let fromBlock: bigint;
    if (cachedEntry) {
      fromBlock = cachedEntry.lastCheckedBlock + 1n; // Start from the block after last check
      console.log(`📋 Using cached data, searching from block ${fromBlock} to ${currentBlock}`);
    } else {
      const searchRange = BLOCK_RANGE.PONZI_HERO_SEARCH_RANGE;
      const calculatedFromBlock = currentBlock > searchRange ? currentBlock - searchRange : START_BLOCK;
      // Always use START_BLOCK if it's earlier than calculated block to include all historical transactions
      fromBlock = calculatedFromBlock > START_BLOCK ? START_BLOCK : calculatedFromBlock;
      console.log(`🔍 First time checking, searching from block ${fromBlock} to ${currentBlock}`);
    }

    // Get all logs from the Ponzi-Hero proxy contract to find transactions
    const logs = await provider.getLogs({
      address: PONZI_HERO_PROXY,
      fromBlock,
      toBlock: "latest",
    });

    console.log(`📋 Found ${logs.length} total logs from Ponzi-Hero contract`);

    // Start with cached interactions if available
    const userInteractions: PonziHeroInteraction[] = cachedEntry ? [...cachedEntry.interactions] : [];

    for (const log of logs) {
      try {
        const tx = await provider.getTransaction({ hash: log.transactionHash });

        if (
          tx.from.toLowerCase() === userAddress.toLowerCase() &&
          tx.to &&
          (tx.to.toLowerCase() === PONZI_HERO_PROXY.toLowerCase() ||
            tx.to.toLowerCase() === PONZI_HERO_IMPLEMENTATION.toLowerCase())
        ) {
          // Check if this interaction is already in our cache to avoid duplicates
          const existingInteraction = userInteractions.find(
            existing => existing.transactionHash === log.transactionHash,
          );

          if (!existingInteraction) {
            userInteractions.push({
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              from: tx.from,
              to: tx.to,
              input: tx.input,
              methodId: tx.input.slice(0, 10),
            });
            console.log(`✅ Added new Ponzi-Hero interaction to results`);
          } else {
            console.log(`📋 Interaction already in cache, skipping duplicate`);
          }

          // Early exit: if we found one interaction, that's enough for quest completion
          console.log(`✅ Found Ponzi-Hero interaction, stopping search for performance`);
          break;
        }
      } catch {
        // Skip if transaction not found
        console.log(`⚠️  Skipping log ${log.logIndex}: transaction not found`);
      }
    }

    console.log(`✅ Found ${userInteractions.length} Ponzi-Hero interactions by user`);

    // Cache the results with metadata
    interactionCache.set(cacheKey, {
      interactions: userInteractions,
      lastCheckedBlock: currentBlock,
      timestamp: now,
    });

    return userInteractions;
  } catch (error) {
    console.error("❌ Error checking Ponzi-Hero interactions:", error);
    throw error;
  }
}

/**
 * Check if a user has interacted with the Ponzi-Hero Player contract (boolean result)
 * @param userAddress - The address to check for interactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
 * @returns Promise<boolean> - True if user has interacted, false otherwise
 */
export async function hasUserInteractedWithPonziHero(userAddress: Address): Promise<boolean> {
  try {
    const interactions = await checkUserPonziHeroInteractions(userAddress);
    return interactions.length > 0;
  } catch (error) {
    console.error("Error checking if user has interacted with Ponzi-Hero:", error);
    return false;
  }
}

/**
 * Get the latest Ponzi-Hero interaction for a user
 * @param userAddress - The address to check for interactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
 * @returns Promise<PonziHeroInteraction | null> - Latest interaction or null
 */
export async function getLatestPonziHeroInteraction(userAddress: Address): Promise<PonziHeroInteraction | null> {
  try {
    const interactions = await checkUserPonziHeroInteractions(userAddress);
    if (interactions.length === 0) {
      return null;
    }

    // Sort by block number (descending) to get the latest
    return interactions.sort((a, b) => Number(b.blockNumber - a.blockNumber))[0];
  } catch (error) {
    console.error("Error getting latest Ponzi-Hero interaction:", error);
    return null;
  }
}

/**
 * Clear the Ponzi Hero interaction cache for a specific user or all users
 * @param userAddress - Optional user address to clear specific cache entry
 */
export function clearPonziHeroCache(userAddress?: Address): void {
  if (userAddress) {
    const cacheKey = userAddress.toLowerCase();
    interactionCache.delete(cacheKey);
    console.log(`🗑️ Cleared Ponzi Hero interaction cache for ${userAddress}`);
  } else {
    interactionCache.clear();
    console.log(`🗑️ Cleared all Ponzi Hero interaction cache entries`);
  }
}

/**
 * Force refresh the cache for a specific user (useful after new interactions)
 * @param userAddress - User address to refresh cache for
 */
export function refreshPonziHeroCache(userAddress: Address): void {
  const cacheKey = userAddress.toLowerCase();
  interactionCache.delete(cacheKey);
  console.log(`🔄 Refreshed Ponzi Hero interaction cache for ${userAddress}`);
}
