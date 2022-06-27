================================
Dependencies: 
- Nodejs
- On click blockchain
- Truffle (Solidity)
    npm install -g truffle
- Metamask extension
    https://metamask.io/extension
- Ganache (Solidity)
    npm install -g ganache-cli
- Solc (Solidity)
    npm install -g solc
===============================
To run this app: 
1. npm install
2. npm start (to run react app)
3. truffle compile (to compile truffle contracts)
4. truffle console (to interact with truffle contracts)
5. truffle migrate (to migrate truffle contracts)

truffle error : C:\Users\ASUS\AppData\Roaming\npm

================================
Usages: 
- Metamask config 
- using in code 
+ call metamask (metamask.eth.getAccounts())
+ call contract (contract.methods.methodName().send({from: metamask.eth.getAccounts()[0], value: '0x0'}))


===============================
Global npm packages:
- npm list -g
- npm install -g <package>@<version>
- npm uninstall -g <package>




==============================
Call Contract in React APP we need: 
1. Contract provider 
2. Contract ABI
3. Contract address

send methods: 
call methods: 