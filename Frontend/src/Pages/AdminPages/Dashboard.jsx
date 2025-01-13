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
        <div className="min-h-screen bg-gradient-to-r from-cyan-300 to-blue-500 p-4">
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-8 mt-8">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 gap-6">
                <div>
                    <section className="bg-blue-400 border-4 border-zinc-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Categories</h2>
                        <button
                            onClick={() => openModal(<AddCategory />)}
                            className="w-full h-12 bg-yellow-300 text-gray-800 rounded-lg hover:bg-yellow-400"
                        >
                            Add Category
                        </button>
                    </section>

                    <section className="bg-blue-400 border-4 border-zinc-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Question Sets</h2>
                        <button
                            onClick={() => openModal(<AddQuestions />)}
                            className="w-full h-12 bg-yellow-300 text-gray-800 rounded-lg hover:bg-yellow-400"
                        >
                            Add Question Set
                        </button>
                    </section>

                    <section className="bg-blue-400 border-4 border-zinc-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Players</h2>
                        {/* Placeholder for players list */}
                    </section>

                    <section className="bg-blue-400 border-4 border-zinc-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Quiz Summary</h2>
                        {/* Placeholder for quiz summary */}
                    </section>
                </div>
            </div>

            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
};

export default AdminDashboard;