import React, { useMemo } from 'react';
import { ArrowLeft, PieChart } from 'lucide-react';

export default function CategorySummary({ transactions, onBack }) {
    const categoryStats = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const totalExpense = expenses.reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

        const byCategory = expenses.reduce((acc, t) => {
            const amount = Math.abs(parseFloat(t.amount));
            if (!acc[t.category]) {
                acc[t.category] = 0;
            }
            acc[t.category] += amount;
            return acc;
        }, {});

        return Object.entries(byCategory)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <div className="category-summary" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="summary-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        color: 'var(--color-text)',
                        padding: '0.5rem',
                        marginRight: '1rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PieChart size={24} />
                    Riepilogo Spese
                </h2>
            </div>

            <div className="summary-list" style={{ flex: 1, overflowY: 'auto' }}>
                {categoryStats.length === 0 ? (
                    <p className="empty-state">Nessuna spesa registrata.</p>
                ) : (
                    categoryStats.map((stat, index) => (
                        <div key={index} className="summary-item" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{stat.category}</span>
                                <span style={{ fontWeight: 700 }}>{formatCurrency(stat.amount)}</span>
                            </div>
                            <div className="progress-bar-bg" style={{
                                height: '8px',
                                background: 'var(--color-surface)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div className="progress-bar-fill" style={{
                                    height: '100%',
                                    width: `${stat.percentage}%`,
                                    background: 'var(--color-danger)',
                                    borderRadius: '4px'
                                }} />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                {stat.percentage.toFixed(1)}%
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
