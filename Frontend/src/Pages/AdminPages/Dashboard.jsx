import React, { useState, useEffect } from 'react';
import ABI from '../../assets/triviaHub.json';
import Address from '../../assets/deployed_addresses.json';
import AddCategory from '../../Components/AddCategory';
import AddQuestions from '../../Components/AddQuestions';
import { BrowserProvider, Contract } from 'ethers';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 md:w-1/2 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    // const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    // const [questionSets, setQuestionSets] = useState([]);
    // // const [players, setPlayers] = useState([]);
    // // const [quizSummary, setQuizSummary] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCategoryData, setSelectedCategoryData] = useState(null);

    useEffect(() => {
        getUser();
        //     // loadCategories();
        //     // loadQuestionSets();
        //     // loadPlayers();
        //     // loadQuizSummary();
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
    // const loadCategories = async (catgryInstance) => {
    //     const catgryList = await catgryInstance.listCategories();
    //     setCategories(catgryList);
    // };

    // const loadQuestionSets = async (catgryInstance) => {
    //     const qstnSet = await catgryInstance.listQuestionSets();
    //     setQuestionSets(qstnSet);

    // };

    // const loadPlayers = async (catgryInstance) => {
    //     const playerSet = await catgryInstance.getPlayerStats();
    //     setPlayers(playerSet);
    // };

    // const loadQuizSummary = async (catgryInstance) => {
    //     const summary = await catgryInstance.getQuizSummary();
    //     setQuizSummary(summary);
    // };

    // open addcategory form as a pop-up window
    // const handleAddCategoryClick = () => {
    //     setShowPopup(true); // Open the pop-up
    // };

    // Modal control
    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    // // Function to handle when category is added
    // const handleCategoryAdded = (catgryId, catgryType, title) => {
    //     setSelectedCategoryData({ catgryId, catgryType, title });
    //     setShowPopup(false); // Close the pop-up once category is added
    // };

    const handleAddQuestionSet = (categoryData) => {
        setSelectedCategoryData(categoryData); // Set category data for the question set
        setShowPopup(true); // Show the pop-up
    };

    // const handleCopyQuestionSet = async (questionSetId) => {
    //     await catgryInstance.copyQuestionSetToStorage(questionSetId);
    // };

    // const handleClosePopup = () => {
    //     setShowPopup(false); // Close the pop-up
    // };

    return (
        <div className="min-h-screen bg-gradient-to-r from-cyan-300 to-blue-500">
            <h1 className='text-center'>Admin Dashboard</h1>

            {/* <section >
                    <h2>Dashboard Overview</h2>
                    <p>Recent activity and quick stats</p>
                </section> */}
            <div className='grid grid-cols-2 space-y-8'>
                <section id="categories" className='bg-blue-400 border-4 border-zinc-200 w-[350px] h-[230px] mx-10 my-10'>
                    <h2>Categories</h2>
                    <button onClick={() => openModal(<AddCategory />)} className='mt-20 w-32 h-18 bg-red-300 rounded-md'>Add Category</button>
                    {/* {showPopup && <AddCategory onCategoryAdded={handleCategoryAdded} />} */}
                </section>

                <section id="question-sets" className='bg-blue-400 border-4 border-zinc-200 w-[350px] h-[230px] mx-10 my-10'>
                    <h2>Question Sets</h2>
                    <button onClick={() => handleAddQuestionSet(selectedCategoryData)}>Add Question Set</button>
                    {/* <ul>
                        {questionSets.map((set, index) => (
                            <li key={index}>
                                {set.name}
                                <button onClick={() => handleCopyQuestionSet(set.id)}>Copy</button>
                            </li>
                        ))}
                    </ul> */}
                    {showPopup && selectedCategoryData && (
                        <div className="popup">
                            <div className="popup-content">
                                <button onClick={handleClosePopup}>Close</button>
                                <AddQuestions categoryData={selectedCategoryData} />
                            </div>
                        </div>
                    )}
                </section>

                <section id="players" className='bg-blue-400 border-4 border-zinc-200 w-[350px] h-[230px] mx-10 my-10'>
                    <h2>Players</h2>
                    {/* <ul>
                        {players.map((player, index) => (
                            <li key={index}>
                                {player.name} - Total Score: {player.totalScore} - Games Played: {player.gamesPlayed}
                            </li>
                        ))}
                    </ul> */}
                </section>

                <section id="quiz-summary" className='bg-blue-400 border-4 border-zinc-200 w-[350px] h-[230px] mx-10 my-10'>
                    <h2>Quiz Summary</h2>
                    {/* {quizSummary ? (
                        <p>{quizSummary}</p>
                    ) : (
                        <p>No quiz summary available yet.</p>
                    )} */}
                </section>
                <Modal isOpen={isModalOpen} closeModal={closeModal}>
                    {modalContent}
                </Modal>

            </div>

            {/* </div> */}
        </div>
    );
};

export default AdminDashboard;