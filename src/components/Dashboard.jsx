import React from 'react';
import { Wallet } from 'lucide-react';

export default function Dashboard({ balance, isLoading }) {
    const formattedBalance = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
    }).format(balance);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <Wallet className="icon-wallet" size={24} />
                <span>Totale Disponibile</span>
            </div>
            <div className="balance-display">
                {isLoading ? (
                    <span className="loading-pulse">...</span>
                ) : (
                    <h1>{formattedBalance}</h1>
                )}
            </div>
        </div>
    );
}
