import { type Address, createPublicClient, http } from "viem";

// Status Sepolia network configuration
const STATUS_SEPOLIA_CHAIN = {
  id: 1660990954,
  name: "Status Sepolia",
  network: "statusSepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://public.sepolia.rpc.status.network"] },
    public: { http: ["https://public.sepolia.rpc.status.network"] },
  },
  blockExplorers: {
    default: { name: "StatusScan", url: "https://sepoliascan.status.network" },
  },
} as const;

// Ponzi-Hero Player contract addresses
const PONZI_HERO_PROXY = "0xdeFa3b4431C0570225460B127d16594FE3D4Dfe6" as const;
const PONZI_HERO_IMPLEMENTATION = "0x908b6e3aFD83633bbFB71Fb73a2bEc7972327FDd" as const;

// Optimized start block - only check recent blocks for better performance
const OPTIMIZED_START_BLOCK = 11750000n; // Much more recent start block

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
const interactionCache = new Map<string, PonziHeroInteraction[]>();

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

  // Check cache first
  const cacheKey = userAddress.toLowerCase();
  if (interactionCache.has(cacheKey)) {
    console.log(`📋 Using cached Ponzi-Hero interactions for ${userAddress}`);
    return interactionCache.get(cacheKey)!;
  }

  const provider = createProvider();

  try {
    // Get recent block number
    const blockNumber = await provider.getBlockNumber();
    const fromBlock = OPTIMIZED_START_BLOCK; // Use optimized start block for better performance

    console.log(`🔍 Checking Ponzi-Hero interactions for ${userAddress}`);
    console.log(`📊 Searching blocks: ${fromBlock} to ${blockNumber}`);

    // Get all logs from the Ponzi-Hero proxy contract to find transactions
    const logs = await provider.getLogs({
      address: PONZI_HERO_PROXY,
      fromBlock,
      toBlock: "latest",
    });

    console.log(`📋 Found ${logs.length} total logs from Ponzi-Hero contract`);

    // Check each transaction to see if it's from our user
    const userInteractions: PonziHeroInteraction[] = [];

    for (const log of logs) {
      try {
        const tx = await provider.getTransaction({ hash: log.transactionHash });

        if (
          tx.from.toLowerCase() === userAddress.toLowerCase() &&
          tx.to &&
          (tx.to.toLowerCase() === PONZI_HERO_PROXY.toLowerCase() ||
            tx.to.toLowerCase() === PONZI_HERO_IMPLEMENTATION.toLowerCase())
        ) {
          userInteractions.push({
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            from: tx.from,
            to: tx.to,
            input: tx.input,
            methodId: tx.input.slice(0, 10),
          });

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

    // Cache the results
    interactionCache.set(cacheKey, userInteractions);

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
