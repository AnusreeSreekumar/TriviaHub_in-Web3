# TriviaHub_in-Web3 - Quiz Proof

**QuizProof** is a Certificate generation and verification system that uses blockchain 
technology to make the player score data more safer, transparent, and easier to track. 
It helps prevent tampering of scores earned by a registered player through Trivia Hub 
Quiz App created in Web system. The scores are player details are only migrated to blockchain.
Certificate issue can only be done by Admin profile. Anyone can view the issued certificates 
and also verify the authenticity of the same. 

This is a stratup idea and is open to suggesstions and improvements. Feel free to contact me for the same.

## Built With
![](https://img.shields.io/badge/HTML5-informational?style=flat&logo=HTML5&color=FF4500)
![](https://img.shields.io/badge/TailwindCSS-informational?style=flat&logo=TailwindCSS&color=00BFFF)
![](https://img.shields.io/badge/React-informational?style=flat&logo=React&color=4CAF50)

![](https://img.shields.io/badge/Solidity-informational?style=flat&logo=Solidity&color=4E44CE)
![](https://img.shields.io/badge/Ethereum-informational?style=flat&logo=Ethereum&color=6CACE4)
![](https://img.shields.io/badge/Hardhat-informational?style=flat&logo=Hardhat&color=FF69B4)

## Getting Started

To run the project locally, follow these steps:

### Frontend Setup

1. Clone the repository:
    ```bash
      git@github.com:AnusreeSreekumar/TriviaHub_in-Web3.git
    ```
2. Navigate to the project directory:
    ```bash
    cd TriviaHub_in-Web3/Backend
    cd TriviaHub_in-Web3/Frontend
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the project:
    ```bash
    Frontend: npm run dev
    Backend: node index.js
    ```
    
---

## Smart Contract Setup with Hardhat

To interact with the blockchain and deploy the smart contract, follow these steps:

1. Install Hardhat and the required dependencies:
    ```bash
    cd triviaHub
    npm install -D hardhat @nomicfoundation/hardhat-toolbox
    ```

2. Set up your environment variables by creating a `.env` file in the root of the project with the following content:
    ```bash
    API_KEY=your_sepolia_api
    PRIVATE_KEY=your_private_key
    ```
    
    Replace `your_sepolia_api` with your own Sepolia network URL (e.g., from Infura or Alchemy), and `your_private_key` with the private key of your Sepolia account.

3. Here's the `hardhat.config.js` file you'll be using:

    ```javascript
    require("@nomicfoundation/hardhat-toolbox");
    require("dotenv").config();

    /** @type import('hardhat/config').HardhatUserConfig */
    module.exports = {
      solidity: "0.8.28",
      networks:{
        localhost:{
          url:"http://127.0.0.1:8545/"
        },
        sepolia:{
          url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
          accounts:[process.env.PRIVATE_KEY]
        }
      }
    };
    ```

---

### Demo Video
https://youtu.be/RVDZA87Yhjc

### Notes
- Ensure the `.env` file is added to your `.gitignore` to avoid exposing sensitive information like private keys.
