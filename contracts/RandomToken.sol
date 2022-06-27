// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.6.0;

import "./math/SafeMath.sol";
import "./ownership/Ownable.sol";

contract RandomToken {
    using SafeMath for uint256;
    string public name = "Random Token";

    uint256 private randNonce = 0;
    uint256 randNumber;
    uint256 number = 10;

    constructor() public {}

    function random(uint256 min, uint256 max) public {
        // Transaction-Level PRNG
        randNonce = randNonce + 1;
        randNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    block.number,
                    msg.sender,
                    randNonce
                )
            )
        );
        randNumber = min + (randNumber % (max - min + 1));
    }

    function getRandomNumber() public view returns (uint256) {
        return randNumber;
    }

    function setNumber() public {
        number = number * 2;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
