// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./SafeMath.sol";

contract RandomGame is Ownable {
    using SafeMath for uint256;

    //=================== Structs ===================
    struct Player {
        address payable addr;
        uint256 stake; // the number of money that player has staked
        uint8 status; // 0: xiu, 1: tai
        uint8 isWinner; // 0: Lose, 1: Win
    }

    struct Dice {
        uint256 dice1;
        uint256 dice2;
        uint256 dice3;
    }
    //====================== Events ==========================
    //Events mean that the contract will emit an event when something happens.
    event StartGameEvent(uint256 gameId, uint256 timeStart, uint256 timeEnd);
    event EndGameEvent(uint256 gameId, Player[] players, Dice result);
    event PlaceBetEvent(uint256 gameId, Player player, uint256 totalPlayer);
    event Received(address, uint256);

    //====================== Game States ======================

    uint256 public playerCount = 0;
    uint256 public constant maxPlayerCount = 10;
    uint256 public maxPlayerStake = 1 ether; //0.01
    uint256 public minPlayerStake = 0.1 ether; //0.001
    Player[] public players;

    bool public isEnded = true;
    uint256 public endTime = 0;
    uint256 public startTime = 0;
    uint256 private randNonce = 0;
    uint256 public gameId = 0;

    // ====================== Modifier =========================
    // Modifiers and requires are conditions that must be met before a function is executed.
    // Game Condition:
    // Player:
    //      max player = 100
    //      max stake = 10 Gwei
    // Owner:
    //      Start Game condition has enough money to pay for the game
    //      End Game condition has enough money to pay for the game

    modifier canPlaceBet() {
        //check game has end
        require(startTime < endTime, "The game has ended");
        require(isEnded == false, "The game has ended");
        //check max and min stake
        require(msg.value >= minPlayerStake, "Your stake is too low");
        require(msg.value <= maxPlayerStake, "Your stake is too high");
        //check max player
        require(playerCount < maxPlayerCount, "Game session is full");
        //check player is not in game
        for (uint256 i = 0; i < playerCount; i++) {
            require(
                players[i].addr != msg.sender,
                "Player already placed bet!"
            );
        }
        _;
    }

    modifier canStartGame() {
        //check the owner has enough money to start the game
        require(
            msg.value >= (maxPlayerCount * maxPlayerStake * 19) / 10,
            "You don't have enough money to start the game"
        );
        require(startTime >= endTime, "Game session has not ended");
        require(isEnded == true, "Game session has not ended");
        _;
    }

    modifier canFinishGame() {
        require(startTime < endTime, "Game session has not started");
        require(isEnded == false, "Game session has not started");
        _;
    }

    // ====================== Player Functions ==================
    function placeBet(uint256 stake, uint8 status) public payable canPlaceBet {
        require(stake >= minPlayerStake, "Your stake is too low");
        require(stake <= maxPlayerStake, "Your stake is too high");
        require(status == 0 || status == 1, "Your betting value is not valid!");
        Player memory player = Player(msg.sender, stake, status, 0);
        players.push(player);
        playerCount++;

        //Transefer money to owner of contract
        emit PlaceBetEvent(gameId, player, playerCount);
    }

    // ====================== Owner Functions ==================
    // Owner functions are functions that can only be called by the owner of the contract.

    /*
    @param sessionTime: the time that the game will last (in seconds)
    */
    function startGame(uint256 sessionTime)
        public
        payable
        onlyOwner
        canStartGame
    {
        //Block timestamp is the number of seconds since the block was created.
        startTime = block.timestamp;
        endTime = startTime + sessionTime;
        isEnded = false;

        // reset game state
        playerCount = 0;
        gameId++;
        delete players;
        emit StartGameEvent(gameId, startTime, endTime);
    }

    function finishGame(uint256 random) public onlyOwner canFinishGame {
        isEnded = true;
        endTime = 0;
        randNonce = random;

        Dice memory dice = randomDice();
        uint256 totalDice = dice.dice1 + dice.dice2 + dice.dice3;

        Player[] memory result = new Player[](playerCount);
        for (uint64 i = 0; i < playerCount; i++) {
            Player memory player = players[i];
            if (canWin(player.status, totalDice)) {
                player.isWinner = 1;
                (bool isSuccess, ) = player.addr.call{
                    value: (player.stake * 19) / 10
                }("");
                require(isSuccess == true, "Transfer money to player failed");
            } else {
                player.isWinner = 0;
            }
            result[i] = player;
        }
        emit EndGameEvent(gameId, result, dice);
        withDrawAllMoney();
    }

    // ====================== Helper Functions ==================
    // Helper functions are functions that are used by other functions.
    function random(uint256 min, uint256 max) internal returns (uint256) {
        // Transaction-Level PRNG
        randNonce = randNonce + 1;
        // address of middle player
        address add = playerCount > 0
            ? players[playerCount / 2].addr
            : address(this);
        uint256 randNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    block.number,
                    block.coinbase,
                    add, //address of the middle player
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
        //status : 0  xiu 4 - 10
        //status : 1  tai 11 - 17
        if (status == 1) {
            return totalDice >= 11 && totalDice <= 17;
        } else {
            return totalDice >= 4 && totalDice <= 10;
        }
    }

    function withDrawAllMoney() public {
        (bool isSuccess, ) = msg.sender.call{value: address(this).balance}("");
        require(isSuccess == true, "Cannot withdraw");
    }

    // ======= Testing functions helpers ============
    // Testing functions are functions that are used to test the contract.

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
