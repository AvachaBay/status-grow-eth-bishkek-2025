"use client";

import { useEffect } from "react";
import { useStatelessModeState } from "~~/hooks/useStatelessMode";

export const StatelessToggle = () => {
  const { isStatelessMode, toggleStatelessMode } = useStatelessModeState();

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "D") {
        event.preventDefault();
        toggleStatelessMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleStatelessMode]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-yellow-100/90 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="stateless-mode"
            checked={isStatelessMode}
            onChange={toggleStatelessMode}
            className="w-3 h-3 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="stateless-mode"
            className="text-xs font-medium text-yellow-800 dark:text-yellow-200 cursor-pointer"
          >
            🔄 Stateless
          </label>
        </div>

        {isStatelessMode && (
          <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
            <div className="font-semibold">⚠️ Active</div>
            <div className="text-xs opacity-75">Ctrl+Shift+D</div>
          </div>
        )}
      </div>
    </div>
  );
};
