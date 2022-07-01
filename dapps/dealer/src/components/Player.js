import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

import web3 from "../utils/web3";
import { PlayerGameContract as RandomGameContract } from "../utils/RandomGameContract";
import CountDownTime from "./CountDownTime";

//let RandomGameContract;
function Player() {
  const [account, setAccount] = useState("");
  const [diceNumber, setDiceNumber] = useState("");
  const [stake, setStake] = useState(0.0001);
  const [status, setStatus] = useState("1");
  const [countTime, setCountTime] = useState(0);

  //=================State functions =====================
  useEffect(() => {
    loadAccountFromMetaMask();
    // RandomGameContract = loadContracts();
    console.log("random game contract");
    console.log({ RandomGameContract });
    registerEvent();
  }, []);

  async function loadAccountFromMetaMask() {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }
  async function registerEvent() {
    try {
      // register event listener
      RandomGameContract.events
        .StartGameEvent({
          fromBlock: 0,
          toBlock: "latest",
        })
        .on("data", (event) => {
          console.log(event);
          const timeStart = event.returnValues.timeStart;
          const timeEnd = event.returnValues.timeEnd;
          const countTime = timeEnd - timeStart;
          const currentTimeInSecond = new Date().getTime() / 1000;
          if (currentTimeInSecond < timeEnd) {
            setCountTime(countTime);
            console.log({ timeStart, timeEnd, countTime });
          }
        })
        .on("error", console.error);

      RandomGameContract.events
        .EndGameEvent({
          fromBlock: 0,
          toBlock: "latest",
        })
        .on("data", (event) => {
          setCountTime(0);
          console.log(event);
          // setDiceNumber(event.returnValues.diceNumber);
          //if (event.returnValues.player.player === account) {
          // const isWiner = event.returnValues.isWiner == 1 ? true : false;
          // alert(`You ${isWiner ? "win" : "lose"}`);
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
    } catch (error) {
      console.log(error);
    }
  }

  //=================Event functions =====================
  async function rollDice() {
    console.log("Rolling dice...");
    console.log({ randomToken: RandomGameContract });
    console.log({ stake, status });

    try {
      const eth = web3.utils.toWei(stake.toString(), "ether");
      await RandomGameContract.methods.placeBet(eth, parseInt(status)).send({
        from: account,
        value: eth,
        //gas: "1000000",
      });
    } catch (error) {
      console.log({ error });
    }
  }

  const handleRadioChange = (e) => {
    setStatus(e.target.value);
  };

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
              <label>ETH</label>
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
              {countTime > 0 && <CountDownTime time={countTime} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Player;
