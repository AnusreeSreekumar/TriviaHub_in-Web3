// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract triviaHub {
    struct playerSet {
        address user;
        playerScores score;
        uint256 totalScore;
    }

    struct playerScores {
        string quizType;
        uint256 score;
        uint256 date;
    }

    playerSet public Player;
    event playerAdded(address, string, uint256, uint256);

    struct scoreCert {
        address user;
        uint256 score;
        string grade;
        uint256 date;
        string quizType;
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
        address _user,
        uint256 _score,
        string memory _quizType) public onlyAdmin {
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
        uint256 currentTimestamp = block.timestamp;
        Scores[_user] = scoreCert({
            user: _user,
            score: _score,
            grade: slctdgrade,
            date: currentTimestamp,
            quizType: _quizType
        });
        emit scoreAdded(msg.sender, slctdgrade, _score, _quizType);
    }

    function getScoreCert(address user)
        public
        view
        returns (
            address,
            uint256,
            string memory,
            string memory
        )
    {
        scoreCert storage getCert = Scores[user];
        return (getCert.user, getCert.score, getCert.grade, getCert.quizType);
    }
}
