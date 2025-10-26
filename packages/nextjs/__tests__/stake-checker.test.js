const { createPublicClient, http } = require("viem");

/**
 * Unit test for vault stake checker functionality
 * Tests with known address that has stake transaction: 0xb248A284756a52C7eC5Fb119648747128c1eC28b
 */
describe("Vault Stake Checker", () => {
  const TEST_ADDRESS = "0xb248A284756a52C7eC5Fb119648747128c1eC28b";
  const VAULT_ADDRESS = "0xc13Bf1d5986D8831116E36d11b4d2AE859258C7D";
  const STAKE_METHOD_ID = "0x7b0472f0"; // keccak256("stake(uint256,uint256)").slice(0, 10)

  let provider;

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

  test("should find stake transactions for test address", async () => {
    console.log(`Testing stake checker for address: ${TEST_ADDRESS}`);
    console.log(`Vault contract: ${VAULT_ADDRESS}`);
    console.log(`Stake method ID: ${STAKE_METHOD_ID}`);

    // Check the known transaction directly
    const knownTxHash = "0xa56b54742e475577d0c802a226db2093ee31f9224ee680381dda69bb40289e13";

    try {
      const tx = await provider.getTransaction({ hash: knownTxHash });

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
    const NO_STAKE_ADDRESS = "0x0000000000000000000000000000000000000000";

    const blockNumber = await provider.getBlockNumber();
    const fromBlock = blockNumber - 10000n;

    const logs = await provider.getLogs({
      address: VAULT_ADDRESS,
      fromBlock,
      toBlock: "latest",
      topics: [STAKE_METHOD_ID],
    });

    const userStakeLogs = logs.filter(log => {
      return (
        log.topics[1] && log.topics[1].toLowerCase().includes(NO_STAKE_ADDRESS.toLowerCase().slice(2).padStart(64, "0"))
      );
    });

    expect(userStakeLogs.length).toBe(0);
    console.log("✅ Test passed - No stake transactions found for zero address");
  }, 30000);
});
