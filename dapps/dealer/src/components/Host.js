import React, { Component, useEffect, useState } from "react";

import Navbar from "./Navbar";
import "./App.css";

import web3 from "../utils/web3";
import RandomGameContract from "../utils/RandomGameContract";
import CountDownTime from "./CountDownTime";

function Host() {
  const [time, setTime] = useState(100);
  const [countTime, setCountTime] = useState(0);
  const [account, setAccount] = useState("");

  //=================State functions =====================
  useEffect(() => {
    loadAccountFromMetaMask();
  }, []);

  //=================Event functions =====================
  async function startGame() {
    console.log("Start game");
    console.log({ randomToken: RandomGameContract });
    console.log({ time });
    try {
      //random from 0 to 1000
      const eth = web3.utils.toWei("0.02", "ether");
      const randNone = Math.floor(Math.random() * 1000);
      await RandomGameContract.methods.startGame(time, randNone).send({
        from: account,
        gas: "1000000",
        value: eth,
      });
      setCountTime(0);
      setCountTime(time);
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

  async function loadAccountFromMetaMask() {
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
              {countTime > 0 && <CountDownTime time={countTime} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Host;
