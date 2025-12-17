import React from 'react';

export default function LoadingSpinner({ size = 'large', overlay = false }) {
    const spinner = <div className={`loading-spinner ${size}`}></div>;

    if (overlay) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    {spinner}
                    <p>Caricamento in corso...</p>
                </div>
            </div>
        );
    }

    return spinner;
}
