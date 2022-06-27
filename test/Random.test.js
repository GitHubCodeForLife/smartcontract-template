// const RandomToken = artifacts.require("RandomToken");

// require("chai")
//   .use(require("chai-as-promised"))
//   .should();

// function tokens(n) {
//   return web3.utils.toWei(n, "ether");
// }

// contract("RandomToken", ([owner, investor]) => {
//   let randomToken;

//   before(async () => {
//     // Load Contracts
//     randomToken = await RandomToken.new();
//   });

//   describe("RandomToken deployment", async () => {
//     it("has a name", async () => {
//       const name = await randomToken.name();
//       assert.equal(name, "Random Token");
//     });
//   });

//   // describe("test random function", async () => {
//   //   for (let i = 0; i < 10; i++) {
//   //     it("should return the correct value " + i + " times", async () => {
//   //       await randomToken.random(3, 18);
//   //       const result = await randomToken.getRandomNumber();
//   //       console.log(result);
//   //       assert.equal(3, 3);
//   //     });
//   //   }
//   // });
//   describe("Test transfer Owner ship", async () => {
//     it("should transfer ownership", async () => {
//       await randomToken.transferOwnership(investor);
//       const newOwner = await randomToken.owner();
//       assert.equal(newOwner, investor);
//     });
//   });
// });
