// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RandomGame is Ownable {
    using SafeMath for uint256;

    //=================== Structs ===================
    struct Player {
        address player;
        uint256 stake; // the number of money that player has staked
        uint8 status; // 0: tai, 1: xiu
    }

    struct Dice {
        uint256 dice1;
        uint256 dice2;
        uint256 dice3;
    }
    //====================== Events ==========================
    //Events mean that the contract will emit an event when something happens.
    event StartGameEvent(uint256 gameId, uint256 timeStart, uint256 timeEnd);
    event EndGameEvent(
        uint256 gameId,
        Player player,
        uint8 isWiner, //1 is winer, 0 is loser
        Dice result
    );
    event PlaceBetEvent(uint256 gameId, Player player);
    //====================== Game States ======================

    uint256 public playerCount = 0;
    uint256 public maxPlayerCount = 100;
    Player[] public players;

    bool public isEnded = true;
    uint256 public endTime = 0;
    uint256 private randNonce = 0;
    uint256 public gameId = 0;

    constructor() {
        endTime = block.timestamp - 10;
    }

    // ====================== Modifier =========================
    // Modifiers and requires are conditions that must be met before a function is executed.
    modifier canPlaceBet() {
        require(block.timestamp <= endTime, "The game has ended");
        require(isEnded == false, "The game has ended");
        _;
    }

    modifier canStartGame() {
        require(block.timestamp >= endTime, "The game has not ended");
        require(isEnded == true, "Game   has not already ended");
        _;
    }

    modifier canFinishGame() {
        require(block.timestamp >= endTime, "The game has not ended");
        require(isEnded == false, "Game has already ended");
        _;
    }

    // ====================== Player Functions ==================
    function placeBet(uint256 stake, uint8 status) public payable canPlaceBet {
        // require time <= endTime
        // require money ? later

        // If player already place a bet, how can he place another bet?
        Player memory player = Player(msg.sender, stake, status);
        // players[playerCount] = player;
        players.push(player);
        playerCount++;
        //Transefer money to owner of contract
        emit PlaceBetEvent(gameId, player);
    }

    // ====================== Owner Functions ==================
    // Owner functions are functions that can only be called by the owner of the contract.

    /*
    @param sessionTime: the time that the game will last (in seconds)
    */
    function startGame(uint256 sessionTime, uint256 _random) public onlyOwner {
        //Block timestamp is the number of seconds since the block was created.
        endTime = block.timestamp + sessionTime;
        isEnded = false;

        // reset game state
        playerCount = 0;
        randNonce = _random;
        gameId++;
        delete players;
        emit StartGameEvent(gameId, block.timestamp, endTime);
    }

    function finishGame() public onlyOwner {
        isEnded = true;
        endTime = block.timestamp;

        Dice memory dice = randomDice();
        uint256 totalDice = dice.dice1 + dice.dice2 + dice.dice3;
        for (uint64 i = 0; i < playerCount; i++) {
            Player memory player = players[i];
            if (canWin(player.status, totalDice)) {
                emit EndGameEvent(gameId, player, 1, dice);
            } else {
                emit EndGameEvent(gameId, player, 0, dice);
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
        //status : 1 tai 11 - 17
        //status : 0 xiu 4 - 10
        if (status == 1) {
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
