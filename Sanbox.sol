// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.7.0;

// https://ethereum.stackexchange.com/questions/64108/whats-the-difference-between-address-and-address-payable
// /https://viblo.asia/p/cac-cach-gui-va-nhan-ether-trong-smart-contract-RnB5pBgYZPG

contract Sandbox {
    function withdraw(uint256 amount) public {
        (bool isSuccess, ) = msg.sender.call{value: amount}("");
        require(isSuccess == true, "Cannot withdraw");
    }

    //Eth = 10^9 Gwei
    //1 eth = 10^18 wei
    // msg.sender -> address of the sender
    // msg.value -> amount of ether sent to the contract
    function deposit() public payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

// deposit: send money to contract
// withdraw: get money from contract

// get all money from contract
