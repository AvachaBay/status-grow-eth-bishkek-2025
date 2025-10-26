"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { AddressInput, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ERC721MintPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [toAddress, setToAddress] = useState<string>("");
  const [tokenUri, setTokenUri] = useState<string>("");

  const { writeContractAsync: writeQuestNftAsync, isPending } = useScaffoldWriteContract("QuestNFT");

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 text-center max-w-3xl">
        <h1 className="text-4xl font-bold">QuestNFT Mint</h1>
        <p className="mt-2">Mint an NFT with a custom token URI (e.g. ipfs://.../metadata.json).</p>
      </div>

      {connectedAddress ? (
        <div className="flex flex-col justify-center items-center bg-base-300 w-full mt-8 px-8 pt-6 pb-12">
          <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center w-full md:w-2/3 rounded-3xl">
            <h3 className="text-2xl font-bold">Mint</h3>
            <div className="flex flex-col items-stretch justify-between w-full gap-4 mt-6">
              <div>
                <div className="font-bold mb-2 text-left">Recipient</div>
                <AddressInput value={toAddress} onChange={setToAddress} placeholder={connectedAddress || "0x"} />
              </div>
              <div className="text-left">
                <div className="font-bold mb-2">Token URI</div>
                <input
                  className="input input-bordered w-full"
                  placeholder="ipfs://CID/metadata.json or https://..."
                  value={tokenUri}
                  onChange={e => setTokenUri(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <button
                  className="btn btn-primary text-lg px-10"
                  disabled={!toAddress || !tokenUri || isPending}
                  onClick={async () => {
                    try {
                      await writeQuestNftAsync({
                        functionName: "mint",
                        args: [toAddress || connectedAddress!, tokenUri],
                      });
                      setTokenUri("");
                    } catch (err) {
                      console.error("Mint failed", err);
                    }
                  }}
                >
                  {isPending ? "Minting..." : "Mint"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center bg-base-300 w-full mt-8 px-8 pt-6 pb-12">
          <p className="text-xl font-bold">Please connect your wallet to mint.</p>
          <RainbowKitCustomConnectButton />
        </div>
      )}
    </div>
  );
};

export default ERC721MintPage;
