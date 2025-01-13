import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';

const AddCategory = () => {
    const [categoryId, setCategoryId] = useState('');
    const [contractInst, setContractInst] = useState(null); // To store the contract instance
    const dfltCtgryId = 101;

    const cAbi = ABI.abi;
    const cAddress = Address['TriviaModule#triviaHub'];

    useEffect(() => {
        const initializeContract = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(cAddress, cAbi, signer);
                setContractInst(contract);
            } catch (error) {
                console.error("Error initializing contract instance:", error);
            }
        };

        initializeContract();
    }, []);

    useEffect(() => {
        if (contractInst) {
            fetchLatestCategoryId();
        }
    }, [contractInst]);

    const fetchLatestCategoryId = async () => {
        try {
            const latestId = await contractInst.getLatestCategoryId();
            setCategoryId(latestId);
        } catch (error) {
            console.error("No categories available:", error.message);
            setCategoryId(dfltCtgryId);
            console.log(dfltCtgryId);
            
        }
    };

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            categoryId: categoryId || dfltCtgryId, // Use the updated categoryId or default
        }));
    }, [categoryId]); 

    const [formData, setFormData] = useState({
        categoryId: dfltCtgryId,
        categoryType: '',
        title: '',
        numofQns: 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'number' ? +value : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!contractInst) {
            console.error("Contract instance is not initialized.");
            return;
        }
    
        try {
            // Check if category already exists
            const catgryExists = await contractInst.Categories(formData.categoryId);
            if (catgryExists[0] !== '' && catgryExists[1] !== '') {
                console.log("Category ID already exists:", catgryExists);
                return;
            }
    
            // Add new category details first
            const txnReceipt = await contractInst.addCategory(
                formData.categoryId,
                formData.categoryType,
                formData.title,
                formData.numofQns
            );
            console.log("Transaction Receipt:", txnReceipt);
    
            // Listen for the event
            contractInst.on('addCatgry', (catgryId, catgryType, title) => {
                console.log('New Category Added:', catgryId, catgryType, title);
            });
    
            // Increment the category ID after adding the details
            setFormData((prevState) => ({
                ...prevState,
                categoryId: +prevState.categoryId + 1, // Increment the categoryId
                categoryType: '',
                title: '',
                numofQns: 0,
            }));
        } catch (error) {
            console.error("Error uploading to Blockchain:", error);
        }
    };

    return (
        <div className='flex space-x-16'>
            <form
                onSubmit={handleSubmit}
                className='bg-slate-300 w-80 mt-24 ml-32 rounded-lg border-4 h-[450px]'
            >
                <div className='mt-4 py-2 px-4'>
                    <label>Category ID:</label>
                    <input
                        type='text'
                        name='categoryId'
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className='mt-2'
                    />
                </div>
                <div className='mt-4 py-2 px-4'>
                    <label>Category Type:</label>
                    <input
                        type='text'
                        name='categoryType'
                        value={formData.categoryType}
                        onChange={handleChange}
                        required
                        className='mt-2'
                    />
                </div>
                <div className='mt-4 py-2 px-4'>
                    <label>Title:</label>
                    <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className='mt-2'
                    />
                </div>
                <div className='mt-4 py-2 px-4'>
                    <label>Number of Questions:</label>
                    <input
                        type='number'
                        name='numofQns'
                        value={formData.numofQns}
                        onChange={handleChange}
                        required
                        className='mt-2'
                    />
                </div>
                <button
                    type='submit'
                    className='mt-4 bg-blue-500 w-20 h-8 mx-4 my-2 rounded hover:text-white focus:bg-blue-300'
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddCategory;