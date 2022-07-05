import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import CountDownTime from "../components/CountDownTime";
import ReactDice from "react-dice-complete";
import {
  PlayerGameContract as RandomGameContract,
  PlayerGameSocket,
} from "../utils/RandomGameContract";
import web3 from "../utils/web3";
import "react-dice-complete/dist/react-dice-complete.css";
function Player({ account }) {
  const [diceNumber, setDiceNumber] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [doneRolling, setDoneRolling] = useState(false);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [stake, setStake] = useState(0.1);
  const [bet, setBet] = useState("1");
  const [countTime, setCountTime] = useState(0);
  const [result, setResult] = useState("none");
  let dice = useRef();
  //=================State functions =====================
  useEffect(() => {
    registerEvent();
    // let timer = setTimeout(() => {
    //   setShowDice(true);
    // }, 2000);
    // return () => {
    //   clearTimeout(timer);
    // };
  }, []);
  useEffect(() => {
    if (dice !== null && diceNumber.length !== 0) {
      setShowDice(true);
      setDoneRolling(false);
      dice.rollAll(diceNumber);
    }
  }, [diceNumber]);
  function registerEvent() {
    try {
      // register event listener
      PlayerGameSocket.events
        .StartGameEvent()
        .on("data", (event) => {
          console.log(event);
          setResult("none");
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

      PlayerGameSocket.events
        .EndGameEvent()
        .on("data", (event) => {
          setCountTime(0);
          console.log(event);
          setDiceNumber([
            parseInt(event.returnValues.result.dice1),
            parseInt(event.returnValues.result.dice2),
            parseInt(event.returnValues.result.dice3),
          ]);
          if (event.returnValues) {
            const players = event.returnValues.players;
            const found = players.find((x) => x[0] === account);
            if (found) {
              if (found.isWinner === "1") setResult("win");
              else setResult("lose");
            } else setResult("none");
          }
        })
        .on("error", console.error);

      PlayerGameSocket.events
        .PlaceBetEvent()
        .on("data", (event) => {
          console.log(event);
          if (event.returnValues.player.addr === account) setIsBetPlaced(true);
        })
        .on("error", console.error);
    } catch (error) {
      console.log(error);
    }
  }

  //=================Event functions =====================
  async function placeBet() {
    console.log("Rolling dice...");
    console.log({ randomToken: RandomGameContract });
    console.log({ stake, bet });
    try {
      const eth = web3.utils.toWei(stake.toString(), "ether");
      // const gasEstimation = await RandomGameContract.methods
      //   .placeBet(eth, parseInt(status))
      //   .estimateGas({ from: account, value: eth });
      await RandomGameContract.methods.placeBet(eth, parseInt(bet)).send({
        from: account,
        value: eth,
        //gas: gasEstimation,
      });
    } catch (error) {
      if (error.message && error.message.split("'")[1]) {
        const err = JSON.parse(error.message.split("'")[1]);
        console.log("error: ", err.value.data.message);
      }
      console.log({ error });
    }
  }

  return (
    <div>
      <CountDownTime time={countTime} />
      <div
        style={{
          opacity: showDice ? "1" : "0",
        }}
      >
        <ReactDice
          numDice={3}
          rollDone={() => {
            setDoneRolling(true);
            setIsBetPlaced(false);
          }}
          ref={(r) => (dice = r)}
          faceColor="#3F0071"
          dotColor="#ffffff"
          dieSize="80"
          disableIndividual={true}
          defaultRoll={6}
        />
      </div>
      <div
        className="text-center"
        style={{
          fontSize: "20px",
          opacity: result !== "none" && doneRolling ? "1" : "0",
        }}
      >
        You {result}.
      </div>

      <div className="d-flex justify-content-around  my-4">
        <div
          className={bet === "1" ? "bet" : "bet inactive-bet"}
          onClick={() => {
            if (!isBetPlaced) setBet("1");
          }}
        >
          T
        </div>
        <div
          className={bet === "0" ? "bet" : "bet inactive-bet"}
          onClick={() => {
            if (!isBetPlaced) setBet("0");
          }}
        >
          X
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <span className="mr-2" style={{ fontSize: "20px" }}>
          Your stake:
        </span>
        <input
          disabled={isBetPlaced}
          type="number"
          placeholder="Enter stake number"
          className="custom-input"
          style={{
            width: "50%",
            fontSize: "20px",
          }}
          value={stake}
          onChange={(e) => setStake(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-center mt-5">
        <Button
          className="custom-btn"
          onClick={placeBet}
          disabled={isBetPlaced || countTime <= 0}
        >
          Place bet
        </Button>
      </div>
    </div>
  );
}

export default Player;
