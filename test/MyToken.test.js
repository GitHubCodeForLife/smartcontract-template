const MyToken = artifacts.require("MyToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("MyToken", ([owner, investor]) => {
  let myToken;

  before(async () => {
    // Load Contracts
    myToken = await MyToken.new();
    // console.log({ myToken });
  });

  describe("MyToken deployment", async () => {
    it("has a name", async () => {
      const name = await myToken.name();
      assert.equal(name, "MyToken");
    }).timeout(10000);
  });
  describe("test mint function", async () => {
    it("should mint tokens", async () => {
      await myToken.mint(investor, 50);
      const balance = await myToken.balanceOf(investor);
      assert.equal(balance, 50);
    }).timeout(10000);
  });
});
