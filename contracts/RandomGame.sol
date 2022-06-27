// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RandomGame is Ownable {
    using SafeMath for uint256;

    //=================== Struct ===================
    struct Player {
        address player;
        uint256 stake; // the number of money that player has staked
        uint8 status; //0: tai, 1: xiu
    }

    struct Dice {
        uint256 dice1;
        uint256 dice2;
        uint256 dice3;
    }
    //====================== Events ==========================
    //Events mean that the contract will emit an event when something happens.
    event GameEvent(
        uint8 name, // 0: Start,1: Place a Bet,  2: Finish , 3: Win, 4: Lose, 5: Draw
        address player, // the player who trigger the event
        Dice dice // the dice that owner roll
    );
    //====================== Game States ======================

    uint256 public playerCount = 0;
    uint256 public maxPlayerCount = 100;
    Player[] public players;

    bool public isEnded = true;
    uint256 public endTime = 0;
    uint256 private randNonce = 0;

    constructor() {
        endTime = block.timestamp - 10;
    }

    // ====================== Modifier =========================
    // Modifiers and requires are conditions that must be met before a function is executed.
    modifier canPlaceBet() {
        require(block.timestamp <= endTime, "The game has ended");
        _;
    }

    modifier canStartGame() {
        require(block.timestamp >= endTime, "The game has not ended");
        _;
    }

    modifier canFinishGame() {
        require(block.timestamp >= endTime, "The game has not ended");
        _;
    }

    // ====================== Player Functions ==================
    function placeBet(uint256 stake, uint8 status) public payable canPlaceBet {
        // require time <= endTime
        // require money ? later
        require(!isEnded, "Game has ended");

        // If player already place a bet, how can he place another bet?
        Player memory player = Player(msg.sender, stake, status);
        // players[playerCount] = player;
        players.push(player);
        playerCount++;
        //Transefer money to owner of contract
        emit GameEvent(1, msg.sender, Dice(0, 0, 0));
    }

    // ====================== Owner Functions ==================
    // Owner functions are functions that can only be called by the owner of the contract.
    function startGame(uint256 sessionTime) public canStartGame onlyOwner {
        require(isEnded == true, "Game has already ended");
        endTime = block.timestamp + sessionTime;
        isEnded = false;

        // reset game state
        playerCount = 0;
        randNonce = 0;
        emit GameEvent(0, msg.sender, Dice(0, 0, 0));
    }

    function finishGame() public onlyOwner {
        require(isEnded == false, "Game has already ended");
        isEnded = true;

        Dice memory dice = randomDice();
        uint256 totalDice = dice.dice1 + dice.dice2 + dice.dice3;
        for (uint64 i = 0; i < playerCount; i++) {
            Player memory player = players[i];
            if (canWin(player.status, totalDice)) {
                emit GameEvent(3, player.player, dice);
            } else {
                emit GameEvent(4, player.player, dice);
            }
        }
    }

    // ====================== Helper Functions ==================
    // Helper functions are functions that are used by other functions.
    function random(uint256 min, uint256 max) internal returns (uint256) {
        // Transaction-Level PRNG
        randNonce = randNonce + 1;
        uint256 randNumber = uint256(
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
        return min + (randNumber % (max - min + 1));
    }

    function randomDice() internal returns (Dice memory) {
        Dice memory dice = Dice(random(1, 6), random(1, 6), random(1, 6));
        return dice;
    }

    function canWin(uint8 status, uint256 totalDice)
        internal
        pure
        returns (bool)
    {
        //status: 0  tai 11 - 17
        //status : 1 xiu 4 - 10
        if (status == 0) {
            return totalDice >= 11 && totalDice <= 17;
        } else {
            return totalDice >= 4 && totalDice <= 10;
        }
    }

    // ======= Testing functions helpers ============
    // Testing functions are functions that are used to test the contract.
    function getAllPlayers() public view returns (Player[] memory) {
        return players;
    }
}
