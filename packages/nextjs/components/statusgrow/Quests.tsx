"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { showToast } from "~~/components/statusgrow/Toast";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useUserState } from "~~/services/store/userState";
import { clearNFTMintCache, hasUserMintedNFT } from "~~/utils/nftChecker";
import { mintNFTWithWagmi } from "~~/utils/nftMinter";
import { hasUserInteractedWithPonziHero } from "~~/utils/ponziHeroChecker";
import { hasUserStakedInVault } from "~~/utils/vaultStakeChecker";

const Quests = () => {
  const { address, isConnected } = useAccount();

  // Use the new user state management
  const { questProgress, updateQuestProgress } = useUserState();

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
  // Wagmi hook for minting NFT
  const { writeContractAsync: mintNFT } = useScaffoldWriteContract("QuestNFT");

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
      title: "Stake your SNT",
      description: "Stake SNT to earn Karma and exclusive perks.",
      steps: ["Visit official staking dapp", "Deploy vault", "Stake your SNT tokens"],
      link: "https://snt-staking-demo.netlify.app/",
      linkText: "Open Staking",
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

    try {
      const questName = quests.find(q => q.id === questId)?.title || "Quest";

      // Special handling for Ponzi Hero quest (questId 3)
      if (questId === 3) {
        console.log("🎮 Verifying Ponzi Hero quest...");
        showToast.loading("Verifying Ponzi Hero interactions...");
        const hasInteracted = await hasUserInteractedWithPonziHero(address);

        if (!hasInteracted) {
          // Dismiss loading toast before showing error
          showToast.dismissLoading();
          showToast.questFailed(questName, "No Ponzi Hero interactions found. Please play the game first!");
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ Ponzi Hero interaction verified!");
      }

      // Special handling for NFT quest (questId 2)
      if (questId === 2) {
        console.log("🖼️ Verifying NFT mint quest...");
        showToast.loading("Verifying NFT mint...");

        // Clear cache to ensure fresh data for recent transactions
        clearNFTMintCache(address);

        // Use retry logic for recent transactions with constants
        const hasMinted = await hasUserMintedNFT(address);

        if (!hasMinted) {
          // Dismiss loading toast before showing error
          showToast.dismissLoading();
          showToast.questFailed(
            questName,
            "No NFT mints found. Please mint an NFT first and wait a few minutes for confirmation!",
          );
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ NFT mint verified!");
      }

      // Special handling for stake quest (questId 1)
      if (questId === 1) {
        console.log("💰 Verifying stake quest...");
        showToast.loading("Verifying stake transaction...");
        const hasStaked = await hasUserStakedInVault(address);

        if (!hasStaked) {
          // Dismiss loading toast before showing error
          showToast.dismissLoading();
          showToast.questFailed(questName, "No stake transactions found. Please stake SNT first!");
          setVerificationLoading(prev => ({ ...prev, [questId]: false }));
          return;
        }

        console.log("✅ Stake transaction verified!");
      }

      // Dismiss loading toast before showing success
      showToast.dismissLoading();

      // Mark quest as completed using new state management
      updateQuestProgress(questId, true, 50);
      setQuestStates(prev => ({ ...prev, [questId]: true }));

      // Show quest completion toast (includes XP earned)
      showToast.questCompleted(questName, 50);
    } catch (error) {
      console.error("❌ Verification failed:", error);
      // Dismiss loading toast before showing error
      showToast.dismissLoading();
      showToast.questFailed(
        quests.find(q => q.id === questId)?.title || "Quest",
        "Verification failed. Please try again.",
      );
    } finally {
      setVerificationLoading(prev => ({ ...prev, [questId]: false }));
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">Available Quests</h2>
        </div>

        {/* Wallet Connection Status - Removed duplicate, wallet info is shown in header */}

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
                  // Special link button for staking quest
                  <a
                    href={quest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markLinkVisited(quest.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all duration-200 bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    {quest.linkText}
                  </a>
                ) : quest.id === 2 ? (
                  // Special mint button for NFT quest
                  <button
                    onClick={mintStatusGrowNFT}
                    disabled={mintingLoading || questStates[quest.id]}
                    className={`flex-1 px-3 py-2 rounded-lg text-center text-sm font-semibold transition-all duration-200 ${
                      questStates[quest.id]
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-not-allowed"
                        : mintingLoading
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : (quest.id >= 4 && linkVisitedTracker[quest.id]) || quest.id < 4
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
    </section>
  );
};

export default Quests;
