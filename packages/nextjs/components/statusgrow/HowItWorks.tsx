"use client";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Connect Your Wallet",
      description: "No signup or email required. Connect your MetaMask or Status Wallet.",
    },
    {
      number: "2",
      title: "Complete Quests",
      description: "Browse available quests and complete on-chain activities: stake SNT, swap tokens, mint NFTs.",
    },
    {
      number: "3",
      title: "Claim Your Rewards",
      description: "Get verified instantly. Claim your rewards directly to your wallet.",
      highlight: "💰 Real Rewards: SNT tokens • Partner tokens • NFT badges • Whitelist spots",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Start earning in 3 simple steps</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-10 rounded-2xl border-l-4 border-blue-600 hover:translate-x-2 transition-all duration-300"
            >
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl mb-4">
                {step.number}
              </div>

              {/* Step Content */}
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{step.description}</p>

              {/* Reward Highlight */}
              {step.highlight && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-3 border-green-500">
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    <strong>{step.highlight}</strong>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
