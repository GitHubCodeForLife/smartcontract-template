import React, { Component, useEffect, useState } from "react";

import Navbar from "./Navbar";
import "./App.css";

import web3 from "../utils/web3";
import { HostGameContract as RandomGameContract } from "../utils/RandomGameContract";
import CountDownTime from "./CountDownTime";

function Host() {
  const [time, setTime] = useState(20);
  const [countTime, setCountTime] = useState(0);
  const [account, setAccount] = useState("");

  //=================State functions =====================
  useEffect(() => {
    const setUp = async () => {
      const account = await loadAccountFromMetaMask();
      registerEvent(account);
    };
    setUp();
  }, []);

  //=================Event functions =====================
  function registerEvent(account) {
    try {
      // register event listener
      RandomGameContract.events
        .StartGameEvent({
          fromBlock: 0,
        })
        .on("data", (event) => {
          console.log(event);
          const timeStart = event.returnValues.timeStart;
          const timeEnd = event.returnValues.timeEnd;
          const currentTimeInSecond = new Date().getTime() / 1000;
          const countTime = timeEnd - timeStart;
          if (currentTimeInSecond < timeEnd) {
            setCountTime(0);
            setCountTime(countTime);
            setTimeout(() => finishGame(account), countTime * 1000);
          }
        });
      RandomGameContract.events
        .EndGameEvent({
          fromBlock: 0,
        })
        .on("data", (event) => {
          setCountTime(0);
          console.log(event);
        })
        .on("error", console.error);

      RandomGameContract.events
        .PlaceBetEvent({
          fromBlock: 0,
        })
        .on("data", (event) => {
          console.log(event);
        })
        .on("error", console.error);
    } catch (error) {
      console.log(error);
    }
  }
  async function finishGame(account) {
    console.log("Finish game");
    try {
      await RandomGameContract.methods.finishGame().send({
        from: account,
        gas: "1000000",
      });
    } catch (error) {
      if (error.message && error.message.split("'")[1]) {
        const err = JSON.parse(error.message.split("'")[1]);
        console.log("error: ", err.value.data.message);
      }
      console.log({ error });
    }
  }
  async function startGame() {
    console.log("Start game");
    console.log({ randomToken: RandomGameContract });
    console.log({ time });
    try {
      //random from 0 to 1000
      const eth = web3.utils.toWei("19", "ether");
      const randNone = Math.floor(Math.random() * 1000);
      await RandomGameContract.methods.startGame(time, randNone).send({
        from: account,
        gas: "1000000",
        value: eth,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  //=================Helper functions =====================

  async function loadAccountFromMetaMask() {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    return accounts[0];
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
              <button
                onClick={() =>
                  RandomGameContract.methods.finishGame().send({
                    from: account,
                    gas: "1000000",
                  })
                }
              >
                {" "}
                Finish Game
              </button>
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
            <button
              onClick={async () => {
                const balance = await RandomGameContract.methods
                  .getBalance()
                  .call();
                console.log({ balance });
              }}
            >
              get balance
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Host;
