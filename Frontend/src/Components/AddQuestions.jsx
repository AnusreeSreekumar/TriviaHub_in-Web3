import React, { useEffect, useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';

const AddQuestions = ({ categoryData }) => {

    const [selectedCategory, setSelectedCategory] = useState(categoryData?.dbTitle || '');
    const [quizId, setQuizId] = useState()
    const [questions, setQuestions] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUserData(user); 
        }
        fetchUser();
        latestQuizId(); 
        handleCopyQuestionSet()
    }, []);

    async function getUser() {
        try {

            const provider = new BrowserProvider(window.ethereum);
            console.log("Provider initialized:", provider);
            const signer = await provider.getSigner();
            const cAbi = ABI.abi;
            const cAddress = Address['TriviaModule#triviaHub']
            const catgryInstance = new Contract(cAddress, cAbi, signer);
            return catgryInstance;
        } catch (error) {
            console.log("Error during getUser details: ", error);
        }
    }

    const latestQuizId = async () => {
        try {
            const latestId = await userData.getLatestQuizId();
            setQuizId(latestId);
        } catch (error) {
            console.log("No Quiz set available:", error.message);
            setQuizId(301);
        }
    };

    const handleFileChange = (e) => {

        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsedData = JSON.parse(reader.result);
                    console.log('Data in File', parsedData);

                    if (Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
                        setQuestions(parsedData.questions);
                    } else {
                        setQuestions([]);
                    }
                    setDifficulty(parsedData.difficulty || '');
                    setIsFileUploaded(true);
                } catch (error) {
                    console.log('Error parsing the JSON file:', error);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    }

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
        console.log(updatedQuestions);

    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const quizDetails = {
                quizId: quizId,
                category: selectedCategory,
                questions: questions,
                difficulty: difficulty,
            };
            console.log("Quiz Set: ", quizDetails);
            const txnReceipt = await userData.addQuestionSet(
                quizDetails.quizId,
                quizDetails.category,
                quizDetails.difficulty,
                quizDetails.questions
            )
            console.log("Added Quiz set: ", txnReceipt);
        } catch (error) {
            console.log("Error while adding Quiz Set ", error);

        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h2 className="form-title text-center mb-6 font-bold text-2xl text-purple-600 mt-8">Add Quiz</h2>
            <form onSubmit={handleSubmit}>

                {/* File Upload for JSON */}
                <div>
                    <label htmlFor="jsonFile">Upload JSON File:</label>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="file-input mb-4 ml-4"
                    />
                </div>

                {isFileUploaded && (
                    <>
                        {/* Category Selection */}
                        <div>
                            <label htmlFor="category">Select Category:</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-select mb-4 ml-4 w-64 h-10"
                                disabled
                            >
                                <option value="">-- Select a Category --</option>
                                {Array.isArray(categories) && categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.dbTitle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label htmlFor="difficulty">Difficulty Level:</label>
                            <input
                                type="text"
                                id="difficulty"
                                value={difficulty}
                                readOnly // Automatically filled
                                className="ml-4"
                            />
                        </div>

                        {/* Questions */}
                        <h3 className="questions-title text-center mr-10 font-semibold my-4">Questions</h3>
                        <label htmlFor="quizId">Quiz ID:</label>
                        <input
                            type="text"
                            id="quizId"
                            value={quizId}
                            className="quiz-id-input border ml-2 h-10 w-[200px] mb-4"
                        />
                        {questions.map((question, index) => (
                            <div key={index} className="question">
                                <label>Question {index + 1}:</label>
                                <input
                                    type="text"
                                    value={question.questionText || ''}
                                    onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                                    className="question-input border ml-2 h-10 w-[550px] mb-4"
                                />
                                <div className="options">
                                    <label>Options:</label>
                                    {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                                        <input
                                            key={optionIndex}
                                            type="text"
                                            placeholder={`Option ${optionIndex + 1}`}
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

                        <button type="submit" disabled={isLoading} className=" mt-6 submit-btn w-20 h-8 rounded-md bg-gray-400 hover:bg-gray-300">
                            {isLoading ? 'Adding...' : 'Submit'}
                        </button>

                    </>
                )}

            </form>
            {/* </div> */}
        </div>
    );
};

export default AddQuestions
