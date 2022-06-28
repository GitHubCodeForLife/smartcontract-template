import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "web3-eth-contract";

import Navbar from "./Navbar";
import RandomGame from "../abis/RandomGame.json";
import "./App.css";

let RandomGameContract;

// BLOCK CHAIN INFO
const url_blockchain = "ws://localhost:7545";

// Contract Address
const randomGameContract = "0xD84551ca1393f90f8ba3c0293FC82B4365A2a96c";

function App() {
  const [account, setAccount] = useState("");
  const [diceNumber, setDiceNumber] = useState("");
  const [stake, setStake] = useState(100);
  const [status, setStatus] = useState("1");

  //=================State functions =====================
  useEffect(() => {
    loadWeb3();
    loadAccountFromMetaMask();
    loadContracts();
  }, []);

  //=================Event functions =====================
  async function rollDice() {
    console.log("Rolling dice...");
    console.log({ randomToken: RandomGameContract });
    console.log({ stake, status });
    try {
      // const result = await RandomGameContract.methods.endTime().call();
      // console.log({ result });
      await RandomGameContract.methods
        .placeBet(parseInt(stake), parseInt(status))
        .send({
          from: account,
          gas: "1000000",
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleRadioChange = (e) => {
    setStatus(e.target.value);
  };

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
    RandomGameContract = await new Contract(RandomGame.abi, randomGameContract);

    // register event listener
    RandomGameContract.events
      .StartGameEvent({
        fromBlock: 0,
        toBlock: "latest",
      })
      .on("data", (event) => {
        console.log(event);
        // setDiceNumber(event.returnValues.diceNumber);
      })
      .on("error", console.error);

    RandomGameContract.events
      .StartGameEvent({
        fromBlock: 0,
        toBlock: "latest",
      })
      .on("data", (event) => {
        console.log(event);
        // setDiceNumber(event.returnValues.diceNumber);
      })
      .on("error", console.error);

    RandomGameContract.events
      .EndGameEvent({
        fromBlock: 0,
        toBlock: "latest",
      })
      .on("data", (event) => {
        console.log(event);
        // setDiceNumber(event.returnValues.diceNumber);
        //if (event.returnValues.player.player === account) {
        const isWiner = event.returnValues.isWiner == 1 ? true : false;
        alert(`You ${isWiner ? "win" : "lose"}`);
        // }
      })
      .on("error", console.error);

    RandomGameContract.events
      .PlaceBetEvent({
        fromBlock: 0,
        toBlock: "latest",
      })
      .on("data", (event) => {
        console.log(event);
        // setDiceNumber(event.returnValues.diceNumber);
      })
      .on("error", console.error);
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
              {/* Input for stake number */}
              <input
                type="number"
                placeholder="Enter stake number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
              />
              {/* Radio Groupb */}
              <div>
                <input
                  id="radio-item-1"
                  name="radio-item-1"
                  type="radio"
                  value="1"
                  onChange={handleRadioChange}
                  checked={status === "1"}
                />
                <label htmlFor="radio-item-1">Tai</label>
              </div>
              <div>
                <input
                  id="radio-item-2"
                  name="radio-item-2"
                  type="radio"
                  value="0"
                  onChange={handleRadioChange}
                  checked={status === "0"}
                />
                <label htmlFor="radio-item-2">Xiu</label>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
