// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") {
        // set total supply to 1 million tokens
    }

    /*https://eth-converter.com/
    Wei = 1 
    Gwet = 1000000000 Wei
    Ether = 1000000000000000000 Wei
    amount is in Wei
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    //this function will call every time when someone send ether from metamask to this contract
    receive() external payable {
        _mint(msg.sender, msg.value);
    }

    fallback() external payable {
        _mint(msg.sender, msg.value);
    }
}
