import * as dotenv from "dotenv";
dotenv.config();
import { Wallet } from "ethers";
import { spawn } from "child_process";
import { config } from "hardhat";

/**
 * Unencrypts the private key and runs the hardhat deploy command
 */
async function main() {
  const networkIndex = process.argv.indexOf("--network");
  const networkName = networkIndex !== -1 ? process.argv[networkIndex + 1] : config.defaultNetwork;

  if (networkName === "localhost" || networkName === "hardhat") {
    // Deploy command on the localhost network
    const hardhat = spawn("hardhat", ["deploy", ...process.argv.slice(2)], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });

    hardhat.on("exit", code => {
      process.exit(code || 0);
    });
    return;
  }

  // If an unencrypted private key is provided, use it directly (CI/non-interactive flows)
  if (process.env.DEPLOYER_PRIVATE_KEY) {
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
  } else {
    const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

    if (!encryptedKey) {
      console.log("🚫️ You don't have a deployer account. Run `yarn generate` or `yarn account:import` first");
      return;
    }

    const pass = process.env.DEPLOYER_PASSWORD ?? ""; // default to empty password if none provided

    try {
      const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
      process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY = wallet.privateKey;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error(
        "Failed to decrypt private key. Set DEPLOYER_PASSWORD (can be empty) or provide DEPLOYER_PRIVATE_KEY.",
      );
      process.exit(1);
    }
  }

  const hardhat = spawn("hardhat", ["deploy", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  hardhat.on("exit", code => {
    process.exit(code || 0);
  });
}

main().catch(console.error);
