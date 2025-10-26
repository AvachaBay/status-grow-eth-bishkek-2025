"use client";

import { useStatelessModeState } from "~~/hooks/useStatelessMode";
import { useUserState } from "~~/services/store/userState";

export const UserStats = () => {
  const { totalXP, level, questCompletionPercentage, questProgress } = useUserState();
  const { isStatelessMode } = useStatelessModeState();

  // Ensure level is always a number
  const safeLevel = typeof level === "number" ? level : 1;

  const completedQuests = questProgress.filter(quest => quest.completed).length;
  const totalQuests = questProgress.length;

  // Calculate level progress
  const safeTotalXP = typeof totalXP === "number" && !isNaN(totalXP) ? totalXP : 0;
  const percentage = safeTotalXP % 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🏆 Your Progress</h2>
        {isStatelessMode && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
            🔄 Stateless Mode
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level Display with integrated progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90">Level</p>
              <p className="text-3xl font-bold">{safeLevel}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
          {/* Level Progress Bar - integrated into Level card */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs opacity-75">Progress to Level {safeLevel + 1}</span>
              <span className="text-xs opacity-75">{safeTotalXP % 100}/100 XP</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* XP Display */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total XP</p>
              <p className="text-3xl font-bold">{totalXP}</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completion</p>
              <p className="text-3xl font-bold">{Math.round(questCompletionPercentage)}%</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Quest Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quest Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {completedQuests}/{totalQuests} ({Math.round(questCompletionPercentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${questCompletionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
