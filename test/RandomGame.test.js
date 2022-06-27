const RandomGame = artifacts.require("RandomGame");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("RandomGame", async ([owner, investor]) => {
  let randomGame;

  before(async () => {
    randomGame = await RandomGame.new();
  });

  describe("Test Game flow", async () => {
    it("should play game", async () => {
      await randomGame.startGame(60 * 60 * 1000);
      console.log("Game started");
      await randomGame.placeBet(100, 1);
      console.log("Bet placed");
      await randomGame.placeBet(102, 0);
      console.log("Bet placed");

      console.log(await randomGame.getAllPlayers());
      await randomGame.finishGame();

      console.log("Game finished");
    }).timeout(10000);
  });
});
