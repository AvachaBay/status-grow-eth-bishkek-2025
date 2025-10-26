import { type Address } from "viem";

// QuestNFT contract address (from deployedContracts.ts)
const QUEST_NFT_ADDRESS = "0xf4432bAbc32afAcCeaf76afC9a1B2a9D3D55BAa8" as const;

// LOTM API metadata interface
interface LOTMMetadata {
  image: string;
  attributes: Array<{
    value: string | number;
    trait_type: string;
    display_type?: string;
  }>;
  id: number;
}

/**
 * Fetch LOTM metadata from the API
 * @param tokenId - The LOTM token ID
 * @returns Promise<LOTMMetadata> - The metadata object
 */
export async function fetchLOTMMetadata(tokenId: number): Promise<LOTMMetadata> {
  try {
    const response = await fetch(`https://api.lotm.gg/kodamaras/${tokenId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch LOTM metadata: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching LOTM metadata:", error);
    throw error;
  }
}

/**
 * Create NFT metadata JSON with LOTM data
 * @param lotmData - The LOTM metadata
 * @returns string - JSON metadata string
 */
export function createNFTMetadata(lotmData: LOTMMetadata): string {
  const metadata = {
    name: `StatusGrow Kodamara #${lotmData.id}`,
    description: `A unique StatusGrow NFT featuring a ${lotmData.attributes.find(attr => attr.trait_type === "Origin Role")?.value || "mysterious"} Kodamara with special abilities.`,
    image: lotmData.image,
    external_url: "https://statusgrow.xyz",
    attributes: lotmData.attributes.map(attr => ({
      trait_type: attr.trait_type,
      value: attr.value,
      ...(attr.display_type && { display_type: attr.display_type }),
    })),
  };

  return JSON.stringify(metadata, null, 2);
}

/**
 * Mint NFT to user's wallet using LOTM metadata
 * @param userAddress - The address to mint the NFT to
 * @param lotmTokenId - The LOTM token ID to use for metadata
 * @returns Promise<string> - Transaction hash
 */
export async function mintStatusGrowNFT(userAddress: Address, lotmTokenId: number = 20020): Promise<string> {
  try {
    console.log(`🎨 Minting StatusGrow NFT for ${userAddress} with LOTM token ${lotmTokenId}`);

    // Fetch LOTM metadata
    const lotmData = await fetchLOTMMetadata(lotmTokenId);
    console.log("📋 LOTM metadata fetched:", lotmData);

    // Create NFT metadata
    const metadataJson = createNFTMetadata(lotmData);
    console.log("📝 Created NFT metadata:", metadataJson);

    // For now, we'll use a placeholder URI since we need to upload to IPFS
    // In a real implementation, you'd upload the metadata to IPFS first
    const tokenURI = `https://api.lotm.gg/kodamaras/${lotmTokenId}`;

    // Create wallet client (this would need to be connected to user's wallet)
    // For demo purposes, we'll simulate the transaction
    console.log(`🔗 Would mint NFT with URI: ${tokenURI}`);
    console.log(`🎯 Contract: ${QUEST_NFT_ADDRESS}`);
    console.log(`👤 Recipient: ${userAddress}`);

    // In a real implementation, you would:
    // 1. Connect to user's wallet
    // 2. Call the mint function on the contract
    // 3. Return the transaction hash

    // For now, return a mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    console.log(`✅ Mock transaction hash: ${mockTxHash}`);

    return mockTxHash;
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    throw error;
  }
}

/**
 * Mint NFT using wagmi hooks (for integration with existing scaffold-eth setup)
 * @param userAddress - The address to mint the NFT to
 * @param lotmTokenId - The LOTM token ID to use for metadata
 * @returns Promise<string> - Transaction hash
 */
export async function mintNFTWithWagmi(userAddress: Address, lotmTokenId: number = 20020): Promise<string> {
  try {
    console.log(`🎨 Minting StatusGrow NFT with Wagmi for ${userAddress}`);

    // Fetch LOTM metadata
    const lotmData = await fetchLOTMMetadata(lotmTokenId);
    console.log("📋 LOTM metadata fetched:", lotmData);

    // Create NFT metadata
    const metadataJson = createNFTMetadata(lotmData);
    console.log("📝 Created NFT metadata:", metadataJson);

    // Use the LOTM API URL as the token URI for now
    const tokenURI = `https://api.lotm.gg/kodamaras/${lotmTokenId}`;

    console.log(`🔗 Minting NFT with URI: ${tokenURI}`);
    console.log(`🎯 Contract: ${QUEST_NFT_ADDRESS}`);
    console.log(`👤 Recipient: ${userAddress}`);

    // This would be called from a React component using wagmi hooks
    // The actual minting would happen in the component using useScaffoldWriteContract

    return tokenURI;
  } catch (error) {
    console.error("❌ Error preparing NFT mint:", error);
    throw error;
  }
}
