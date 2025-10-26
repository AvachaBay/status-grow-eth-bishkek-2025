"use client";

const Features = () => {
  const features = [
    {
      icon: "⛽",
      title: "Zero Gas Fees",
      description: "Complete quests and claim rewards without paying. Built on Status Network's gasless Layer 2.",
    },
    {
      icon: "🎁",
      title: "Real Rewards",
      description: "Earn actual tokens, NFT badges, Soulbound Tokens, and exclusive whitelist spots.",
    },
    {
      icon: "📱",
      title: "Mobile & Desktop",
      description: "Integrated into Status App on mobile and desktop. Quest anywhere, anytime.",
    },
    {
      icon: "🛡️",
      title: "Bot-Protected",
      description: "RLN technology ensures only genuine users earn rewards. No farmers, no exploits.",
    },
    {
      icon: "⚡",
      title: "Instant Claims",
      description: "Get verified instantly and claim rewards directly to your wallet. No delays.",
    },
    {
      icon: "🤝",
      title: "For Builders",
      description: "Launch your quest in 24 hours. No code required. Full analytics included.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why StatusGrow?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">The most rewarding quest platform built for Web3</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
