"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";
import { showToast } from "~~/components/statusgrow/Toast";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useUserState } from "~~/services/store/userState";
import { hasUserMintedNFT } from "~~/utils/nftChecker";
import { mintNFTWithWagmi } from "~~/utils/nftMinter";
import { hasUserInteractedWithPonziHero } from "~~/utils/ponziHeroChecker";
import { hasUserStakedInVault } from "~~/utils/vaultStakeChecker";

const Quests = () => {
  const { address, isConnected } = useAccount();

  // Use the new user state management
  const { questProgress, totalXP, updateQuestProgress } = useUserState();

  // Ensure totalXP is always a number
  const safeTotalXP = typeof totalXP === "number" ? totalXP : 0;

  // Legacy state for UI interactions
  const [questStates, setQuestStates] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });
  const [linkVisitedTracker, setLinkVisitedTracker] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });
  const [verificationLoading, setVerificationLoading] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });
  const [mintingLoading, setMintingLoading] = useState(false);
  const [stakingDialogOpen, setStakingDialogOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingLoading, setStakingLoading] = useState(false);

  // Wagmi hook for minting NFT
  const { writeContractAsync: mintNFT } = useScaffoldWriteContract("QuestNFT");

  // Wagmi hook for staking
  const { writeContractAsync: stakeTokens } = useScaffoldWriteContract("AppVault");

  // Wagmi hook for SNT token approval using specific contract address
  const { writeContractAsync: approveSNT } = useWriteContract();

  // Sync quest states with user state
  useEffect(() => {
    const newQuestStates: { [key: number]: boolean } = {};
    questProgress.forEach(quest => {
      newQuestStates[quest.id] = quest.completed;
    });
    setQuestStates(newQuestStates);
  }, [questProgress]);

  const quests = [
    {
      id: 1,
      icon: "💰",
      title: "Stake your SNT to StatusGrow vault",
      description: "Stake SNT to earn Karma and exclusive perks.",
      steps: ["Stake minimum 100 SNT"],
      link: "#",
      linkText: "Stake",
      isComingSoon: false,
    },
    {
      id: 2,
      icon: "🖼️",
      title: "Mint StatusGrow NFT",
      description: "Mint your exclusive StatusGrow NFT badge.",
      steps: ["Connect your wallet", "Mint StatusGrow NFT", "Wait for confirmation"],
      link: "https://ponzihero.xyz/", // Placeholder link - should be updated to actual NFT minting page
      linkText: "Mint",
      isComingSoon: false,
    },
    {
      id: 3,
      icon: "🎮",
      title: "Play Ponzi Hero",
      description: "Complete your first game to earn rewards and NFT drops.",
      steps: ["Visit Ponzi Hero", "Play your first game", "Complete the tutorial"],
      link: "https://ponzihero.xyz/",
      linkText: "Play Now",
      isComingSoon: false,
    },
    {
      id: 4,
      icon: "💬",
      title: "Join Status L2 Telegram",
      description: "Join our Telegram community to stay updated with news.",
      steps: ["Click the Telegram link below", "Join the community", "Return and verify"],
      link: "https://t.me/statusl2",
      linkText: "Join Telegram",
      isComingSoon: false,
    },
    {
      id: 5,
      icon: "📖",
      title: "Read Status Network Docs",
      description: "Explore the Status Network documentation to understand the L2.",
      steps: ["Click the docs link below", "Review the documentation", "Return and verify"],
      link: "https://docs.status.network/",
      linkText: "Read Docs",
      isComingSoon: false,
    },
    {
      id: 6,
      icon: "𝕏",
      title: "Follow on Twitter",
      description: "Follow us to get the latest updates and announcements.",
      steps: ["Click the Twitter link below", "Follow @StatusL2", "Return and verify"],
      link: "https://x.com/StatusL2",
      linkText: "Follow on X",
      isComingSoon: false,
    },
    {
      id: 7,
      icon: "🤝",
      title: "Join StatusGrow Chat",
      description: "Join our StatusGrow community Telegram to connect with other users.",
      steps: ["Click the Telegram link below", "Join StatusGrow community", "Return and verify"],
      link: "https://t.me/statusgrowcommunity",
      linkText: "Join Community",
      isComingSoon: false,
    },
  ];

  const updateXPBar = () => {
    const XP_PER_LEVEL = 100; // Match the user state calculation
    const currentXP = safeTotalXP; // Use the safe value
    const percentage = ((currentXP % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
    const level = Math.floor(currentXP / XP_PER_LEVEL) + 1;

    // Debug logging
    console.log("XP Debug:", { totalXP, safeTotalXP, currentXP, level, percentage, XP_PER_LEVEL });

    return { percentage, level };
  };

  const markLinkVisited = (questId: number) => {
    if (!isConnected) {
      showToast.error("Connect wallet first!");
      return;
    }
    setLinkVisitedTracker(prev => ({ ...prev, [questId]: true }));
    showToast.success("Link opened! Click Verify");
  };

  const mintStatusGrowNFT = async () => {
    if (!isConnected || !address) {
      showToast.error("Connect wallet first!");
      return;
    }

    setMintingLoading(true);

    try {
      console.log("🎨 Starting NFT mint process...");
      showToast.txPending("Preparing NFT mint with LOTM metadata...");

      // Prepare the mint with LOTM metadata
      const tokenURI = await mintNFTWithWagmi(address, 20020);

      // Call the contract to mint
      showToast.txPending("Minting StatusGrow NFT...");
      const txHash = await mintNFT({
        functionName: "mint",
        args: [address, tokenURI],
      });

      console.log("✅ NFT mint transaction sent:", txHash);
      showToast.txSuccess("StatusGrow NFT minted successfully!", txHash);

      // Mark the link as visited so user can verify
      setLinkVisitedTracker(prev => ({ ...prev, [2]: true }));
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      showToast.txError("Failed to mint NFT. Please try again.");
    } finally {
      setMintingLoading(false);
    }
  };

  const handleStakeClick = () => {
    if (!isConnected || !address) {
      showToast.error("Connect wallet first!");
      return;
    }
    setStakingDialogOpen(true);
  };

  const handleStakeSubmit = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      showToast.error("Please enter a valid stake amount!");
      return;
    }

    if (parseFloat(stakeAmount) < 100) {
      showToast.error("Minimum stake amount is 100 SNT!");
      return;
    }

    setStakingLoading(true);

    try {
      console.log(`💰 Staking ${stakeAmount} SNT...`);

      // Convert amount to wei (assuming 18 decimals for SNT)
      const amountInWei = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));

      // Step 1: Approve the vault contract to spend SNT tokens
      console.log("🔐 Approving SNT tokens for vault...");
      showToast.txPending("Approving SNT tokens for vault...");

      const approveTxHash = await approveSNT({
        address: "0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a", // SNT token contract
        abi: [
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        args: ["0xc13Bf1d5986D8831116E36d11b4d2AE859258C7D", amountInWei], // vault address and amount
      });

      console.log("✅ Approval transaction sent:", approveTxHash);
      showToast.txSuccess("SNT tokens approved successfully!", approveTxHash);

      // Step 2: Wait a moment for approval to be processed, then stake
      console.log("⏳ Waiting for approval confirmation...");
      showToast.info("Waiting for approval confirmation...");
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

      // Step 3: Call the stake function
      console.log("💰 Executing stake transaction...");
      showToast.txPending("Staking SNT tokens...");

      const stakeTxHash = await stakeTokens({
        functionName: "stake",
        args: [amountInWei, BigInt(0)], // amount and lock period (0 for no lock)
      });

      console.log("✅ Stake transaction sent:", stakeTxHash);
      showToast.txSuccess(`Successfully staked ${stakeAmount} SNT!`, stakeTxHash);

      // Close dialog and mark quest as ready for verification
      setStakingDialogOpen(false);
      setStakeAmount("");
      setLinkVisitedTracker(prev => ({ ...prev, [1]: true }));
    } catch (error) {
      console.error("❌ Error staking tokens:", error);
      showToast.txError("Failed to stake tokens. Please try again.");
    } finally {
      setStakingLoading(false);
    }
  };

  const verifyLinkQuest = async (questId: number) => {
    if (!isConnected || !address) {
      showToast.error("Connect wallet first!");
      return;
    }
    // Only social quests (4,5,6,7) require visiting the link first
    if (questId >= 4 && !linkVisitedTracker[questId]) {
      showToast.error("Visit the link first!");
      return;
    }

    // Set loading state
    setVerificationLoading(prev => ({ ...prev, [questId]: true }));

    let loadingToastId: string | undefined;

    try {
      const questName = quests.find(q => q.id === questId)?.title || "Quest";

      // Special handling for Ponzi Hero quest (questId 3)
      if (questId === 3) {
        console.log("🎮 Verifying Ponzi Hero quest...");
        loadingToastId = showToast.loading("Verifying Ponzi Hero interactions...");
        const hasInteracted = await hasUserInteractedWithPonziHero(address);

        if (!hasInteracted) {
          // Dismiss loading toast before showing error
          if (loadingToastId) toast.dismiss(loadingToastId);
          showToast.questFailed(questName, "No Ponzi Hero interactions found. Please play the game first!");
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ Ponzi Hero interaction verified!");
      }

      // Special handling for NFT quest (questId 2)
      if (questId === 2) {
        console.log("🖼️ Verifying NFT mint quest...");
        loadingToastId = showToast.loading("Verifying NFT mint...");
        const hasMinted = await hasUserMintedNFT(address);

        if (!hasMinted) {
          // Dismiss loading toast before showing error
          if (loadingToastId) toast.dismiss(loadingToastId);
          showToast.questFailed(questName, "No NFT mints found. Please mint an NFT first!");
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ NFT mint verified!");
      }

      // Special handling for stake quest (questId 1)
      if (questId === 1) {
        console.log("💰 Verifying stake quest...");
        loadingToastId = showToast.loading("Verifying stake transaction...");
        const hasStaked = await hasUserStakedInVault(address);

        if (!hasStaked) {
          // Dismiss loading toast before showing error
          if (loadingToastId) toast.dismiss(loadingToastId);
          showToast.questFailed(questName, "No stake transactions found. Please stake SNT first!");
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ Stake transaction verified!");
      }

      // Dismiss loading toast before showing success
      if (loadingToastId) toast.dismiss(loadingToastId);

      // Mark quest as completed using new state management
      updateQuestProgress(questId, true, 50);
      setQuestStates(prev => ({ ...prev, [questId]: true }));

      // Show quest completion toast (includes XP earned)
      showToast.questCompleted(questName, 50);
    } catch (error) {
      console.error("❌ Verification failed:", error);
      // Dismiss loading toast before showing error
      if (loadingToastId) toast.dismiss(loadingToastId);
      showToast.questFailed(
        quests.find(q => q.id === questId)?.title || "Quest",
        "Verification failed. Please try again.",
      );
    } finally {
      setVerificationLoading(prev => ({ ...prev, [questId]: false }));
    }
  };

  const { percentage, level } = updateXPBar();

  // Ensure level is always a number
  const safeXpLevel = typeof level === "number" && !isNaN(level) ? level : 1;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">Available Quests</h2>
        </div>

        {/* Wallet Connection Status - Removed duplicate, wallet info is shown in header */}

        {/* XP Section */}
        {isConnected && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Level {safeXpLevel}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Level {safeXpLevel + 1}
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>{safeTotalXP % 100}</strong> / <strong>100</strong> XP
            </p>
          </div>
        )}

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map(quest => (
            <div
              key={quest.id}
              className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-7 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 ${
                !isConnected ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {quest.isComingSoon && <div className="absolute top-4 right-4 text-2xl">🚧</div>}

              <div className="text-5xl mb-4">{quest.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{quest.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{quest.description}</p>

              {/* Quest Steps */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-5 border-l-3 border-blue-500">
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                  Steps to Complete:
                </h4>
                <ul className="space-y-1">
                  {quest.steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                      <span className="text-green-500 font-semibold mr-2">✓</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress Bar */}
              {!quest.isComingSoon && (
                <div className="mb-5">
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Progress</span>
                    <span>{questStates[quest.id] ? "1/1" : "0/1"}</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-lg transition-all duration-300"
                      style={{ width: questStates[quest.id] ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              )}

              {/* Coming Soon Message */}
              {quest.isComingSoon && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-5 border-l-3 border-purple-500 text-center">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">🚧 Coming Soon</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {quest.id === 1 ? (
                  // Special stake button for staking quest
                  <button
                    onClick={handleStakeClick}
                    disabled={stakingLoading || questStates[quest.id]}
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all duration-200 ${
                      questStates[quest.id]
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-not-allowed"
                        : stakingLoading
                          ? "bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {stakingLoading ? "💰 Staking..." : questStates[quest.id] ? "✓ Staked" : "💰 Stake"}
                  </button>
                ) : quest.id === 2 ? (
                  // Special mint button for NFT quest
                  <button
                    onClick={mintStatusGrowNFT}
                    disabled={mintingLoading || questStates[quest.id]}
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all duration-200 ${
                      questStates[quest.id]
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-not-allowed"
                        : mintingLoading
                          ? "bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-400 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {mintingLoading ? "🎨 Minting..." : questStates[quest.id] ? "✓ Minted" : "🎨 Mint NFT"}
                  </button>
                ) : (
                  // Regular link button for other quests
                  <a
                    href={quest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markLinkVisited(quest.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all duration-200 ${
                      quest.isComingSoon
                        ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400"
                        : "bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                    style={{ pointerEvents: quest.isComingSoon ? "none" : "auto" }}
                  >
                    {quest.linkText}
                  </a>
                )}
                <button
                  onClick={() => verifyLinkQuest(quest.id)}
                  disabled={
                    quest.isComingSoon ||
                    questStates[quest.id] ||
                    (quest.id >= 4 && !linkVisitedTracker[quest.id]) || // Only social quests (4,5,6,7) require link visit
                    verificationLoading[quest.id]
                  }
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    questStates[quest.id]
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-not-allowed"
                      : quest.isComingSoon
                        ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400"
                        : verificationLoading[quest.id]
                          ? "bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-400 cursor-not-allowed"
                          : (quest.id >= 4 && linkVisitedTracker[quest.id]) || quest.id < 4
                            ? "bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                            : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {verificationLoading[quest.id] ? "🔄 Verifying..." : questStates[quest.id] ? "✓ Completed" : "Verify"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">🚀 New quests coming soon!</p>
        </div>
      </div>

      {/* Staking Dialog */}
      {stakingDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stake SNT Tokens</h3>
              <button
                onClick={() => setStakingDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Stake (SNT)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                placeholder="Enter amount (minimum 100 SNT)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="100"
                step="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum stake: 100 SNT</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                ℹ️ This will require 2 transactions: approval + staking
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStakingDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStakeSubmit}
                disabled={stakingLoading || !stakeAmount || parseFloat(stakeAmount) < 100}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {stakingLoading ? "💰 Processing..." : "💰 Stake"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Quests;
