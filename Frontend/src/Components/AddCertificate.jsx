import React, { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import ABI from '../assets/triviaHub.json';
import Address from '../assets/deployed_addresses.json';

const AddCertificate = () => {
    const [contractInst, setContractInst] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');
    const [score, setScore] = useState('');
    const [data, setData] = useState({ existingUsers: [] });
    const [quizData, setQuizData] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState('');

    const cAbi = ABI.abi;
    const cAddress = Address['TriviaModule#triviaHub'];

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
                setContractInst(contract);
            } catch (error) {
                console.error("Error initializing contract instance:", error);
            }
        };

        initializeContract();
    }, []);

    useEffect(() => {
        const fetchPlayerDtls = async () => {
            try {
                const response = await fetch('http://localhost:5000/fetchUser', {
                    credentials: 'include'
                });
                const result = await response.json();
                console.log('Retrieved Data from DB: ', result);
                setData(result);
            }
            catch (error) {
                console.error('Error fetching quiz categories from Backend:', error);
            }
        };

        fetchPlayerDtls();
    }, []);

    const handleUserChange = (e) => {
        const selectedUserAddress = e.target.value;
        setSelectedUser(selectedUserAddress);

        const user = data.existingUsers.find((user) => user.dbUser === selectedUserAddress);
        if (user) {
            setQuizData(user.dbScores);
            setScore('');
        }
    };

    const handleQuizTypeChange = (e) => {
        const selectedQuizType = e.target.value;
        setSelectedQuiz(selectedQuizType);

        const selectedQuiz = quizData.find((quiz) => quiz.quizType === selectedQuizType);

        if (selectedQuiz) {
            setScore(selectedQuiz.score); // Set the score for the selected quiz type
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!contractInst) {
            console.error("Contract instance is not initialized.");
            return;
        }

        try {
            if (!selectedQuiz) {
                console.error("Selected quiz data not found.");
                return;
            }

            const existingPlayer = await contractInst.getScoreCert(selectedUser);
            console.log('Existing Player: ',existingPlayer);
            
            if (existingPlayer[1] == score && existingPlayer[3] == selectedQuiz) {
                console.log('Player details alreasy exists');
                alert('Player details are present')
            }
            else {
                const txnReceipt = await contractInst.addScores(selectedUser, score, selectedQuiz);
                console.log("Transaction Receipt:", txnReceipt);
                contractInst.on('scoreAdded', (user, grade, score, quizType) => {
                    console.log('New Certificate Added:', user, grade, score, quizType);
                });
            }
        } catch (error) {
            console.error("Error uploading to Blockchain:", error);
        }
    };

    return (
        <div className='flex space-x-16 pb-10'>
            <form
                onSubmit={handleSubmit}
                className='bg-slate-300 w-[500px] mt-20 ml-[350px] rounded-lg border-4 h-[400px]'>
                <div className="mt-4 py-2 px-4">
                    <label>User:</label>
                    <select
                        value={selectedUser}
                        onChange={handleUserChange}
                        required
                        className="mt-2"
                    >
                        <option value="" disabled>Select a user</option>
                        {Array.isArray(data.existingUsers) && data.existingUsers.map((user) => (
                            <option key={user._id} value={user.dbUser}>
                                {user.dbUser}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="py-2 px-4 mt-6">
                    <label>Quiz Type:</label>
                    <select
                        name="quizType"
                        value={selectedQuiz}  // Use selectedQuiz state
                        onChange={handleQuizTypeChange}
                        required
                        className="mt-2"
                    >
                        <option value="" disabled>
                            Select a quiz type
                        </option>
                        {Array.isArray(quizData) &&
                            quizData.map((quiz) => (
                                <option key={quiz._id} value={quiz.quizType}>
                                    {quiz.quizType}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mt-6 py-2 px-4">
                    <label>Score:</label>
                    <input
                        type="number"
                        name="score"
                        value={score}  // Show the score for the selected quiz type
                        readOnly
                        required
                        className="mt-2 ml-4"
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

export default AddCertificate;
