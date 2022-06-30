import web3 from "./web3";
import Contract from "web3-eth-contract";

const RandomGame = require("../abis/RandomGame.json");

const RandomGameContractAddress = "0x9D62a9a4C820594a7a03a02c706a5c67Fc4c6152";
//const RandomGameContractAddress = "0xa248D6B4D22d76C6F58E4154CC0ffE1f9dd4709C";

export const PlayerGameContract = new web3.eth.Contract(
  RandomGame.abi,
  RandomGameContractAddress
);

const url_provider = "ws://localhost:7545";
Contract.setProvider(url_provider);
export const HostGameContract = new Contract(
  RandomGame.abi,
  RandomGameContractAddress
);
