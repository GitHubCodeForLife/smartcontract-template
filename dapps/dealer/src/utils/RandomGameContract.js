import web3 from "./web3";
const RandomGame = require("../abis/RandomGame.json");

// const RandomGameContractAddress = "0x19dfa5b2d59826cee1f0697ad853f5118aa3275b";
const RandomGameContractAddress = "0xa248D6B4D22d76C6F58E4154CC0ffE1f9dd4709C";

const RandomGameContract = new web3.eth.Contract(
  RandomGame.abi,
  RandomGameContractAddress
);

export default RandomGameContract;
