import {
  checkUserPonziHeroInteractions,
  getLatestPonziHeroInteraction,
  hasUserInteractedWithPonziHero,
} from "../utils/ponziHeroChecker";
import { createPublicClient, http } from "viem";

/**
 * Unit test for Ponzi-Hero Player checker functionality
 * Tests with known address that has Ponzi-Hero interaction: 0xb248A284756a52C7eC5Fb119648747128c1eC28b
 */
describe("Ponzi-Hero Player Checker", () => {
  const TEST_ADDRESS = "0xb248A284756a52C7eC5Fb119648747128c1eC28b" as `0x${string}`;
  const PONZI_HERO_PROXY = "0xdeFa3b4431C0570225460B127d16594FE3D4Dfe6";
  const PONZI_HERO_IMPLEMENTATION = "0x908b6e3aFD83633bbFB71Fb73a2bEc7972327FDd";
  const KNOWN_TX_HASH = "0x55b0bcf4085a1d8af24e084f08a8a4e8ef8b6d839267936cddd52f63d85ab347";

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

  test("should find Ponzi-Hero interactions using utility function", async () => {
    console.log(`Testing Ponzi-Hero checker utility for address: ${TEST_ADDRESS}`);

    try {
      // Test the utility functions
      const interactions = await checkUserPonziHeroInteractions(TEST_ADDRESS);
      const hasInteracted = await hasUserInteractedWithPonziHero(TEST_ADDRESS);
      const latestInteraction = await getLatestPonziHeroInteraction(TEST_ADDRESS);

      console.log(`Found ${interactions.length} Ponzi-Hero interactions`);
      console.log(`Has interacted: ${hasInteracted}`);
      console.log(`Latest interaction:`, latestInteraction);

      // Assertions
      expect(interactions.length).toBeGreaterThan(0);
      expect(hasInteracted).toBe(true);
      expect(latestInteraction).toBeDefined();

      // Verify the known transaction exists
      const knownTransaction = interactions.find(
        tx => tx.transactionHash.toLowerCase() === KNOWN_TX_HASH.toLowerCase(),
      );

      expect(knownTransaction).toBeDefined();
      expect(knownTransaction?.from.toLowerCase()).toBe(TEST_ADDRESS.toLowerCase());
      expect(
        knownTransaction?.to.toLowerCase() === PONZI_HERO_PROXY.toLowerCase() ||
          knownTransaction?.to.toLowerCase() === PONZI_HERO_IMPLEMENTATION.toLowerCase(),
      ).toBe(true);

      console.log("✅ Test passed - Utility functions work correctly");
      console.log("Known transaction found:", knownTransaction);
    } catch (err) {
      console.error("Error testing utility functions:", err);
      throw err;
    }
  }, 60000); // 60 second timeout for blockchain calls

  test("should verify known transaction directly", async () => {
    console.log(`Testing known transaction directly: ${KNOWN_TX_HASH}`);

    try {
      const tx = await provider.getTransaction({ hash: KNOWN_TX_HASH });

      console.log("Known transaction details:");
      console.log("From:", tx.from);
      console.log("To:", tx.to);
      console.log("Method ID:", tx.input.slice(0, 10));
      console.log("Block:", tx.blockNumber);

      // Verify this is an interaction from our test user
      const isPonziHeroInteraction =
        tx.from.toLowerCase() === TEST_ADDRESS.toLowerCase() &&
        (tx.to.toLowerCase() === PONZI_HERO_PROXY.toLowerCase() ||
          tx.to.toLowerCase() === PONZI_HERO_IMPLEMENTATION.toLowerCase());

      expect(isPonziHeroInteraction).toBe(true);

      console.log("✅ Test passed - Known Ponzi-Hero interaction verified");
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

  test("should handle addresses with no Ponzi-Hero interactions", async () => {
    const NO_INTERACTION_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

    try {
      const hasInteracted = await hasUserInteractedWithPonziHero(NO_INTERACTION_ADDRESS);
      const interactions = await checkUserPonziHeroInteractions(NO_INTERACTION_ADDRESS);

      expect(hasInteracted).toBe(false);
      expect(interactions.length).toBe(0);
      console.log("✅ Test passed - No Ponzi-Hero interactions found for zero address");
    } catch (err) {
      console.error("Error testing zero address:", err);
      throw err;
    }
  }, 60000);
});
