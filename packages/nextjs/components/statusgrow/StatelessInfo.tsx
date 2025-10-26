"use client";

import { useState } from "react";
import { useStatelessModeState } from "~~/hooks/useStatelessMode";
import { useUserState } from "~~/services/store/userState";

export const StatelessInfo = () => {
  const { questProgress, totalXP, level, questCompletionPercentage } = useUserState();
  const { isStatelessMode } = useStatelessModeState();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isStatelessMode) return null;

  return (
    <div className="bg-yellow-50/80 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6 backdrop-blur-sm">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left">
        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">🔄 Stateless Mode Active</h3>
        <span className="text-yellow-600 dark:text-yellow-400">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">State Info</h4>
            <div className="space-y-1 text-yellow-600 dark:text-yellow-400">
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
      )}

      <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
        <strong>Stateless Mode Active:</strong> State will reset on page reload. No persistence to server.
      </div>
    </div>
  );
};
