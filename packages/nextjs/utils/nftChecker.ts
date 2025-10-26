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

// QuestNFT contract address (from deployedContracts.ts)
const QUEST_NFT_ADDRESS = "0xf4432bAbc32afAcCeaf76afC9a1B2a9D3D55BAa8" as const;

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
    // Get recent block number
    const blockNumber = await provider.getBlockNumber();
    const fromBlock = blockNumber - 20000n; // Check last ~20k blocks

    console.log(`🔍 Checking NFT mints for ${userAddress}`);
    console.log(`📊 Searching blocks: ${fromBlock} to ${blockNumber}`);

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
 * Check if a user has minted QuestNFT tokens (boolean result)
 * @param userAddress - The address to check for NFT mints
 * @returns Promise<boolean> - True if user has minted, false otherwise
 */
export async function hasUserMintedNFT(userAddress: Address): Promise<boolean> {
  try {
    const mints = await checkUserNFTMints(userAddress);
    return mints.length > 0;
  } catch (error) {
    console.error("Error checking if user has minted NFT:", error);
    return false;
  }
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
