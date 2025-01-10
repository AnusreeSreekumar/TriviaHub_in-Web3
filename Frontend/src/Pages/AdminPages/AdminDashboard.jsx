import React, { useState } from 'react';
import { ethers } from 'ethers';
import ABI from '../../assets/triviaHub.json';
import cAddress from '../../assets/deployed_addresses.json';
import { create } from "ipfs-http-client";
// import dotenv from 'dotenv';
// 

// dotenv.config();
const AdminDashboard = () => {

    const [formData, setFormData] = useState({
        categoryId: "",
        categoryType: "",
        title: "",
        description: "",
    });

    const ipfs = create({ url: 'http://127.0.0.1:5001' });

    const [ipfsHash, setIpfsHash] = useState('');
    const [jsonData, setJsonData] = useState('');

    async function startIPFS() {
        try {
            const version = await ipfs.id();
            console.log('Connected to IPFS node:', version);
        } catch (error) {
            console.error('Error connecting to IPFS:', error);
        }
    }
    startIPFS();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    async function connectToMetamask() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Ethereum object:', window.ethereum);
        const signer = await provider.getSigner();
        console.log("Addres of Signer: ", signer.address);
        alert(`${signer.address} is successfully logged in`)
    }

    async function handleSubmit(event) {

        event.preventDefault();
        try {
            const jsonData = {
                categoryId: formData.categoryId,
                categoryType: formData.categoryType,
                title: formData.title,
                numberOfQuestions: formData.numofQns,
            };
            console.log("Uploading data to IPFS:", jsonData);

            const ipfsResult = await ipfs.add(JSON.stringify(jsonData));
            console.log("IPFS upload result:", ipfsResult);

            const ipfsHash = ipfsResult.path;
            // console.log("IPFS Hash:", ipfsHash);
            document.getElementById("ipfsHashDisplay").innerText = ipfsHash;

            setIpfsHash(ipfsHash);
            setJsonData(jsonData)

        } catch (error) {
            console.log("Error uploading to IPFS:", error);
        }
    }

    async function storeHashInBlkchn(ipfsHash, jsonData) {
        try {

            console.log("JSON Data is: ", jsonData)
            console.log("IPFSHash is: ", ipfsHash)

            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                console.log("Provider initialized:", provider);

                const signer = await provider.getSigner();
                console.log('Signer is: ', signer.address)

                const cAbi = ABI.abi;
                console.log('ABI: ', cAbi)

                console.log('Contract Address is: ', cAddress['TriviaModule#triviaHub']);

                const catgryInstance = new ethers.Contract(cAddress['TriviaModule#triviaHub'], cAbi, signer.address);
                console.log(catgryInstance);

                const txnReceipt = await catgryInstance.setCatgry(
                    jsonData.categoryId,
                    jsonData.categoryType,
                    ipfsHash);
                console.log("Txn Receipt: ", txnReceipt);
            }
            else {
                console.log("MetaMask is not installed");
            }
        } catch (error) {
            console.log('Error in setCatgry:', error);
        }
    }

    return (
        <div className="min-h-screen items-center justify-center space-x-10">
            <h1 className='bg-cyan-200 text-center'>Admin Dashboard</h1>
            <div className='flex space-x-16'>
                <form onSubmit={handleSubmit} className='bg-slate-300 w-72 mt-24 ml-24 rounded-lg border-4 h-[450px]'>
                    <div className='mt-4 py-2 px-4'>
                        <label>Category ID:</label>
                        <input
                            type="text"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className='mt-2'
                        />
                    </div>
                    <div className='mt-4 py-2 px-4'>
                        <label>Category Type:</label>
                        <input
                            type="text"
                            name="categoryType"
                            value={formData.categoryType}
                            onChange={handleChange}
                            required
                            className='mt-2'
                        />
                    </div>
                    <div className='mt-4 py-2 px-4'>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className='mt-2'
                        />
                    </div>
                    <div className='mt-4 py-2 px-4'>
                        <label>Number of Questions:</label>
                        <input
                            type="text"
                            name="numofQns"
                            value={formData.numofQns}
                            onChange={handleChange}
                            required
                            className='mt-2'
                        />
                    </div>
                    <button type="submit" className='mt-4 bg-blue-500 w-20 h-8 mx-4 my-2 rounded hover:text-white focus:bg-blue-300'>Submit</button>
                </form>
                <div className='mt-16'>
                    <div className="shadow-lg p-8 rounded-lg text-black max-w-lg">
                        <button
                            onClick={connectToMetamask}
                            className="bg-cyan-500 px-5 py-3 rounded-lg shadow-lg uppercase hover:bg-cyan-800 hover:text-white"
                        >
                            Connect to MetaMask
                        </button>
                    </div>

                    <div className='mt-16'>
                        <p>IPFS Hash of added Category is:</p>
                        <p id="ipfsHashDisplay"></p>
                        <button type="submit" className='mt-4 bg-blue-500 w-40 h-8 mx-4 my-2 rounded hover:text-white focus:bg-blue-300'
                            onClick={() => storeHashInBlkchn(ipfsHash, jsonData)}>Save in Blockchain</button>
                    </div>

                </div>


            </div>
        </div >
    )
}

export default AdminDashboard
