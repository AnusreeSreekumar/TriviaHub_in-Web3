import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import '../App.css';
import BG from '../assets/videos/bkgrnd1.mp4';
import { Link } from 'react-router-dom';

function ConnectToMetaMask() {
    const [isLoggedInState, setIsLoggedInState] = useState(false);

    async function connectToMetamask() {
        try {
            const provider = new BrowserProvider(window.ethereum);
            console.log('Ethereum object:', window.ethereum);
            const signer = await provider.getSigner();
            console.log("Address of Signer: ", signer.address);
            alert(`${signer.address} is successfully logged in`);
            setIsLoggedInState(true);
            setIsLoggedIn(true); 
        } catch (error) {
            console.error("Failed to connect to MetaMask:", error);
        }
    }

    return (
        <div className="video-page">
            <div className="background-container">
                <video
                    className="video-background brightness-50"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={BG} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className='flex flex-col items-center justify-center p-[20px]'>
                    <h1 className='text-center text-red-400 text-5xl mt-14'>
                        Sign up and step into something amazing!
                    </h1>
                    <div className="shadow-lg p-12 rounded-lg max-w-lg h-[150px] my-[120px]">
                        {!isLoggedInState ? (
                            <button
                                onClick={connectToMetamask}
                                className="bg-white px-5 py-3 rounded-lg shadow-lg uppercase hover:bg-zinc-700 hover:text-white"
                            >
                                Connect to MetaMask
                            </button>
                        ) : (
                            <Link to="/admin"
                                className="bg-white px-5 py-3 rounded-lg shadow-lg uppercase hover:bg-zinc-700 hover:text-white"
                            >
                                Proceed
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnectToMetaMask;
