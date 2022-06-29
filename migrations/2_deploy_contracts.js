const RandomGame = artifacts.require("RandomGame");

module.exports = async function(deployer, network, accounts) {
  if (network === "rinkeby") {
    await deployInRinkeByTestNet(deployer);
  } else if (network === "development") {
    await deployInDevelopmentNetwork(deployer, accounts);
  }
};

async function deployInRinkeByTestNet(deployer) {
  await deployer.deploy(RandomGame);
}

async function deployInDevelopmentNetwork(deployer, accounts) {
  // await deployer.deploy(RandomGame);
  // const random = await RandomGame.deployed();
}
