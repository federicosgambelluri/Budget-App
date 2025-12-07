import React from 'react';
import { Wallet } from 'lucide-react';

export default function Dashboard({ balance, income, expense, isLoading }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <Wallet className="icon-wallet" size={24} />
                <span>Totale Disponibile</span>
            </div>

            <div className="dashboard-grid">
                <div className="stat-item income">
                    <span className="stat-label">Entrate</span>
                    {isLoading ? (
                        <span className="loading-pulse small">...</span>
                    ) : (
                        <span className="stat-value income">{formatCurrency(income)}</span>
                    )}
                </div>

                <div className="stat-item balance">
                    {isLoading ? (
                        <span className="loading-pulse">...</span>
                    ) : (
                        <h1 className="balance-amount">{formatCurrency(balance)}</h1>
                    )}
                </div>

                <div className="stat-item expense">
                    <span className="stat-label">Uscite</span>
                    {isLoading ? (
                        <span className="loading-pulse small">...</span>
                    ) : (
                        <span className="stat-value expense">{formatCurrency(expense)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
