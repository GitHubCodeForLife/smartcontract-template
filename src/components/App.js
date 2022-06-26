import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "web3-eth-contract";

import Navbar from "./Navbar";
// import Main from "./Main";
import RandomToken from "../abis/RandomToken.json";
import "./App.css";

let randomToken;
function App() {
  const [account, setAccount] = useState("");
  const [diceNumber, setDiceNumber] = useState(0);

  //State functions
  useEffect(() => {
    loadWeb3();
    loadAccountFromMetaMask();
    loadContract();
  }, []);

  //Event functions
  async function rollDice() {
    console.log("Rolling dice...");
    console.log({ randomToken });
    await randomToken.methods.random(3, 18).send({ from: account });
    await randomToken.methods.setNumber().send({ from: account });

    const rand = await randomToken.methods.getRandomNumber().call();
    const number = await randomToken.methods.getNumber().call();
    console.log({ rand, number });
    setDiceNumber(rand);
  }

  //Helper functions
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async function loadContract() {
    Contract.setProvider("http://localhost:7545");
    const contractAddress = "0x3B110cdc1e47810739A8a4185Df483650C0cb0a3";
    randomToken = await new Contract(RandomToken.abi, contractAddress);
  }

  async function loadAccountFromMetaMask() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              ></a>

              <button onClick={rollDice}> Roll Dice </button>
              <p>{diceNumber}</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
