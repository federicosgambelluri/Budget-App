import React from 'react';
import { Wallet, Banknote, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard({
    balance,
    cashBalance,
    totalSavings,
    income,
    expense,
    isLoading,
    currentDate,
    onPrevMonth,
    onNextMonth,
    isCurrentMonth
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const getMonthName = (date) => {
        const months = ["GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO", "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"];
        const monthName = months[date.getMonth()];
        const year = date.getFullYear().toString().substr(-2);
        return `${monthName} ${year}`;
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header" style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Wallet className="icon-wallet" size={24} />
                    <span>Totale Disponibile</span>
                </div>
                {/* Navigation Arrows */}
                <div className="month-navigation" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={onPrevMonth} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{getMonthName(currentDate)}</span>
                    {!isCurrentMonth && (
                        <button onClick={onNextMonth} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <ChevronRight size={24} />
                        </button>
                    )}
                    {/* Placeholder for alignment if arrow is hidden */}
                    {isCurrentMonth && <div style={{ width: 24 }}></div>}
                </div>
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

            {/* Total Savings & Cash Balance Section */}
            <div className="cash-balance-section" style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem' // Increased gap for two items
            }}>
                {/* Saldo Contanti */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                        <Banknote size={16} />
                        <span className="stat-label">Saldo Contanti</span>
                    </div>
                    {isLoading ? (
                        <span className="loading-pulse small">...</span>
                    ) : (
                        <span className="stat-value" style={{ fontSize: '1.2rem' }}>{formatCurrency(cashBalance)}</span>
                    )}
                </div>

                {/* Risparmio Totale */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                        <PiggyBank size={16} />
                        <span className="stat-label">Risparmio Totale</span>
                    </div>
                    {isLoading ? (
                        <span className="loading-pulse small">...</span>
                    ) : (
                        <span className="stat-value" style={{ fontSize: '1.2rem', color: '#10b981' }}>{formatCurrency(totalSavings)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
