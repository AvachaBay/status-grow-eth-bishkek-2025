import { BLOCK_RANGE, CONTRACT_ADDRESSES, NETWORK_CONFIG, START_BLOCK } from "./constants";
import { type Address, createPublicClient, http, parseAbiItem } from "viem";

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

// Contract addresses from constants
const STAKE_MANAGER_PROXY_ADDRESS = CONTRACT_ADDRESSES.STAKE_MANAGER_PROXY;
const MINIMUM_STAKE_AMOUNT = 100n * 10n ** 18n; // 100 SNT in wei

// Use START_BLOCK from constants for consistency

// Types for vault stake transactions
export interface VaultStakeTransaction {
  transactionHash: string;
  blockNumber: bigint;
  from: Address;
  to: Address;
  input: string;
  methodId: string;
  stakeAmount: bigint;
  lockPeriod: bigint;
}

// Cache for storing results to prevent duplicate calls
const stakeCache = new Map<string, VaultStakeTransaction[]>();

// Create provider instance
const createProvider = () => {
  return createPublicClient({
    chain: STATUS_SEPOLIA_CHAIN,
    transport: http("https://public.sepolia.rpc.status.network"),
  });
};

/**
 * Check if a user has staked SNT tokens in the vault contract using Staked events
 * @param userAddress - The address to check for stake events
 * @returns Promise<VaultStakeTransaction[]> - Array of stake transactions found
 */
export async function checkUserVaultStakes(userAddress: Address): Promise<VaultStakeTransaction[]> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  // Check cache first
  const cacheKey = userAddress.toLowerCase();
  if (stakeCache.has(cacheKey)) {
    console.log(`📋 Using cached vault stakes for ${userAddress}`);
    return stakeCache.get(cacheKey)!;
  }

  const provider = createProvider();

  try {
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    const searchRange = BLOCK_RANGE.VAULT_STAKE_SEARCH_RANGE; // Use constant for search range
    const fromBlock = currentBlock > searchRange ? currentBlock - searchRange : START_BLOCK;

    console.log(`🔍 Checking vault stakes for ${userAddress}`);
    console.log(`📊 Searching blocks: ${fromBlock} to ${currentBlock} (from current block backwards)`);

    // Query StakeManagerProxy logs for Staked events using proper event ABI
    const stakedLogs = await provider.getLogs({
      address: STAKE_MANAGER_PROXY_ADDRESS,
      fromBlock,
      toBlock: "latest",
      event: parseAbiItem("event Staked(address indexed vault, uint256 amount, uint256 lockPeriod)"),
    });

    console.log(`📋 Found ${stakedLogs.length} Staked events from StakeManagerProxy`);

    const userStakeTransactions: VaultStakeTransaction[] = [];

    for (const log of stakedLogs) {
      try {
        // Get the transaction to check if it's from our user
        const tx = await provider.getTransaction({ hash: log.transactionHash });

        if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
          // viem automatically decodes the event data for us
          const decodedLog = log as any; // Type assertion since viem's types are complex
          const stakeAmount = decodedLog.args.amount;
          const lockPeriod = decodedLog.args.lockPeriod;

          console.log(`🔍 Found stake event: ${stakeAmount.toString()} wei (${Number(stakeAmount) / 1e18} SNT)`);

          // Check if stake amount meets minimum requirement (100 SNT)
          if (stakeAmount >= MINIMUM_STAKE_AMOUNT) {
            console.log(`✅ Valid stake amount found: ${Number(stakeAmount) / 1e18} SNT >= 100 SNT`);

            userStakeTransactions.push({
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              from: tx.from,
              // Note: transaction recipient can be StakeManager or a proxy; we keep the original tx.to
              to: tx.to!,
              input: tx.input,
              methodId: tx.input.slice(0, 10),
              stakeAmount,
              lockPeriod,
            });

            // Early exit: if we found one valid stake, that's enough for quest completion
            console.log(`✅ Found valid vault stake (>=100 SNT), stopping search for performance`);
            break;
          } else {
            console.log(
              `❌ Insufficient stake amount: ${Number(stakeAmount) / 1e18} SNT < 100 SNT, continuing search...`,
            );
          }
        }
      } catch (error) {
        // Skip if transaction not found
        console.log(`⚠️  Skipping log ${log.logIndex}: ${error}`);
      }
    }

    console.log(`✅ Found ${userStakeTransactions.length} stake transactions by user`);

    // Cache the results
    stakeCache.set(cacheKey, userStakeTransactions);

    return userStakeTransactions;
  } catch (error) {
    console.error("❌ Error checking vault stake events:", error);
    throw error;
  }
}

/**
 * Check if a user has staked SNT tokens in the vault contract (boolean result)
 * @param userAddress - The address to check for stake transactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
 * @returns Promise<boolean> - True if user has staked, false otherwise
 */
export async function hasUserStakedInVault(userAddress: Address): Promise<boolean> {
  try {
    const stakeTransactions = await checkUserVaultStakes(userAddress);
    return stakeTransactions.length > 0;
  } catch (error) {
    console.error("Error checking if user has staked:", error);
    return false;
  }
}

/**
 * Get the latest stake transaction for a user
 * @param userAddress - The address to check for stake transactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
 * @returns Promise<VaultStakeTransaction | null> - Latest stake transaction or null
 */
export async function getLatestVaultStake(userAddress: Address): Promise<VaultStakeTransaction | null> {
  try {
    const stakeTransactions = await checkUserVaultStakes(userAddress);
    if (stakeTransactions.length === 0) {
      return null;
    }

    // Sort by block number (descending) to get the latest
    return stakeTransactions.sort((a, b) => Number(b.blockNumber - a.blockNumber))[0];
  } catch (error) {
    console.error("Error getting latest vault stake:", error);
    return null;
  }
}

/**
 * Clear the vault stake cache for a specific user or all users
 * @param userAddress - Optional user address to clear specific cache entry
 */
export function clearVaultStakeCache(userAddress?: Address): void {
  if (userAddress) {
    const cacheKey = userAddress.toLowerCase();
    stakeCache.delete(cacheKey);
    console.log(`🗑️ Cleared vault stake cache for ${userAddress}`);
  } else {
    stakeCache.clear();
    console.log(`🗑️ Cleared all vault stake cache entries`);
  }
}
