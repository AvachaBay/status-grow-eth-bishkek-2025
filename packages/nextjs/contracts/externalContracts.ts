import StakeVaultABI from "./StakeVaultABI.json";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

// Optional: wire external contracts like SNT and Vault if env vars are provided
const STATUS_SEPOLIA = 1660990954 as const;

type ExternalDef = {
  address: `0x${string}`;
  abi: any[];
};

const maybeSnt: ExternalDef | undefined = process.env.NEXT_PUBLIC_SNT_ADDRESS
  ? {
      address: process.env.NEXT_PUBLIC_SNT_ADDRESS as `0x${string}`,
      abi: [
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
      ],
    }
  : undefined;

// Use the full StakeVault ABI for proper contract interaction
const maybeVault: ExternalDef | undefined = process.env.NEXT_PUBLIC_VAULT_ADDRESS
  ? {
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`,
      abi: StakeVaultABI,
    }
  : undefined;

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  [STATUS_SEPOLIA]: {
    ...(maybeSnt ? { SNT: maybeSnt } : {}),
    ...(maybeVault ? { AppVault: maybeVault } : {}),
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
