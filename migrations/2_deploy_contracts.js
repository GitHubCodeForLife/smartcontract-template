const RandomToken = artifacts.require("RandomToken");
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(RandomToken);
  // const randomToken = await RandomToken.deployed();
};
