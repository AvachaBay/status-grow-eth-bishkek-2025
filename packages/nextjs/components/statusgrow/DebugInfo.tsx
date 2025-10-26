"use client";

import { useStatelessModeState } from "~~/hooks/useStatelessMode";
import { useUserState } from "~~/services/store/userState";

export const StatelessInfo = () => {
  const { questProgress, totalXP, level, questCompletionPercentage, walletAddress } = useUserState();
  const { isStatelessMode } = useStatelessModeState();

  if (!isStatelessMode) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🔄 Stateless Mode Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">State Info</h4>
          <div className="space-y-1 text-yellow-600 dark:text-yellow-400">
            <div>Wallet: {walletAddress || "Not connected"}</div>
            <div>Total XP: {totalXP}</div>
            <div>Level: {level}</div>
            <div>Completion: {Math.round(questCompletionPercentage)}%</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Quest Status</h4>
          <div className="space-y-1 text-yellow-600 dark:text-yellow-400">
            {questProgress.map(quest => (
              <div key={quest.id} className="flex justify-between">
                <span>Quest {quest.id}:</span>
                <span className={quest.completed ? "text-green-600" : "text-gray-500"}>
                  {quest.completed ? "✅" : "⏳"} {quest.xpEarned} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
        <strong>Stateless Mode Active:</strong> State will reset on page reload. No persistence to server.
      </div>
    </div>
  );
};
