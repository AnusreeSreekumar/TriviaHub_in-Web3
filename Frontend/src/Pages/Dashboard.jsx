import React, { useState, useEffect } from 'react';

import { BrowserProvider, Contract } from 'ethers';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 relative">
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    return (
        <>
            <div className='min-w-max bg-gradient-to-r from-cyan-300 to-blue-500 p-4'>
                <div>
                    <h1 className="text-center text-2xl font-bold text-gray-800 mb-8 mt-8">
                        Player Dashboard
                    </h1>
                    <div className="flex space-x-20 sm:grid-cols-2 gap-6">
                        <div>

                            <section className="bg-red-400 border-4 border-zinc-200 p-6 rounded-lg shadow-lg">
                                <h2 className="text-lg font-semibold text-zinc-800 mb-4">Scoreboard</h2>
                                <div className="score-details text-md font-medium text-gray-600">
                                    <p>
                                        <strong>Total Scores: </strong>
                                        {/* <span className="text-blue-800">{totalScore}</span> */}
                                    </p>
                                    <p>
                                        <strong>Latest Quiz Score: </strong>
                                        {/* <span className="text-blue-800">{latestScore}</span> */}
                                    </p>
                                </div>

                            </section>
                        </div>
                        <div>
                            <button onClick={() => openModal(<AddCategory />)}
                            className="w-52 h-14 bg-yellow-300 text-gray-800 rounded-lg hover:bg-yellow-600 hover:text-white">
                                Generate Certificate on TotalScores</button>
                        </div>
                        <div>
                            <button onClick={() => openModal(<AddCategory />)}
                            className="w-56 h-16 bg-yellow-300 text-gray-800 rounded-lg hover:bg-yellow-600 hover:text-white">
                                Generate Certificate on Category Scores</button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isModalOpen} closeModal={closeModal}>
                    {modalContent}
                </Modal>
            </div>
        </>
    );
};

export default AdminDashboard;