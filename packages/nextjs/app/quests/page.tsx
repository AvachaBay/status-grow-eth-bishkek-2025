"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Address, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { getLatestPonziHeroInteraction, hasUserInteractedWithPonziHero } from "~~/utils/ponziHeroChecker";
import { checkUserVaultStakes, getLatestVaultStake } from "~~/utils/vaultStakeChecker";

const QuestsPage: NextPage = () => {
  const { address } = useAccount();

  const { data: sntBalance } = useScaffoldReadContract({
    contractName: "SNT",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: vaultBalance } = useScaffoldReadContract({
    contractName: "AppVault",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: questNftBalance } = useScaffoldReadContract({
    contractName: "QuestNFT",
    functionName: "balanceOf",
    args: [address],
  });

  // Check if user actually called the mint function on our QuestNFT contract
  useScaffoldEventHistory({
    contractName: "QuestNFT",
    eventName: "Transfer",
    fromBlock: 0n,
    filters: {
      to: address,
    },
  });

  // Refs for singleton pattern
  const mintCheckedRef = useRef<string | null>(null);
  const vaultCheckedRef = useRef<string | null>(null);
  const ponziHeroCheckedRef = useRef<string | null>(null);

  // State for tracking user's mint transactions
  const [userMintTransactions, setUserMintTransactions] = useState<any[]>([]);
  const [isCheckingMints, setIsCheckingMints] = useState(false);

  // State for tracking user's vault stake transactions
  const [isCheckingVaultStakes, setIsCheckingVaultStakes] = useState(false);
  const [hasStakedInVault, setHasStakedInVault] = useState(false);
  const [latestStakeTransaction, setLatestStakeTransaction] = useState<any>(null);

  // State for tracking user's Ponzi-Hero interactions
  const [hasInteractedWithPonziHero, setHasInteractedWithPonziHero] = useState(false);
  const [isCheckingPonziHero, setIsCheckingPonziHero] = useState(false);
  const [ponziHeroInteraction, setPonziHeroInteraction] = useState<any>(null);

  // QuestNFT contract address
  const QUEST_NFT_ADDRESS = "0xf4432bAbc32afAcCeaf76afC9a1B2a9D3D55BAa8";

  // Convert balances to bigint
  const snt = (sntBalance as unknown as bigint) || 0n;
  const staked = (vaultBalance as unknown as bigint) || 0n;
  const questNfts = (questNftBalance as unknown as bigint) || 0n;
  const hasSnt = snt > 0n;

  // Check if user has transactions calling mint method on our contract
  useEffect(() => {
    const checkUserMintTransactions = async () => {
      if (!address || mintCheckedRef.current === address) return;

      console.log("🔍 Checking mint transactions for:", address);
      setIsCheckingMints(true);
      mintCheckedRef.current = address;

      try {
        // Get recent blocks to search through
        const { createPublicClient } = await import("viem");
        const provider = createPublicClient({
          chain: {
            id: 1660990954,
            name: "Status Sepolia",
            network: "statusSepolia",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: {
              default: { http: ["https://public.sepolia.rpc.status.network"] },
              public: { http: ["https://public.sepolia.rpc.status.network"] },
            },
            blockExplorers: { default: { name: "StatusScan", url: "https://sepoliascan.status.network" } },
          },
          transport: (await import("viem")).http("https://public.sepolia.rpc.status.network"),
        });

        // Get recent block number
        const blockNumber = await provider.getBlockNumber();
        const fromBlock = blockNumber - 20000n; // Check last ~20k blocks to ensure we catch older mints

        // Get Transfer events from zero address (minting) to user
        const transferLogs = await provider.getLogs({
          address: QUEST_NFT_ADDRESS as `0x${string}`,
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
            to: address,
          },
        });

        console.log(`📋 Found ${transferLogs.length} total Transfer logs from zero address to user`);

        // Convert Transfer logs to mint transaction format
        const userMintLogs = transferLogs.map((log: any) => ({
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          logIndex: log.logIndex,
          topics: log.topics,
        }));

        console.log("✅ Found mint transactions:", userMintLogs.length);
        console.log("🔍 User address:", address);
        console.log("🔍 QuestNFT Balance:", questNfts.toString());

        // Early exit: if we found one mint, that's enough for quest completion
        if (userMintLogs.length > 0) {
          console.log("✅ Found mint transaction, quest complete");
        } else {
          console.log("❌ No mint transactions found for user");
        }
        setUserMintTransactions(userMintLogs);
      } catch (error) {
        console.error("Error checking mint transactions:", error);
        setUserMintTransactions([]);
      } finally {
        setIsCheckingMints(false);
      }
    };

    checkUserMintTransactions();
  }, [address, questNfts]);

  // Check if user has staked in vault using the utility function
  useEffect(() => {
    const checkUserVaultStakesAsync = async () => {
      if (!address || vaultCheckedRef.current === address) return;

      console.log("🔍 Checking vault stakes for:", address);
      setIsCheckingVaultStakes(true);
      vaultCheckedRef.current = address;

      try {
        // Use the utility function to check vault stakes
        const stakeTransactions = await checkUserVaultStakes(address as `0x${string}`);
        const latestStake = await getLatestVaultStake(address as `0x${string}`);

        console.log("✅ Vault stake result:", {
          hasStaked: stakeTransactions.length > 0,
          transactions: stakeTransactions.length,
        });
        setHasStakedInVault(stakeTransactions.length > 0);
        setLatestStakeTransaction(latestStake);
      } catch (error) {
        console.error("Error checking vault stake transactions:", error);
        setHasStakedInVault(false);
        setLatestStakeTransaction(null);
      } finally {
        setIsCheckingVaultStakes(false);
      }
    };

    checkUserVaultStakesAsync();
  }, [address]);

  // Check if user has interacted with Ponzi-Hero using the utility function
  useEffect(() => {
    const checkUserPonziHeroInteractionsAsync = async () => {
      if (!address || ponziHeroCheckedRef.current === address) return;

      console.log("🔍 Checking Ponzi-Hero interactions for:", address);
      setIsCheckingPonziHero(true);
      ponziHeroCheckedRef.current = address;

      try {
        // Use the utility function to check Ponzi-Hero interactions
        const hasInteracted = await hasUserInteractedWithPonziHero(address as `0x${string}`);
        const latestInteraction = await getLatestPonziHeroInteraction(address as `0x${string}`);

        console.log("✅ Ponzi-Hero result:", { hasInteracted, interaction: latestInteraction });
        setHasInteractedWithPonziHero(hasInteracted);
        setPonziHeroInteraction(latestInteraction);
      } catch (error) {
        console.error("Error checking Ponzi-Hero interactions:", error);
        setHasInteractedWithPonziHero(false);
        setPonziHeroInteraction(null);
      } finally {
        setIsCheckingPonziHero(false);
      }
    };

    checkUserPonziHeroInteractionsAsync();
  }, [address]);

  // Reset check refs when address changes
  useEffect(() => {
    if (address) {
      mintCheckedRef.current = null;
      vaultCheckedRef.current = null;
      ponziHeroCheckedRef.current = null;
    }
  }, [address]);

  // Check if user actually called mint() method (not just received NFTs)
  const hasMintedQuestNft = userMintTransactions.length > 0;

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 text-center max-w-3xl">
        <h1 className="text-4xl font-bold">Quests</h1>
        <p className="mt-2">Complete tasks to earn progress. Network: Status Sepolia.</p>
      </div>

      {!address ? (
        <div className="flex flex-col justify-center items-center bg-base-300 w-full mt-8 px-8 pt-6 pb-12">
          <p className="text-xl font-bold">Connect your wallet to check quest status.</p>
          <RainbowKitCustomConnectButton />
        </div>
      ) : (
        <div className="w-full max-w-3xl mt-8 grid grid-cols-1 gap-4">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Quest #1: Hold SNT</h2>
              <div>
                Address: <Address address={address} />
              </div>
              <div>
                Status:{" "}
                <span className={hasSnt ? "text-green-500" : "text-error"}>{hasSnt ? "Complete" : "Incomplete"}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Quest #2: Ponzi-Hero Player</h2>
              <div>Interact with the Ponzi-Hero game contract to complete this quest.</div>
              {isCheckingPonziHero && (
                <div className="text-sm text-gray-500">Checking Ponzi-Hero transaction history...</div>
              )}
              {ponziHeroInteraction && (
                <div className="text-sm text-gray-600">
                  Latest interaction: Block {ponziHeroInteraction.blockNumber?.toString()}
                </div>
              )}
              <div>
                Status:{" "}
                <span className={hasInteractedWithPonziHero ? "text-green-500" : "text-error"}>
                  {hasInteractedWithPonziHero ? "Complete" : "Incomplete"}
                </span>
              </div>

              {/* Debug Info with Explorer Link */}
              {ponziHeroInteraction && (
                <div className="mt-4 p-3 bg-base-300 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">🔍 Debug Info - Interaction Found:</h4>
                  <div className="text-xs bg-base-100 p-2 rounded">
                    <div className="font-mono">
                      <div>
                        <strong>Hash:</strong> {ponziHeroInteraction.transactionHash}
                      </div>
                      <div>
                        <strong>Block:</strong> {ponziHeroInteraction.blockNumber?.toString()}
                      </div>
                      <div>
                        <strong>Method:</strong> {ponziHeroInteraction.methodId}
                      </div>
                      <div>
                        <strong>To:</strong> {ponziHeroInteraction.to}
                      </div>
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://sepoliascan.status.network/tx/${ponziHeroInteraction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-xs"
                      >
                        🔗 View on StatusScan
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Quest #3: Stake in App Vault</h2>
              <div>Vault Balance: {staked ? formatUnits(staked, 18) : "0"} SNT</div>
              <div>Has staked: {hasStakedInVault ? "Yes" : "No"}</div>
              {isCheckingVaultStakes && (
                <div className="text-sm text-gray-500">Checking vault transaction history...</div>
              )}
              {latestStakeTransaction && (
                <div className="text-sm text-gray-600">
                  Latest stake: Block {latestStakeTransaction.blockNumber?.toString()}
                </div>
              )}
              <div>
                Status:{" "}
                <span className={hasStakedInVault ? "text-green-500" : "text-error"}>
                  {hasStakedInVault ? "Complete" : "Incomplete"}
                </span>
              </div>

              {/* Debug Info with Explorer Link */}
              {latestStakeTransaction && (
                <div className="mt-4 p-3 bg-base-300 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">🔍 Debug Info - Stake Transaction Found:</h4>
                  <div className="text-xs bg-base-100 p-2 rounded">
                    <div className="font-mono">
                      <div>
                        <strong>Hash:</strong> {latestStakeTransaction.transactionHash}
                      </div>
                      <div>
                        <strong>Block:</strong> {latestStakeTransaction.blockNumber?.toString()}
                      </div>
                      <div>
                        <strong>Method:</strong> {latestStakeTransaction.methodId}
                      </div>
                      <div>
                        <strong>To:</strong> {latestStakeTransaction.to}
                      </div>
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://sepoliascan.status.network/tx/${latestStakeTransaction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-xs"
                      >
                        🔗 View on StatusScan
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Quest #4: Mint our NFT (gasless)</h2>
              <div>Mint an NFT in our collection using the Status Network gasless transaction capability.</div>
              <div>QuestNFT Balance: {questNfts.toString()}</div>
              <div>Has minted: {hasMintedQuestNft ? "Yes" : "No"}</div>
              {isCheckingMints && <div className="text-sm text-gray-500">Checking transaction history...</div>}
              <div>
                Status:{" "}
                <span className={hasMintedQuestNft ? "text-green-500" : "text-error"}>
                  {hasMintedQuestNft ? "Complete" : "Incomplete"}
                </span>
              </div>

              {/* Debug Info with Explorer Link */}
              {userMintTransactions.length > 0 && (
                <div className="mt-4 p-3 bg-base-300 rounded-lg">
                  <h4 className="font-bold text-sm mb-2">🔍 Debug Info - Mint Transaction Found:</h4>
                  <div className="text-xs bg-base-100 p-2 rounded">
                    <div className="font-mono">
                      <div>
                        <strong>Hash:</strong> {userMintTransactions[0].transactionHash}
                      </div>
                      <div>
                        <strong>Block:</strong> {userMintTransactions[0].blockNumber?.toString()}
                      </div>
                      <div>
                        <strong>Method:</strong> {userMintTransactions[0].methodId}
                      </div>
                      <div>
                        <strong>To:</strong> {userMintTransactions[0].to}
                      </div>
                    </div>
                    <div className="mt-2">
                      <a
                        href={`https://sepoliascan.status.network/tx/${userMintTransactions[0].transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-xs"
                      >
                        🔗 View on StatusScan
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-actions justify-end">
                <Link className="btn btn-primary" href="/erc721">
                  Go to Mint
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
