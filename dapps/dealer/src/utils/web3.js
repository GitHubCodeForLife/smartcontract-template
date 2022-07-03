import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
  console.log("Vao if");
  console.log(window.web3.currentProvider);
} else {
  const url_provider = "ws://localhost:7545";
  // "wss://rinkeby.infura.io/ws/v3/a17fe233314c4e95bceb4bc4fb3399ca";
  const provider = new Web3.providers.WebsocketProvider(url_provider);
  web3 = new Web3(provider);
  console.log("Vao else");
}
// "wss://rinkeby.infura.io/ws/v3/a17fe233314c4e95bceb4bc4fb3399ca";
//const provider = new Web3.providers.WebsocketProvider(url_provider);
// const web3 = new Web3(window.web3.currentProvider);
export const url_provider = "ws://localhost:7545";
export default web3;
