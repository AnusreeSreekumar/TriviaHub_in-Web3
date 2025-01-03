import React, { useState } from 'react';
import { ethers } from 'ethers';
import ABI from '../../assets/triviaHub.json';
import cAddress from '../../assets/deployed_addresses.json';
import IPFS from 'ipfs-core'
// import dotenv from 'dotenv';
// import { create } from "ipfs-http-client";

// dotenv.config();
const AdminDashboard = () => {

    const [formData, setFormData] = useState({
        categoryId: "",
        categoryType: "",
        title: "",
        description: "",
    });

    async function startIPFS() {
        const ipfs = await IPFS.create();
        console.log('IPFS instance running');
    }
    
    startIPFS();

    // const projectId = "a397fb3a55f641d69603d8803f98d4a7";
    // const projectSecret = "TAJCViTBKKv+lWkAby4MiWKlh1VGrruLo95RCim64X2GTd985uNDEA";
    // const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

    // const ipfs = create({
    //     url: "https://ipfs.infura.io:5001/api/v0",
    //     headers: {
    //         authorization
    //     }
    // })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    async function connectToMetamask() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer.address);
        alert(`${signer.address} is successfully logged in`)
    }

    async function handleSubmit(event) {

        event.preventDefault();
        try {
            const jsonData = {
                categoryId: formData.catgryId,
                categoryType: formData.catgryType,
                title: formData.title,
                numberOfQuestions: formData.numofQns,
            };
            console.log("Uploading data to IPFS:", jsonData);

            const ipfsResult = await ipfs.add(JSON.stringify(jsonData));
            console.log("IPFS upload result:", ipfsResult);

            const ipfsHash = ipfsResult.path; // Get the IPFS hash
            console.log("IPFS Hash:", ipfsHash);
            return ipfsHash, jsonData;
        } catch (error) {
            console.log("Error uploading to IPFS:", error);
        }
    }

    async function storeHashInBlkchn(ipfsHash, jsonData) {
        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const cAbi = ABI.abi;
            console.log('Contract Address is: ', cAddress);
            const catgryInstance = new ethers.Contract(cAddress, cAbi, signer);
            console.log(certiInstance);

            const txnReceipt = await catgryInstance.setCatgry(
                jsonData.categoryId,
                jsonData.categoryType,
                ipfsHash);
            console.log(txnReceipt);
        } catch (error) {

        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center space-x-10">
            <h1 className='bg-cyan-200 text-center'>Admin Dashboard</h1>
            <div className="shadow-lg p-8 rounded-lg text-black max-w-lg">
                <button
                    onClick={connectToMetamask}
                    className="bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg uppercase hover:bg-red-800"
                >
                    Connect to MetaMask
                </button>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Category ID:</label>
                        <input
                            type="text"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Category Type:</label>
                        <input
                            type="text"
                            name="categoryType"
                            value={formData.categoryType}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>

        </div >
    )
}

export default AdminDashboard
