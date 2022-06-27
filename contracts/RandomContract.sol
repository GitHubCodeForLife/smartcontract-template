// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RandomContract is Ownable {
    using SafeMath for uint256;
    string public name = "Random";

    uint256 private randNonce = 0;
    uint256 randNumber;

    // constructor() public {}

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
}
