import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployQuestNft: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const deployment = await deploy("QuestNFT", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  log(`QuestNFT deployed at: ${deployment.address}`);
};

export default deployQuestNft;
deployQuestNft.tags = ["QuestNFT"];
