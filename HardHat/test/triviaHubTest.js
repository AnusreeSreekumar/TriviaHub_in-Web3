const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('trivia', function() {

    async function deployContract(){
        
        const [admin, other] = await ethers.getSigners(); 
        const trivia = await ethers.getContractFactory('triviaHub');
        const contractAddress = await trivia.deploy();
       
        return{admin,other, contractAddress}
    }

    it("should be deployed only by admin", async function(){
        const {admin, contractAddress} = await loadFixture(deployContract);
        // console.log(admin, contractAddress);
        expect(contractAddress.deploymentTransaction().from).to.equals(admin.address)
    })

    it("Able to issue and read certificate", async function(){
        const {contractAddress} = await loadFixture(deployContract);
        const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        await contractAddress.addScores(90, "13/12/2024", "Quiz")
        const certificate = await contractAddress.Scores(userAddress)
        console.log("Certificate Dtls: ",certificate);
        expect(certificate[0]).to.equals(90);
        expect(certificate[1]).to.equals("A");
        expect(certificate[2]).to.equals("13/12/2024");
        expect(certificate[3]).to.equals("Quiz");
    })
  
})
