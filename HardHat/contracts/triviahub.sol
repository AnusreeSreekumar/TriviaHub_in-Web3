// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract triviaHub {
    address public admin;

    struct Category {
        uint8 catgryId;
        string catgryType;
        string title;
        uint256 numberOfQuestions;
    }
    uint public latestCatgId;
    mapping(uint => Category) public Categories;
    uint8[] public categoryIds;
    event addCatgry(uint, string, string);

    struct Player {
        address walletAddress;
        uint256 totalScore;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 scores;
        uint256 setId;
    }
    mapping(address => Player) public Players;
    address[] public playerList;
    event PlayerRegistered(address indexed walletAddress, uint256 createdAt);
    event PlayerScoreUpdated(
        address indexed player,
        uint256 totalScore,
        uint256 quizScore,
        uint256 QuizId
    );

    struct Question {
        uint256 questionId;
        uint256 catgryId;
        string difficulty;
        string questionText;
        string[] options;
        string correctOption;
        uint256 createdAt;
    }

    struct QuestionSet {
        uint8 setId;
        uint8 catgryType;
        string difficulty;
        Question[] questions;
    }
    uint256 public latestQuizId;
    mapping(uint256 => QuestionSet) public questionSets;
    uint8[] public quizIds;
    event addQstn(uint256, uint256);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require((msg.sender == admin), "Not authorised");
        _;
    }

    function addCategory(
        uint8 _catgryId,
        string memory _catgryType,
        string memory _title,
        uint256 _numberOfQuestions
    ) public onlyAdmin {
        Categories[_catgryId] = Category({
            catgryId: _catgryId,
            catgryType: _catgryType,
            title: _title,
            numberOfQuestions: _numberOfQuestions
        });
        emit addCatgry(_catgryId, _catgryType, _title);
    }

    function getLatestCategoryId() public view returns (uint8) {
        require(categoryIds.length > 0, "No categories available.");
        return categoryIds[categoryIds.length - 1];
    }

    function listCategories() public view returns (Category[] memory) {
        Category[] memory categoryList = new Category[](latestCatgId);
        for (uint i = 1; i <= latestCatgId; i++) {
            categoryList[i - 1] = Categories[i];
        }
        return categoryList;
    }

    function addQuestionSet(
        uint8 _setId,
        uint8 _catgryType,
        string memory _difficulty,
        Question[] memory _questions
    ) public onlyAdmin {
        QuestionSet storage newSet = questionSets[_setId];
        newSet.setId = _setId;
        newSet.catgryType = _catgryType;
        newSet.difficulty = _difficulty;
        for (uint i = 0; i < _questions.length; i++) {
            newSet.questions.push(_questions[i]);
        }
        emit addQstn(_setId, _catgryType);
    }

     function getLatestQuizId() public view returns (uint8) {
        require(quizIds.length > 0, "No Quiz set available.");
        return quizIds[quizIds.length - 1];
    }

    function listQuestionSets() public view returns (QuestionSet[] memory) {
        QuestionSet[] memory questionSetList = new QuestionSet[](latestQuizId);
        for (uint i = 1; i <= latestQuizId; i++) {
            questionSetList[i - 1] = questionSets[i];
        }
        return questionSetList;
    }

    function copyQuestionSetToStorage(
        QuestionSet[] memory questionSetList
    ) public onlyAdmin{
        for (uint256 i = 0; i < questionSetList.length; i++) {
            QuestionSet storage questionSet = questionSets[i];
            questionSet.setId = questionSetList[i].setId;
            questionSet.catgryType = questionSetList[i].catgryType;
            questionSet.difficulty = questionSetList[i].difficulty;
            for (uint256 j = 0; j < questionSetList[i].questions.length; j++) {
                questionSet.questions.push(questionSetList[i].questions[j]);
            }
        }
    }

    // function addPlayer() public {
    //     require(
    //         Players[msg.sender].walletAddress == address(0),
    //         "Player already registered"
    //     );
    //     Players[msg.sender] = Player({
    //         walletAddress: msg.sender,
    //         totalScore: 0,
    //         createdAt: block.timestamp,
    //         updatedAt: block.timestamp,
    //         scores: 0,
    //         setId: 0
    //     });
    //     playerList.push(msg.sender);
    //     emit PlayerRegistered(msg.sender, block.timestamp);
    // }

    // function updatePlayer(uint256 _setId, uint256 _score) public {
    //     Player memory player = Players[msg.sender];
    //     player.totalScore += _score;
    //     player.scores = _score;
    //     player.setId = _setId;
    //     player.updatedAt = block.timestamp;
    //     emit PlayerScoreUpdated(msg.sender, player.totalScore, _score, _setId);
    // }

    // function getPlayerStats() public view returns (Player[] memory) {
    //     Player[] memory playerStats = new Player[](playerList.length);
    //     for (uint i = 0; i < playerList.length; i++) {
    //         playerStats[i] = Players[playerList[i]];
    //     }
    //     return playerStats;
    // }

    // function getQuizSummary()
    //     public
    //     view
    //     returns (
    //         uint256 totalQuizzes,
    //         uint256 totalQuestions,
    //         uint256 avgQuestionsPerSet
    //     )
    // {
    //     totalQuizzes = latestQuizId;
    //     uint256 questionCount = 0;
    //     for (uint i = 1; i <= latestQuizId; i++) {
    //         questionCount += questionSets[i].questions.length;
    //     }
    //     avgQuestionsPerSet = totalQuizzes > 0
    //         ? questionCount / totalQuizzes
    //         : 0;
    //     return (totalQuizzes, questionCount, avgQuestionsPerSet);
    // }

    // function calculateScore(
    //     uint256 _setId,
    //     string[] memory _playerAnswers
    // ) public view {
    //     QuestionSet memory questionSet = questionSets[_setId];
    //     Question[] memory tempQuestions = questionSet.questions;
    //     delete questionSet.questions;
    //     require(
    //         Players[msg.sender].walletAddress != address(0),
    //         "Player not registered"
    //     );
    //     require(
    //         _playerAnswers.length == tempQuestions.length,
    //         "Invalid number of answers"
    //     );

    //     uint256 score = 0;

    //     for (uint256 i = 0; i < tempQuestions.length; i++) {
    //         Question memory question = tempQuestions[i];
    //         bool isCorrect = keccak256(abi.encodePacked(_playerAnswers[i])) ==
    //             keccak256(abi.encodePacked(question.correctOption));
    //         if (isCorrect) {
    //             score += 1;
    //         }
    //     }
    // }

    // function getLeaderboard()
    //     public
    //     view
    //     returns (address[] memory, uint256[] memory)
    // {
    //     uint256 totalPlayers = playerList.length;
    //     address[] memory playerAddresses = new address[](totalPlayers);
    //     uint256[] memory scores = new uint256[](totalPlayers);

    //     for (uint256 i = 0; i < totalPlayers; i++) {
    //         address playerAddress = playerList[i];
    //         playerAddresses[i] = playerAddress;
    //         scores[i] = Players[playerAddress].totalScore;
    //     }
    //     return (playerAddresses, scores);
    // }
}
