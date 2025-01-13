import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';


const AddCategory = () => {

    const [categoryId, setCategoryId] = useState('');
    const dfltCtgryId = 101

    useEffect(() => {
        getUser();
        latestCategoriesId();
    }, []);

    const cAbi = ABI.abi;
    const cAddress = Address['TriviaModule#triviaHub']
    const signerDetails = async () => {
        const provider = new BrowserProvider(window.ethereum);
        console.log("Provider initialized:", provider);
        await provider.getSigner();
    }
    console.log(signerDetails);
    const contractInstance = new Contract(cAddress, cAbi, getSigner);

    // async function getUser() {
    //     try {

    //         const provider = new BrowserProvider(window.ethereum);
    //         console.log("Provider initialized:", provider);
    //         const signer = await provider.getSigner();

    //         const catgryInstance = new Contract(cAddress, cAbi, signer);
    //         setContractInst(catgryInstance);
    //     } catch (error) {
    //         console.log("Error during getUser details: ", error);
    //     }
    // }

    const latestCategoriesId = async () => {
        try {
            const latestId = await contractInstance.getLatestCategoryId();
            setCategoryId(latestId);
        } catch (error) {
            console.log("No categories available:", error.message);
            setCategoryId(dfltCtgryId);
        }
    };

    const [formData, setFormData] = useState({
        categoryId: categoryId,
        categoryType: "",
        title: "",
        numofQns: 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "number" ? +value : value,
        }));
    };

    async function handleSubmit(event) {

        event.preventDefault();
        try {

            const updatedFormData = {
                ...formData,
                categoryId: formData.categoryId + 1,
            };
            setFormData(updatedFormData);
            console.log(updatedFormData.categoryId);
            getUser();
            const catgryExists = await contractInstance.Categories(formData.categoryId);

            if (catgryExists[0] !== "" && catgryExists[1] !== "") {
                console.log("Category ID already exists ", catgryExists);
            }
            else {
                const txnReceipt = await contractInstance.addCategory(
                    formData.categoryId,
                    formData.categoryType,
                    formData.title,
                    formData.numofQns);
                console.log("Txn Receipt: ", txnReceipt);

                //to get the event-emit data
                contractInstance.on('addCatgry', (catgryId, catgryType, title) => {
                    console.log('New Category Added:', catgryId, catgryType, title);
                });
            }
        } catch (error) {
            console.log("Error uploading to Blockchain:", error);
        }
    }

    return (
        <div className='flex space-x-16'>
            <form onSubmit={handleSubmit} className='bg-slate-300 w-80 mt-24 ml-32 rounded-lg border-4 h-[450px]'>
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
                <button type="submit" className='mt-4 bg-blue-500 w-20 h-8 mx-4 my-2 rounded hover:text-white focus:bg-blue-300'>Add</button>
            </form>
        </div>
    )
}

export default AddCategory
