import { createContext, useContext, useEffect, useState } from "react";

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

  // Load stateless mode from localStorage on mount
  useEffect(() => {
    const savedStatelessMode = localStorage.getItem("stateless-mode");
    if (savedStatelessMode === "true") {
      setIsStatelessMode(true);
    }
  }, []);

  // Save stateless mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("stateless-mode", isStatelessMode.toString());
  }, [isStatelessMode]);

  const toggleStatelessMode = () => {
    setIsStatelessMode(prev => !prev);
  };

  return {
    isStatelessMode,
    toggleStatelessMode,
  };
};

export { StatelessContext };
