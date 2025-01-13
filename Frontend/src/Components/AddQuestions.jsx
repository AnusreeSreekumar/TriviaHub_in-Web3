import React, { useEffect, useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';

const AddQuestions = ({ categoryData }) => {
    const [categories, setCategories] = useState([]); // Store categories fetched from contract
    const [selectedCategory, setSelectedCategory] = useState(""); // User-selected category
    const [quizId, setQuizId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [contractInst, setContractInst] = useState(null);

    const cAbi = ABI.abi;
    // console.log("ABI", cAbi);
    const cAddress = Address['TriviaModule#triviaHub'];
    // console.log("Address", cAddress)

    // Initialize contract instance
    useEffect(() => {
        const initializeContract = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

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

    // Fetch categories once contract instance is available
    useEffect(() => {
        if (contractInst) {
            fetchCategoryList();
        }
    }, [contractInst]);

    // Function to fetch categories from the contract
    const fetchCategoryList = async () => {
        try {
            const categoryList = await contractInst.listCategories();
            console.log("Categories fetched from contract:", categoryList);
            setCategories(categoryList);
        } catch (error) {
            console.log("No categories available:", error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsedData = JSON.parse(reader.result);
                    if (Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
                        const updatedQuestions = parsedData.questions.map((q, index) => ({
                            ...q,
                            questionId: q.questionId || index + 1,
                        }));
                        setQuestions(updatedQuestions);
                    } else {
                        setQuestions([]);
                    }
                    setIsFileUploaded(true);
                } catch (error) {
                    console.log('Error parsing the JSON file:', error);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedCategory) {
                alert("Please select a category.");
                return;
            }

            console.log("Questions being submitted:", questions);
            const txnReceipt = await contractInst.addQuestionSet(
                quizId,
                selectedCategory,
                difficulty,
                questions
            );
            console.log("Quiz set added successfully:", txnReceipt);
        } catch (error) {
            console.error("Error while adding Quiz Set:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto">
            <h2 className="form-title text-center mb-6 font-bold text-2xl text-purple-600 mt-8">Add Quiz</h2>
            {!isFileUploaded ? (
                <div>
                    <label htmlFor="jsonFile">Upload JSON File:</label>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="file-input mb-4 ml-4"
                    />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4">
                    <div>
                        <label htmlFor="category">Select Category:</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="form-select mb-4 ml-4 w-full p-2 border"
                        >
                            <option value="">-- Select a Category --</option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option>No categories available</option>
                            )}
                        </select>
                    </div>

                    {/* User input for quiz ID */}
                    <div>
                        <label htmlFor="quizId">Quiz ID:</label>
                        <input
                            type="text"
                            id="quizId"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            className="ml-4 p-2 border w-full mb-4"
                            placeholder="Enter Quiz ID"
                        />
                    </div>

                    {/* User input for difficulty */}
                    <div>
                        <label htmlFor="difficulty">Difficulty Level:</label>
                        <input
                            type="text"
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="ml-4 p-2 border w-full mb-4"
                            placeholder="Enter difficulty level (e.g., Easy, Medium, Hard)"
                        />
                    </div>

                    <div className="overflow-y-scroll max-h-96">
                        <h3 className="questions-title text-center mr-10 font-semibold my-4">Questions</h3>
                        {questions.map((question, index) => (
                            <div key={index} className="question">
                                <label>Question {index + 1}:</label>
                                <input
                                    type="text"
                                    value={question.questionText || ''}
                                    onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                                    className="question-input border ml-2 h-10 w-full mb-4"
                                />
                                <div className="options">
                                    <label>Options:</label>
                                    {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                                        <input
                                            key={optionIndex}
                                            type="text"
                                            placeholder={ `Option ${optionIndex + 1}` }
                                            value={option || ''}
                                            onChange={(e) =>
                                                handleQuestionChange(index, "options", [
                                                    ...question.options.slice(0, optionIndex),
                                                    e.target.value,
                                                    ...question.options.slice(optionIndex + 1),
                                                ])
                                            }
                                            className="option-input border w-auto p-2 h-8 mb-4 ml-4"
                                        />
                                    ))}
                                </div>
                                <label>Correct Answer</label>
                                <input
                                    type="text"
                                    placeholder="Correct Answer:"
                                    value={question.answer || ''}
                                    onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                                    className="answer-input border w-fit h-6 mb-4 ml-4"
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="mt-6 submit-btn w-full py-2 rounded-md bg-gray-400 hover:bg-gray-300">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddQuestions;