// const SandBox = artifacts.require("SandBox");

// require("chai")
//   .use(require("chai-as-promised"))
//   .should();

// /*
// convert n to ether
// @param  n : string
//  */
// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

// contract("SandBox", ([owner, investor, tx3, account4]) => {
//   let sanBox;

//   before(async () => {
//     sanBox = await SandBox.new();
//   });

//   describe("SanBox deployment", async () => {
//     it("deposit tokens", async () => {
//       await sanBox.deposit({
//         from: investor,
//         value: tokens("1"),
//       });
//       const balance = await sanBox.getBalance();
//       console.log(balance);
//       assert.equal(balance, tokens("1"));
//     }).timeout(10000);

//     it("withdraw tokens", async () => {
//       await sanBox.withdraw(tokens("1"), {
//         from: investor,
//       });
//       const balance = await sanBox.getBalance();
//       console.log(balance);
//       assert.equal(balance, 0);
//     }).timeout(10000);
//   });
// });
