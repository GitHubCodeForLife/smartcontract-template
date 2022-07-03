import web3, { url_provider } from "./web3";
import Contract from "web3-eth-contract";

const RandomGame = require("../abis/RandomGame.json");

const RandomGameContractAddress = "0x1AE68baB5E9174ee0Ed9Fb48EA16642542d75524";
//const RandomGameContractAddress = "0xa248D6B4D22d76C6F58E4154CC0ffE1f9dd4709C";

export const PlayerGameContract = new web3.eth.Contract(
  RandomGame.abi,
  RandomGameContractAddress
);

Contract.setProvider(url_provider);
export const PlayerGameSocket = new Contract(
  RandomGame.abi,
  RandomGameContractAddress
);

export const HostGameContract = new Contract(
  RandomGame.abi,
  RandomGameContractAddress
);
