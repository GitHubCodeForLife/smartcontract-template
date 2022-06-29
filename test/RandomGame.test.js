/* eslint-disable no-undef */
const RandomGame = artifacts.require("RandomGame");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("RandomGame", async ([owner, player1, player2, player3]) => {
  let randomGame;

  before(async () => {
    randomGame = await RandomGame.new();
  });

  // describe("Test Start Game", async () => {
  //   //   it("test start game role owner", async () => {
  //   //     await randomGame.startGame(10, 10, { from: owner, value: tokens("10") })
  //   //       .should.be.fulfilled;
  //   //   });
  // });

  describe("Test Finish Game", async () => {
    it("test finish game role owner", async () => {
      await randomGame.startGame(10, 10, { from: owner, value: tokens("10") })
        .should.be.fulfilled;
      await randomGame.placeBet(tokens("3"), 1, {
        from: player1,
        value: tokens("3"),
      }).should.be.fulfilled;
      await randomGame.placeBet(tokens("3"), 0, {
        from: player2,
        value: tokens("3"),
      }).should.be.fulfilled;
      await randomGame.finishGame({ from: owner }).should.be.fulfilled;
    });
  });

  describe("Test Play Game", async () => {
    // it("test play game with many players", async () => {
    //   await randomGame.startGame(10, 10, { from: owner }).should.be.fulfilled;
    //   await randomGame.placeBet(100, 1, { from: player1 }).should.be.fulfilled;
    //   await randomGame.placeBet(100, 0, { from: player2 }).should.be.fulfilled;
    //   console.log(await randomGame.getAllPlayers());
    //   await randomGame.finishGame({ from: owner }).should.be.fulfilled;
    // });
    it("test play game with many players with 2 start times", async () => {
      // await randomGame.startGame(10, 10, { from: owner, value: tokens("10") })
      //   .should.be.fulfilled;
      // await randomGame.placeBet(10, 1, { from: player1 }).should.be.fulfilled;
      // console.log(await randomGame.getAllPlayers());
      // console.log(await randomGame.totalSupply());
      // console.log(await randomGame.getBalance());
      // await randomGame.finishGame({ from: owner }).should.be.fulfilled;
      // await randomGame.startGame(10, 10, { from: owner }).should.be.fulfilled;
      // await randomGame.placeBet(10, 0, { from: player1 }).should.be.fulfilled;
      // await randomGame.placeBet(10, 0, { from: player2 }).should.be.fulfilled;
      // console.log(await randomGame.getAllPlayers());
      // console.log(await randomGame.playerCount());
      // console.log(await randomGame.gameId());
      // await randomGame.finishGame({ from: owner }).should.be.fulfilled;
      // console.log(await randomGame.getBlanceOfSmartContract());
    });
  });

  // describe("Test Game flow", async () => {
  //   it("should play game", async () => {
  //     await randomGame.startGame(60);
  //     console.log("Game started");
  //     await randomGame.placeBet(100, 1);
  //     console.log("Bet placed");
  //     await randomGame.placeBet(102, 0);
  //     console.log("Bet placed");

  //     console.log(await randomGame.getAllPlayers());
  //     await randomGame.finishGame();
  //     //   await randomGame.transferOwnership(investor);
  //     await randomGame.startGame(60);
  //     console.log("Game started");
  //     await randomGame.placeBet(100, 1);
  //     await randomGame.finishGame();
  //     console.log("Game finished");
  //   }).timeout(10000);
  // });

  // describe("Test send money for Contract", async () => {
  //   it("should send money for contract", async () => {
  //     await randomGame.sendMoneyForContract(tokens(1), { from: owner });
  //   });
  // });
});
