import React, { useEffect, useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';
import CertificateDisplay from './CertificateDisplay';

const ViewCertificate = () => {

    const [contractInst, setContractInst] = useState(null);
    const [certificateData, setCertificateData] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const selectedUser = document.getElementById('userId').value;

            const existingPlayer = await contractInst.getScoreCert(selectedUser);
            setCertificateData(existingPlayer);
            console.log('Data in Blockchain',existingPlayer);

        } catch (error) {
            console.error("Error while adding Quiz Set:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto">
            <h2 className="form-title text-center mb-6 font-bold text-4xl text-purple-600 mt-8">View the Certificate</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4">
                <div>
                    <label htmlFor="userId" className='text-2xl'>Please verify the PlayerId selected?</label>
                    <input
                        type="text"
                        id="userId"
                        required
                        placeholder='Enter valid Metamask public key'
                        className="ml-4 p-2 border w-full mb-4"
                    />
                </div>

                <button type="submit" className="mt-6 submit-btn w-full py-2 rounded-md bg-gray-400 hover:bg-gray-300">
                    View
                </button>
                {certificateData && <CertificateDisplay certificateData={certificateData} />}
            </form>
        </div>
    );
};

export default ViewCertificate;