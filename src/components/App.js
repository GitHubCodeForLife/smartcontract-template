import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "web3-eth-contract";

import Navbar from "./Navbar";
import RandomToken from "../abis/RandomContract.json";
import MyToken from "../abis/MyToken.json";
import "./App.css";

let randomContract;
let myToken;

// BLOCK CHAIN INFO
const url_blockchain = "http://localhost:7545";

// Contract Address
const randomAddress = "0xb9b159772B69e9F2ECD9252E2Fc264c5c6908E01";
const tokenAddress = "0x0688F771CBb7404bf7E298BF3e1F7Cf3E5bD8B89";

//Owner Addres
const ownerAddress = "0x8611140F6969e01afb644D18cE5eaaEA94aC8213";

function App() {
  const [account, setAccount] = useState("");
  const [diceNumber, setDiceNumber] = useState(0);

  //=================State functions =====================
  useEffect(() => {
    loadWeb3();
    loadAccountFromMetaMask();
    loadContracts();
  }, []);

  //=================Event functions =====================s
  async function rollDice() {
    console.log("Rolling dice...");
    console.log({ randomToken: randomContract });
    await randomContract.methods.random(3, 18).send({ from: account });

    const rand = await randomContract.methods.getRandomNumber().call();
    console.log({ rand });
    setDiceNumber(rand);

    await myToken.methods
      .transfer(ownerAddress, 100000000)
      .send({ from: account });

    const balance = await myToken.methods.balanceOf(account).call();
    console.log({ balance });
  }

  //=================Helper functions =====================
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

  async function loadAccountFromMetaMask() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }
  async function loadContracts() {
    Contract.setProvider(url_blockchain);
    randomContract = await new Contract(RandomToken.abi, randomAddress);
    myToken = await new Contract(MyToken.abi, tokenAddress);
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
