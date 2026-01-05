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
        <div className="dashboard-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Month Navigation - Moved Outside Card */}
            <div className="month-navigation-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                    <button onClick={onPrevMonth} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', minWidth: '100px', textAlign: 'center' }}>{getMonthName(currentDate)}</span>
                    <div style={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                        {!isCurrentMonth && (
                            <button onClick={onNextMonth} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard">
                <div className="dashboard-header" style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wallet className="icon-wallet" size={24} />
                        <span>Totale Disponibile</span>
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
        </div>
    );
}
