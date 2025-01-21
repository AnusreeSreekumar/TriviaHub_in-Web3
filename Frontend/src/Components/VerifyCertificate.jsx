import React, { useState, useEffect } from 'react'
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';

const VerifyCertificate = () => {

    const [contractInst, setContractInst] = useState(null);

    const cAbi = ABI.abi;
    console.log("ABI", cAbi);
    const cAddress = Address['TriviaModule#triviaHub'];
    console.log("Contract Address", cAddress)

    // Initialize contract instance
    useEffect(() => {
        const initializeContract = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                console.log("Logged in address: ", signer.address);
                // setPlayerAccnt(signer.address);
                if (!cAbi || !cAddress) {
                    console.error("ABI or contract address is missing.");
                    return;
                }
                const contract = new Contract(cAddress, cAbi, signer);
                console.log("Contract instance created:", contract);
                setContractInst(contract);
            } catch (error) {
                console.error("Error initializing contract instance:", error);
            }
        };
        initializeContract();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!contractInst) {
            console.error("Contract instance is not initialized.");
            return;
        }
        try {
            const selectedUser = document.getElementById('userId').value;
            console.log('Selected User: ', selectedUser);

            const existingPlayer = await contractInst.getScoreCert(selectedUser);
            console.log('Existing User: ', existingPlayer);

            const response = await fetch(`http://localhost:5000/fetchUser/${selectedUser}`, {
                credentials: 'include'
            });
            const json_result = await response.json();
            const result = json_result.existingUser
            console.log('Retrieved User from DB ', result);

            if (existingPlayer[0] == result.dbUser) {
                const dbScores = result.dbScores;                
                const blockchainQuizType = existingPlayer[3];                
                const blockchainScore = existingPlayer[1];
               
                const isMatch = dbScores.some(item =>
                    item.quizType.trim().toLowerCase() === blockchainQuizType.trim().toLowerCase() 
                    && item.score === Number(blockchainScore)
                );
                console.log('Match found:', isMatch);
                alert(`Comparison results are: ${isMatch}`)
            }
        } catch (error) {
            console.error("Error uploading to Blockchain:", error);
        }
    };
    return (
        <div className="min-h-screen flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto">
            <h2 className="form-title text-center mb-6 font-bold text-4xl text-purple-600 mt-8">View the Certificate</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4">
                <div>
                    <label htmlFor="userId" className='text-2xl'>Verify Certificate details for authenticity</label>
                    <input
                        type="text"
                        id="userId"
                        required
                        placeholder='Enter valid Metamask public key'
                        className="ml-4 p-2 border w-full mb-4"
                    />
                </div>

                <button type="submit" className="mt-6 submit-btn w-full py-2 rounded-md bg-gray-400 hover:bg-gray-300">
                    Verify
                </button>
            </form>
        </div>
    )
}

export default VerifyCertificate
