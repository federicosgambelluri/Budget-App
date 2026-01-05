import React from 'react';
import { Plus, Minus, BarChart3, PieChart } from 'lucide-react';

export default function ActionButtons({ onAddIncome, onAddExpense, onShowSummary, onShowCharts }) {
    return (
        <div className="action-container" style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Income / Expense Buttons - Smaller as requested */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className="btn-income"
                    onClick={onAddIncome}
                    style={{
                        flex: 1,
                        padding: '0.75rem', // Reduced padding
                        borderRadius: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.1)', // Light green tint
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem', // Smaller font
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> {/* Smaller icon */}
                    <span>Entrata</span>
                </button>
                <button
                    className="btn-expense"
                    onClick={onAddExpense}
                    style={{
                        flex: 1,
                        padding: '0.75rem', // Reduced padding
                        borderRadius: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)', // Light red tint
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem', // Smaller font
                        cursor: 'pointer'
                    }}
                >
                    <Minus size={20} /> {/* Smaller icon */}
                    <span>Uscita</span>
                </button>
            </div>

            {/* Summary / Charts Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className="btn-summary"
                    onClick={onShowSummary}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    <BarChart3 size={20} />
                    <span>Riepilogo</span>
                </button>
                <button
                    className="btn-charts"
                    onClick={onShowCharts}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    <PieChart size={20} />
                    <span>Grafici</span>
                </button>
            </div>
        </div>
    );
}
