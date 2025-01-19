// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract triviaHub {
    struct scoreCert {
        uint256 score;
        string grade;
        string date;
        string gameType;
    }

    mapping(address => scoreCert) public Scores;
    event scoreAdded(address, string, uint256, string);

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require((msg.sender == admin), "Only admin can call this function");
        _;
    }

    function addScores(
        uint256 _score,
        string memory _gameType) public {
        uint256 tempScore = _score;
        string memory slctdgrade;
        if (tempScore >= 91 && tempScore <= 100) {
            slctdgrade = "A+";
        } else if (tempScore >= 81 && tempScore <= 90) {
            slctdgrade = "A";
        } else if (tempScore >= 71 && tempScore <= 80) {
            slctdgrade = "B";
        } else if (tempScore >= 61 && tempScore <= 70) {
            slctdgrade = "C";
        } else if (tempScore >= 50 && tempScore <= 60) {
            slctdgrade = "D";
        } else {
            slctdgrade = "F"; // Default return for scores below 50
        }
        Scores[msg.sender] = scoreCert({
            score: _score,
            grade: slctdgrade,
            date: block.timestamp,
            gameType: _gameType
        });
    }

    function getScoreCert(address user) public view returns (
            uint256,
            string memory,
            string memory,
            string memory){
        scoreCert storage getCert = Scores[user];
        return (getCert.score, getCert.grade, getCert.date, getCert.gameType);
    }

}
