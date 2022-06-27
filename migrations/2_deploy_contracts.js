const RandomContract = artifacts.require("RandomContract");
const MyToken = artifacts.require("MyToken");

module.exports = async function(deployer, network, accounts) {
  if (network === "rinkeby") {
    await deployInRinkeByTestNet(deployer);
  } else if (network === "development") {
    await deployInDevelopmentNetwork(deployer, accounts);
  }
};

async function deployInRinkeByTestNet(deployer) {
  await deployer.deploy(RandomContract);
  await deployer.deploy(MyToken);
}

async function deployInDevelopmentNetwork(deployer, accounts) {
  await deployer.deploy(RandomContract);
  const random = await RandomContract.deployed();
  // console.log({ random });
  await deployer.deploy(MyToken);
  const myToken = await MyToken.deployed();
  // console.log({ myToken });

  /*
   Dealer will be the first account
  */
  await myToken.mint(accounts[0], 100);
  const balance = await myToken.balanceOf(accounts[0]);
  console.log({ balance });
}
