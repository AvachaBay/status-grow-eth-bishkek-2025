import { createContext, useContext, useEffect, useState } from "react";
import { useUserState } from "~~/services/store/userState";

interface StatelessContextType {
  isStatelessMode: boolean;
  toggleStatelessMode: () => void;
  resetUserState: () => void;
}

const StatelessContext = createContext<StatelessContextType | undefined>(undefined);

export const useStatelessMode = () => {
  const context = useContext(StatelessContext);
  if (context === undefined) {
    throw new Error("useStatelessMode must be used within a StatelessProvider");
  }
  return context;
};

export const useStatelessModeState = () => {
  const [isStatelessMode, setIsStatelessMode] = useState(false);
  const { resetUserState } = useUserState();

  // Load stateless mode from localStorage on mount
  useEffect(() => {
    const savedStatelessMode = localStorage.getItem("stateless-mode");
    if (savedStatelessMode === "true") {
      setIsStatelessMode(true);
      // If stateless mode was already enabled, reset the state
      console.log("🔄 Stateless mode was enabled - resetting user state");
      resetUserState();
    }
  }, [resetUserState]);

  // Save stateless mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("stateless-mode", isStatelessMode.toString());
  }, [isStatelessMode]);

  const toggleStatelessMode = () => {
    const newStatelessMode = !isStatelessMode;
    setIsStatelessMode(newStatelessMode);

    // If enabling stateless mode, reset the user state
    if (newStatelessMode) {
      console.log("🔄 Stateless mode enabled - resetting user state");
      resetUserState();
    }
  };

  return {
    isStatelessMode,
    toggleStatelessMode,
  };
};

export { StatelessContext };
