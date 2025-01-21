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
        console.log("admin accnt: ", admin);
        expect(contractAddress.deploymentTransaction().from).to.equals(admin.address)
    })

    it("Able to add and retrieve player", async function(){
        const {other, contractAddress} = await loadFixture(deployContract);
        await contractAddress.newPlayer(other, "DotNet", 78, 145)
        const player = await contractAddress.getPlayer(other)
        console.log("Player Dtls: ",player);
        expect(player[0]).to.equals(other);
        expect(player[1]).to.equals("DotNet");
        expect(player[2]).to.equals(78);
        expect(player[4]).to.equals(145);
    })

    it("Able to issue and read certificate", async function(){
        const {other, contractAddress} = await loadFixture(deployContract);
        await contractAddress.addScores(other.address, 78, "DotNet")
        const certificate = await contractAddress.getScoreCert(other.address)
        console.log("Certificate Dtls: ",certificate);
        expect(certificate[0]).to.equals(78);
        expect(certificate[1]).to.equals("B");
        expect(certificate[3]).to.equals("DotNet");
    }) 
})
