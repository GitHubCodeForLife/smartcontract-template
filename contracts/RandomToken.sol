// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RandomToken is ERC20, Ownable {
    constructor() ERC20("RandomToken", "RDTK") {}

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

    function withdraw(uint256 amount) public payable onlyOwner returns (bool) {
        require(amount <= balanceOf(msg.sender));
        _burn(msg.sender, amount);
        return true;
    }
}
