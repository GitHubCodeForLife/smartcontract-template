import React, { useRef, useEffect, useState } from "react";
import { HostGameContract as RandomGameContract } from "../utils/RandomGameContract";
import { Button } from "react-bootstrap";
import ReactDice from "react-dice-complete";
import web3 from "../utils/web3";
import CountDownTime from "../components/CountDownTime";
import PlayerCounter from "../components/PlayerCounter";
function Host({ account }) {
  const [diceNumber, setDiceNumber] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [doneRolling, setDoneRolling] = useState(false);
  const [time, setTime] = useState(20);
  const [countTime, setCountTime] = useState(0);
  const [result, setResult] = useState("none");
  const [tPlayer, setTPlayer] = useState(0);
  const [xPlayer, setXPlayer] = useState(0);
  let dice = useRef();

  useEffect(() => {
    registerEvent(account);
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
  //=================Event functions =====================
  async function startGame() {
    console.log("Start game");
    console.log({ randomToken: RandomGameContract });
    console.log({ time });
    try {
      //random from 0 to 1000
      const eth = web3.utils.toWei("19", "ether");

      await RandomGameContract.methods.startGame(time).send({
        from: account,
        gas: "1000000",
        value: eth,
      });
    } catch (error) {
      console.log({ error });
    }
  }
  async function finishGame(account) {
    console.log("Finish game");
    try {
      const randNone = Math.floor(Math.random() * 1000);
      await RandomGameContract.methods.finishGame(randNone).send({
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
  function registerEvent(account) {
    try {
      // register event listener
      RandomGameContract.events.StartGameEvent().on("data", (event) => {
        setTPlayer(0);
        setXPlayer(0);
        setResult("none");
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
        .EndGameEvent()
        .on("data", (event) => {
          setCountTime(0);
          const dice1 = parseInt(event.returnValues.result.dice1);
          const dice2 = parseInt(event.returnValues.result.dice2);
          const dice3 = parseInt(event.returnValues.result.dice3);
          setDiceNumber([dice1, dice2, dice3]);
          setResult(dice1 + dice2 + dice3 >= 11 ? "Tai" : "Xiu");
          console.log(event);
        })
        .on("error", console.error);

      RandomGameContract.events
        .PlaceBetEvent()
        .on("data", (event) => {
          console.log(event);
          if (event.returnValues.player.status === "1")
            setTPlayer((prev) => prev + 1);
          else setXPlayer((prev) => prev + 1);
        })
        .on("error", console.error);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <CountDownTime time={countTime} />
      <div
        style={{
          opacity: showDice ? "1" : "0",
          textAlign: "center",
        }}
      >
        <ReactDice
          numDice={3}
          rollDone={() => {
            setDoneRolling(true);
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
        Result: {result}
      </div>
      <div className="d-flex justify-content-center">
        <span className="mr-2" style={{ fontSize: "20px" }}>
          Betting time (seconds):
        </span>
        <input
          disabled={countTime}
          type="number"
          placeholder="Enter the time in seconds"
          className="custom-input"
          value={time}
          style={{ fontSize: "20px" }}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <PlayerCounter
        tPlayer={tPlayer}
        xPlayer={xPlayer}
        result={result}
        doneRolling={doneRolling}
      />
      <div className="d-flex justify-content-center mt-5">
        <Button
          className="custom-btn"
          onClick={() => startGame()}
          disabled={countTime}
        >
          Start Game
        </Button>
      </div>
      {/* <Button className="custom-btn" onClick={() => finishGame(account)}>
        Finish
      </Button> */}
    </div>
  );
}

export default Host;
