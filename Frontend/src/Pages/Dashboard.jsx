    import React, { useState } from 'react';
    import AddCertificate from '../Components/AddCertificate';
    import ViewCertificate from '../Components/ViewCertificate';
    import VerifyCertificate from '../Components/VerifyCertificate';
    import { useNavigate } from 'react-router-dom';

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

    const AdminDashboard = ({ isLoggedIn, setIsLoggedIn }) =>  {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [modalContent, setModalContent] = useState(null);
        const navigate = useNavigate();

        const openModal = (content) => {
            setModalContent(content);
            setIsModalOpen(true);
        };

        const closeModal = () => {
            setIsModalOpen(false);
            setModalContent(null);
        };

        const handleLogout = () => {

            setIsLoggedIn(false);
            navigate('/');
        };

        return (
            <>
                <div>
                    <div className='grid grid-row-3 space-y-20'>
                        <h1 className="text-6xl font-bold text-gray-800 mb-8 mt-8">
                        QuizProof
                        </h1>
                        <div className="flex space-x-20 mt-20 sm:grid-cols-2 gap-6">
                            <div>
                                <button onClick={() => openModal(<AddCertificate />)}
                                    className="w-[350px] h-[250px] bg-yellow-300 text-gray-800 rounded-lg text-2xl 
                                    font-semibold border border-8 hover:bg-yellow-500 hover:text-white">
                                    Issue Certificate</button>
                            </div>
                            <div>
                                <button onClick={() => openModal(<ViewCertificate />)}
                                className="w-[350px] h-[250px] bg-yellow-300 text-gray-800 rounded-lg text-2xl 
                                font-semibold border border-8 hover:bg-yellow-500 hover:text-white">
                                    View Certificate</button>
                            </div>
                            <div>
                                <button onClick={() => openModal(<VerifyCertificate />)}
                                className="w-[350px] h-[250px] bg-yellow-300 text-gray-800 rounded-lg text-2xl 
                                font-semibold border border-8 hover:bg-yellow-500 hover:text-white">
                                    Verify Certificate</button>
                            </div>
                        </  div>
                        <div className='mt-100'>
                            <button onClick={handleLogout} className='w-32 h-24 text-xl bg-red-400 rounded-lg font-medium
                            hover:bg-red-600 hover:text-white'>Logout</button>
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