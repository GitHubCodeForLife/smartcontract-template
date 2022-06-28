require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const my_seed =
  "ancient icon crash rough scrap profit party swing exhibit adjust couch picture";
const infura_rinkeby_url =
  "https://mainnet.infura.io/v3/a17fe233314c4e95bceb4bc4fb3399ca";
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    // rinkeby test nest host
    rinkeby: {
      provider: () => new HDWalletProvider(my_seed, infura_rinkeby_url),
      network_id: 1, // rinkeby's id
      gas: 5500000, // rinkeby has a lot of gas
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./dapps/dealer/src/abis/",
  //contracts_build_directory: "./dapps/player/src/abis/",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
};
