import { BLOCK_RANGE, CONTRACT_ADDRESSES, NETWORK_CONFIG, RETRY_CONFIG, START_BLOCK } from "./constants";
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

// QuestNFT contract address
const QUEST_NFT_ADDRESS = CONTRACT_ADDRESSES.QUEST_NFT;

// Types for NFT minting interactions
export interface NFTMintInteraction {
  transactionHash: string;
  blockNumber: bigint;
  from: Address;
  to: Address;
  tokenId: bigint;
}

// Cache for storing results to prevent duplicate calls
const mintCache = new Map<string, NFTMintInteraction[]>();

// Create provider instance
const createProvider = () => {
  return createPublicClient({
    chain: STATUS_SEPOLIA_CHAIN,
    transport: http("https://public.sepolia.rpc.status.network"),
  });
};

/**
 * Check if a user has minted QuestNFT tokens
 * @param userAddress - The address to check for NFT mints
 * @returns Promise<NFTMintInteraction[]> - Array of mint interactions found
 */
export async function checkUserNFTMints(userAddress: Address): Promise<NFTMintInteraction[]> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  // Check cache first
  const cacheKey = userAddress.toLowerCase();
  if (mintCache.has(cacheKey)) {
    console.log(`📋 Using cached NFT mint interactions for ${userAddress}`);
    return mintCache.get(cacheKey)!;
  }

  const provider = createProvider();

  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    const searchRange = BLOCK_RANGE.NFT_MINT_SEARCH_RANGE; // Use constant for search range
    const fromBlock = currentBlock > searchRange ? currentBlock - searchRange : START_BLOCK;

    console.log(`🔍 Checking NFT mints for ${userAddress}`);
    console.log(`📊 Searching blocks: ${fromBlock} to ${currentBlock} (from current block backwards)`);

    // Get Transfer events from zero address (minting) to user
    const transferLogs = await provider.getLogs({
      address: QUEST_NFT_ADDRESS,
      fromBlock,
      toBlock: "latest",
      event: {
        type: "event",
        name: "Transfer",
        inputs: [
          { name: "from", type: "address", indexed: true },
          { name: "to", type: "address", indexed: true },
          { name: "tokenId", type: "uint256", indexed: true },
        ],
        anonymous: false,
      },
      args: {
        from: "0x0000000000000000000000000000000000000000",
        to: userAddress,
      },
    });

    console.log(`📋 Found ${transferLogs.length} total Transfer logs from zero address to user`);

    // Convert Transfer logs to mint interaction format
    const userMintInteractions: NFTMintInteraction[] = transferLogs.map((log: any) => ({
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
      from: "0x0000000000000000000000000000000000000000" as Address,
      to: userAddress,
      tokenId: BigInt(log.topics[3]), // tokenId is in topics[3]
    }));

    console.log(`✅ Found ${userMintInteractions.length} NFT mint interactions by user`);

    // Cache the results
    mintCache.set(cacheKey, userMintInteractions);

    return userMintInteractions;
  } catch (error) {
    console.error("❌ Error checking NFT mint interactions:", error);
    throw error;
  }
}

/**
 * Check if a user has minted QuestNFT tokens with retry logic for recent transactions
 * @param userAddress - The address to check for NFT mints
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 2000)
 * @returns Promise<boolean> - True if user has minted, false otherwise
 */
export async function hasUserMintedNFT(
  userAddress: Address,
  maxRetries: number = RETRY_CONFIG.MAX_RETRIES,
  delayMs: number = RETRY_CONFIG.RETRY_DELAY_MS,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 NFT verification attempt ${attempt}/${maxRetries} for ${userAddress}`);

      const mints = await checkUserNFTMints(userAddress);

      if (mints.length > 0) {
        console.log(`✅ Found ${mints.length} NFT mints on attempt ${attempt}`);
        return true;
      }

      // If no mints found and this is not the last attempt, wait and retry
      if (attempt < maxRetries) {
        console.log(`⏳ No mints found, waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`❌ Error on attempt ${attempt}:`, error);

      // If this is not the last attempt, wait and retry
      if (attempt < maxRetries) {
        console.log(`⏳ Error occurred, waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  console.log(`❌ No NFT mints found after ${maxRetries} attempts`);
  return false;
}

/**
 * Get the latest NFT mint interaction for a user
 * @param userAddress - The address to check for NFT mints
 * @returns Promise<NFTMintInteraction | null> - Latest mint interaction or null
 */
export async function getLatestNFTMint(userAddress: Address): Promise<NFTMintInteraction | null> {
  try {
    const mints = await checkUserNFTMints(userAddress);
    if (mints.length === 0) {
      return null;
    }

    // Sort by block number (descending) to get the latest
    return mints.sort((a, b) => Number(b.blockNumber - a.blockNumber))[0];
  } catch (error) {
    console.error("Error getting latest NFT mint interaction:", error);
    return null;
  }
}

/**
 * Clear the NFT mint cache for a specific user or all users
 * @param userAddress - Optional user address to clear specific cache entry
 */
export function clearNFTMintCache(userAddress?: Address): void {
  if (userAddress) {
    const cacheKey = userAddress.toLowerCase();
    mintCache.delete(cacheKey);
    console.log(`🗑️ Cleared NFT mint cache for ${userAddress}`);
  } else {
    mintCache.clear();
    console.log(`🗑️ Cleared all NFT mint cache entries`);
  }
}
