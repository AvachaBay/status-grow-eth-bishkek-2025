"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
          🌱 Powered by Status Network
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Complete Quests.
          <br />
          Earn Rewards.
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Grow Your Crypto.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          The next-generation quest platform for Web3. Real rewards, zero gas fees, and seamless experience on mobile
          and desktop.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/app"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Growing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
