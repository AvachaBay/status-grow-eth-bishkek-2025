"use client";

import Footer from "~~/components/statusgrow/Footer";
import Header from "~~/components/statusgrow/Header";
import Quests from "~~/components/statusgrow/Quests";
import { StatelessInfo } from "~~/components/statusgrow/StatelessInfo";
import { StatelessToggle } from "~~/components/statusgrow/StatelessToggle";
import { UserStats } from "~~/components/statusgrow/UserStats";

const AppPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />

      {/* Stateless Toggle */}
      <StatelessToggle />

      {/* User Stats Section */}
      <div className="w-full max-w-6xl mx-auto px-5 py-8">
        <UserStats />
      </div>

      <Quests />

      {/* Stateless Info - moved to bottom to avoid blocking toasts */}
      <StatelessInfo />

      <Footer />
    </div>
  );
};

export default AppPage;
