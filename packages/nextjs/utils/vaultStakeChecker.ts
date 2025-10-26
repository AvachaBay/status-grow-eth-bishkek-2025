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

// Contract addresses and method IDs
const VAULT_ADDRESS = "0xc13Bf1d5986D8831116E36d11b4d2AE859258C7D" as const;
const STAKE_METHOD_ID = "0x7b0472f0"; // keccak256("stake(uint256,uint256)").slice(0, 10)

// Optimized start block - only check recent blocks for better performance
const OPTIMIZED_START_BLOCK = 11750000n; // Much more recent start block

// Known test transaction for verification
const KNOWN_TEST_TX_HASH = "0xa56b54742e475577d0c802a226db2093ee31f9224ee680381dda69bb40289e13";
const KNOWN_TEST_ADDRESS = "0xb248A284756a52C7eC5Fb119648747128c1eC28b";

// Types for vault stake transactions
export interface VaultStakeTransaction {
  transactionHash: string;
  blockNumber: bigint;
  from: Address;
  to: Address;
  input: string;
  methodId: string;
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
 * Check if a user has staked SNT tokens in the vault contract
 * @param userAddress - The address to check for stake transactions
 * @param maxBlocksBack - Maximum number of blocks to search back (ignored, uses global start block)
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
    // Special case: Check known test transaction first
    if (userAddress.toLowerCase() === KNOWN_TEST_ADDRESS.toLowerCase()) {
      try {
        const knownTx = await provider.getTransaction({ hash: KNOWN_TEST_TX_HASH });

        if (
          knownTx.from.toLowerCase() === userAddress.toLowerCase() &&
          knownTx.to &&
          knownTx.to.toLowerCase() === VAULT_ADDRESS.toLowerCase() &&
          knownTx.input.startsWith(STAKE_METHOD_ID)
        ) {
          console.log(`✅ Found known test transaction for ${userAddress}`);
          return [
            {
              transactionHash: knownTx.hash,
              blockNumber: knownTx.blockNumber,
              from: knownTx.from,
              to: knownTx.to,
              input: knownTx.input,
              methodId: knownTx.input.slice(0, 10),
            },
          ];
        }
      } catch (err) {
        console.log(`⚠️  Known test transaction not found: ${err}`);
      }
    }

    // Get recent block number
    const blockNumber = await provider.getBlockNumber();
    const fromBlock = OPTIMIZED_START_BLOCK; // Use optimized start block for better performance

    console.log(`🔍 Checking vault stakes for ${userAddress}`);
    console.log(`📊 Searching blocks: ${fromBlock} to ${blockNumber}`);

    // Get all logs from the vault contract to find transactions
    const logs = await provider.getLogs({
      address: VAULT_ADDRESS,
      fromBlock,
      toBlock: "latest",
    });

    console.log(`📋 Found ${logs.length} total logs from vault contract`);

    // Check each transaction to see if it's from our user with stake method
    const userStakeTransactions: VaultStakeTransaction[] = [];

    for (const log of logs) {
      try {
        const tx = await provider.getTransaction({ hash: log.transactionHash });

        if (
          tx.from.toLowerCase() === userAddress.toLowerCase() &&
          tx.to &&
          tx.to.toLowerCase() === VAULT_ADDRESS.toLowerCase() &&
          tx.input.startsWith(STAKE_METHOD_ID)
        ) {
          userStakeTransactions.push({
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            from: tx.from,
            to: tx.to,
            input: tx.input,
            methodId: tx.input.slice(0, 10),
          });

          // Early exit: if we found one stake, that's enough for quest completion
          console.log(`✅ Found vault stake, stopping search for performance`);
          break;
        }
      } catch {
        // Skip if transaction not found
        console.log(`⚠️  Skipping log ${log.logIndex}: transaction not found`);
      }
    }

    console.log(`✅ Found ${userStakeTransactions.length} stake transactions by user`);

    // Cache the results
    stakeCache.set(cacheKey, userStakeTransactions);

    return userStakeTransactions;
  } catch (error) {
    console.error("❌ Error checking vault stake transactions:", error);
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
