import { checkUserVaultStakes, getLatestVaultStake, hasUserStakedInVault } from "../vaultStakeChecker";
import { createPublicClient, http } from "viem";

/**
 * Unit test for vault stake checker functionality
 * Tests with known address that has stake transaction: 0xb248A284756a52C7eC5Fb119648747128c1eC28b
 */
describe("Vault Stake Checker", () => {
  const TEST_ADDRESS = "0xb248A284756a52C7eC5Fb119648747128c1eC28b" as `0x${string}`;
  const VAULT_ADDRESS = "0xc13Bf1d5986D8831116E36d11b4d2AE859258C7D";
  const STAKE_METHOD_ID = "0x7b0472f0"; // keccak256("stake(uint256,uint256)").slice(0, 10)
  const KNOWN_TX_HASH = "0xa56b54742e475577d0c802a226db2093ee31f9224ee680381dda69bb40289e13";

  let provider: any;

  beforeAll(() => {
    // Create Status Sepolia provider
    provider = createPublicClient({
      chain: {
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
      },
      transport: http("https://public.sepolia.rpc.status.network"),
    });
  });

  test("should find stake transactions using utility function", async () => {
    console.log(`Testing vault stake checker utility for address: ${TEST_ADDRESS}`);

    try {
      // Test the utility functions
      const stakeTransactions = await checkUserVaultStakes(TEST_ADDRESS);
      const hasStaked = await hasUserStakedInVault(TEST_ADDRESS);
      const latestStake = await getLatestVaultStake(TEST_ADDRESS);

      console.log(`Found ${stakeTransactions.length} stake transactions`);
      console.log(`Has staked: ${hasStaked}`);
      console.log(`Latest stake:`, latestStake);

      // Assertions
      expect(stakeTransactions.length).toBeGreaterThan(0);
      expect(hasStaked).toBe(true);
      expect(latestStake).toBeDefined();

      // Verify the known transaction exists
      const knownTransaction = stakeTransactions.find(
        tx => tx.transactionHash.toLowerCase() === KNOWN_TX_HASH.toLowerCase(),
      );

      expect(knownTransaction).toBeDefined();
      expect(knownTransaction?.from.toLowerCase()).toBe(TEST_ADDRESS.toLowerCase());
      expect(knownTransaction?.to.toLowerCase()).toBe(VAULT_ADDRESS.toLowerCase());
      expect(knownTransaction?.methodId).toBe(STAKE_METHOD_ID);

      console.log("✅ Test passed - Utility functions work correctly");
      console.log("Known transaction found:", knownTransaction);
    } catch (err) {
      console.error("Error testing utility functions:", err);
      throw err;
    }
  }, 30000); // 30 second timeout for blockchain calls

  test("should verify known transaction directly", async () => {
    console.log(`Testing known transaction directly: ${KNOWN_TX_HASH}`);

    try {
      const tx = await provider.getTransaction({ hash: KNOWN_TX_HASH });

      console.log("Known transaction details:");
      console.log("From:", tx.from);
      console.log("To:", tx.to);
      console.log("Method ID:", tx.input.slice(0, 10));
      console.log("Block:", tx.blockNumber);

      // Verify this is a stake transaction from our test user
      const isStakeTransaction =
        tx.from.toLowerCase() === TEST_ADDRESS.toLowerCase() &&
        tx.to.toLowerCase() === VAULT_ADDRESS.toLowerCase() &&
        tx.input.startsWith(STAKE_METHOD_ID);

      expect(isStakeTransaction).toBe(true);

      console.log("✅ Test passed - Known stake transaction verified");
      console.log("Transaction details:", {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        methodId: tx.input.slice(0, 10),
        blockNumber: tx.blockNumber,
      });
    } catch (err) {
      console.error("Error getting known transaction:", err);
      throw err;
    }
  }, 30000); // 30 second timeout for blockchain calls

  test("should handle addresses with no stake transactions", async () => {
    const NO_STAKE_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

    try {
      const hasStaked = await hasUserStakedInVault(NO_STAKE_ADDRESS);
      const stakeTransactions = await checkUserVaultStakes(NO_STAKE_ADDRESS);

      expect(hasStaked).toBe(false);
      expect(stakeTransactions.length).toBe(0);
      console.log("✅ Test passed - No stake transactions found for zero address");
    } catch (err) {
      console.error("Error testing zero address:", err);
      throw err;
    }
  }, 30000);
});
