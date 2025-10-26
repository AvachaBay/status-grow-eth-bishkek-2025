"use client";

import toast, { Toast } from "react-hot-toast";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Toast types for different Web3 scenarios
export type ToastType = "success" | "error" | "loading" | "info" | "tx" | "quest";

// Custom toast component for Web3 transactions
const TxToast = ({
  t,
  txHash,
  message,
  type,
}: {
  t: Toast;
  txHash?: string;
  message: string;
  type: "pending" | "success" | "error";
}) => {
  const getIcon = () => {
    switch (type) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "pending":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "pending":
        return "text-blue-800 dark:text-blue-200";
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      default:
        return "text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div
      className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
            {txHash && (
              <div className="mt-2">
                <a
                  href={`https://sepoliascan.status.network/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View on StatusScan
                  <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Quest completion toast
const QuestToast = ({ t, questName, xpEarned }: { t: Toast; questName: string; xpEarned: number }) => (
  <div className="max-w-sm w-full bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden">
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">🎉 Quest Completed!</p>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            {questName} • +{xpEarned} XP
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200 dark:border-gray-700">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
      >
        <XCircleIcon className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Toast management utilities
const dismissAllToasts = () => {
  toast.dismiss();
};

const dismissToastsByType = (type: string) => {
  // Dismiss all toasts that contain specific text patterns
  const allToasts = document.querySelectorAll("[data-hot-toast]");
  allToasts.forEach(toastEl => {
    const text = toastEl.textContent?.toLowerCase() || "";
    if (text.includes(type.toLowerCase())) {
      const toastId = toastEl.getAttribute("data-hot-toast");
      if (toastId) toast.dismiss(toastId);
    }
  });
};

// Toast notification functions
export const showToast = {
  // Transaction notifications
  txPending: (message: string, txHash?: string) => {
    // Dismiss any existing pending toasts before showing new one
    dismissToastsByType("pending");
    return toast.custom((t: Toast) => <TxToast t={t} txHash={txHash} message={message} type="pending" />, {
      duration: 0, // Don't auto-dismiss pending transactions
      id: "tx-pending", // Use consistent ID to prevent duplicates
    });
  },

  txSuccess: (message: string, txHash?: string) => {
    // Dismiss pending toast when success comes
    toast.dismiss("tx-pending");
    return toast.custom((t: Toast) => <TxToast t={t} txHash={txHash} message={message} type="success" />, {
      duration: 6000,
      id: "tx-success",
    });
  },

  txError: (message: string, txHash?: string) => {
    // Dismiss pending toast when error comes
    toast.dismiss("tx-pending");
    return toast.custom((t: Toast) => <TxToast t={t} txHash={txHash} message={message} type="error" />, {
      duration: 8000,
      id: "tx-error",
    });
  },

  // Quest notifications
  questCompleted: (questName: string, xpEarned: number) => {
    return toast.custom((t: Toast) => <QuestToast t={t} questName={questName} xpEarned={xpEarned} />, {
      duration: 6000,
      position: "top-right", // Better positioning for quest notifications
    });
  },

  // General notifications
  success: (message: string) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      duration: 6000,
      style: {
        background: "#EF4444",
        color: "#fff",
      },
    });
  },

  loading: (message: string) => {
    // Dismiss any existing loading toasts before showing new one
    dismissToastsByType("loading");
    return toast.loading(message, {
      duration: 0,
      id: "loading-toast",
    });
  },

  info: (message: string) => {
    return toast(message, {
      duration: 4000,
      icon: "ℹ️",
      style: {
        background: "#3B82F6",
        color: "#fff",
      },
    });
  },

  // Wallet connection notifications
  walletConnected: (address: string) => {
    return toast.success(`🔗 Wallet Connected: ${address.slice(0, 6)}...${address.slice(-4)}`, {
      duration: 4000,
    });
  },

  walletDisconnected: () => {
    return toast("🔌 Wallet Disconnected", {
      duration: 3000,
      icon: "🔌",
    });
  },

  // Network notifications
  networkChanged: (networkName: string) => {
    return toast(`🌐 Switched to ${networkName}`, {
      duration: 4000,
      icon: "🌐",
    });
  },

  // Quest-specific notifications
  questStarted: (questName: string) => {
    return toast(`🚀 Started: ${questName}`, {
      duration: 3000,
      icon: "🚀",
    });
  },

  questFailed: (questName: string, reason: string) => {
    return toast.error(`❌ ${questName} failed: ${reason}`, {
      duration: 6000,
    });
  },

  // XP notifications
  xpEarned: (amount: number) => {
    return toast.success(`⭐ +${amount} XP Earned!`, {
      duration: 4000,
      icon: "⭐",
    });
  },

  levelUp: (newLevel: number) => {
    return toast.success(`🎉 Level Up! You're now level ${newLevel}`, {
      duration: 6000,
      icon: "🎉",
    });
  },

  // Web3-specific notifications
  walletConnectionFailed: (error: string) => {
    return toast.error(`🔌 Wallet connection failed: ${error}`, {
      duration: 8000,
      icon: "🔌",
    });
  },

  transactionReverted: (txHash: string, reason?: string) => {
    return toast.error(`❌ Transaction reverted${reason ? `: ${reason}` : ""}`, {
      duration: 10000,
      icon: "❌",
    });
  },

  gasEstimationFailed: () => {
    return toast.error("⛽ Gas estimation failed. Please try again.", {
      duration: 6000,
      icon: "⛽",
    });
  },

  networkMismatch: (expectedNetwork: string) => {
    return toast.error(`🌐 Wrong network. Please switch to ${expectedNetwork}`, {
      duration: 10000,
      icon: "🌐",
    });
  },

  // Utility functions
  dismissAll: () => {
    dismissAllToasts();
  },

  dismissLoading: () => {
    toast.dismiss("loading-toast");
  },
};

export default showToast;
