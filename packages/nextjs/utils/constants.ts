/**
 * Blockchain verification constants
 * These constants define the block ranges and parameters for blockchain verification
 */

// Start block for blockchain verification - all checkers should use this as the minimum block
export const START_BLOCK = 11713689n;

// Block range constants
export const BLOCK_RANGE = {
  // Maximum number of blocks to check in a single query
  MAX_BLOCKS_PER_QUERY: 2000n,

  // Default number of blocks to check for recent transactions
  DEFAULT_BLOCK_RANGE: 50000n,

  // Maximum number of blocks to check for historical data
  MAX_HISTORICAL_BLOCKS: 100000n,

  // Search ranges for different checkers (searching backwards from current block)
  VAULT_STAKE_SEARCH_RANGE: 10000n, // Last 10,000 blocks for vault stakes
  NFT_MINT_SEARCH_RANGE: 20000n, // Last 20,000 blocks for NFT mints
  PONZI_HERO_SEARCH_RANGE: 15000n, // Last 15,000 blocks for Ponzi Hero interactions
} as const;

// Retry configuration for blockchain verification
export const RETRY_CONFIG = {
  // Maximum number of retries for verification
  MAX_RETRIES: 3,

  // Delay between retries in milliseconds
  RETRY_DELAY_MS: 2000,

  // Maximum delay for final retry
  MAX_RETRY_DELAY_MS: 5000,
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  // Status Sepolia chain ID
  CHAIN_ID: 1660990954,

  // RPC URL for Status Sepolia
  RPC_URL: "https://public.sepolia.rpc.status.network",

  // Block explorer URL
  BLOCK_EXPLORER_URL: "https://sepoliascan.status.network",
} as const;

// Contract addresses
export const CONTRACT_ADDRESSES = {
  // QuestNFT contract address
  QUEST_NFT: "0xf4432bAbc32afAcCeaf76afC9a1B2a9D3D55BAa8" as const,

  // Vault proxy contract address for staking
  VAULT_PROXY: "0xa5a82CCfE29d7f384E9A072991a1F6182C28e575" as const,

  // Add other contract addresses here as needed
} as const;

// Event signatures for blockchain verification
export const EVENT_SIGNATURES = {
  // ERC721 Transfer event signature
  TRANSFER: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",

  // Staked event signature for vault staking
  STAKED: "0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90",

  // Add other event signatures here as needed
} as const;

// Cache management functions are available in cacheManager.ts
