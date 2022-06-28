import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import Contract from "web3-eth-contract";

import Navbar from "./Navbar";
import RandomGame from "../abis/RandomGame.json";
import "./App.css";

let RandomGameContract;

// BLOCK CHAIN INFO
const url_blockchain = "http://localhost:7545";

// Contract Address
const randomGameContract = "0xD84551ca1393f90f8ba3c0293FC82B4365A2a96c";

function App() {
  const [time, setTime] = useState(100);
  const [account, setAccount] = useState("");

  //=================State functions =====================
  useEffect(() => {
    loadWeb3();
    loadAccountFromMetaMask();
    loadContracts();
  }, []);

  //=================Event functions =====================s
  async function startGame() {
    console.log("Start game");
    console.log({ randomToken: RandomGameContract });
    console.log({ time });
    try {
      //random from 0 to 1000
      const randNone = Math.floor(Math.random() * 1000);
      await RandomGameContract.methods.startGame(time, randNone).send({
        from: account,
      });
      setTimeout(() => {
        finishGame();
      }, time * 1000);
    } catch (error) {
      console.log(error);
    }
  }

  async function finishGame() {
    console.log("Finish game");
    console.log({ randomToken: RandomGameContract });
    try {
      await RandomGameContract.methods.finishGame().send({
        from: account,
        gas: "1000000",
      });
    } catch (error) {
      console.log(error);
    }
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
    RandomGameContract = await new Contract(RandomGame.abi, randomGameContract);
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
              <br></br>
              <button onClick={startGame}> Start Game</button>
              <br></br>
              <button onClick={finishGame}> Finish Game</button>
              <br></br>
              {/* Input for stake number */}
              <input
                type="number"
                placeholder="Enter  the time in seconds"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
