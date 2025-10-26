"use client";

import { useStatelessModeState } from "~~/hooks/useStatelessMode";

export const StatelessToggle = () => {
  const { isStatelessMode, toggleStatelessMode } = useStatelessModeState();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="stateless-mode"
              checked={isStatelessMode}
              onChange={toggleStatelessMode}
              className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="stateless-mode" className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              🔄 Stateless Mode
            </label>
          </div>
        </div>

        {isStatelessMode && (
          <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
            <div className="font-semibold">⚠️ Stateless Mode Active</div>
            <div>• State resets on page reload</div>
            <div>• No persistence to server</div>
            <div>• Perfect for testing</div>
          </div>
        )}
      </div>
    </div>
  );
};
