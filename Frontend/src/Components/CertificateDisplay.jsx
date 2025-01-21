import React from 'react';
import '../CertificateDisplay.css'

const CertificateDisplay = ({ certificateData }) => {
    // Destructure certificate data
    const [playerId, score, grade, quizType] = certificateData;

    return (
        <div className="certificate-container">
            <div className="certificate-border">
                <h1 className="certificate-title">Certificate of Achievement</h1>
                <p className="certificate-content">
                    This is to certify that the player with ID:
                    <span className="certificate-highlight">{playerId}</span>
                </p>
                <p className="certificate-content">
                    has successfully completed the quiz
                    <span className="certificate-highlight">{quizType}</span>
                </p>
                <p className="certificate-content">
                    with an outstanding score of
                    <span className="certificate-highlight">{score}</span>.
                </p>
                <p className="certificate-content">
                    and earning a grade of
                    <span className="certificate-highlight">{grade}</span>.
                </p>
            </div>
        </div>
    );
};

export default CertificateDisplay;
