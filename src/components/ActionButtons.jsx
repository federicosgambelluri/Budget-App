import React from 'react';
import { Plus, Minus, BarChart3, PieChart } from 'lucide-react';

export default function ActionButtons({ onAddIncome, onAddExpense, onShowSummary, onShowCharts }) {
    return (
        <div className="action-container" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                    className="btn-summary"
                    onClick={onShowSummary}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '1rem',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '1rem'
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
                        padding: '1rem',
                        borderRadius: '1rem',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}
                >
                    <PieChart size={20} />
                    <span>Grafici</span>
                </button>
            </div>

            <div className="action-buttons" style={{ marginTop: 0, paddingTop: 0 }}>
                <button className="btn-action btn-income" onClick={onAddIncome}>
                    <div className="icon-circle">
                        <Plus size={32} />
                    </div>
                    <span>Entrata</span>
                </button>
                <button className="btn-action btn-expense" onClick={onAddExpense}>
                    <div className="icon-circle">
                        <Minus size={32} />
                    </div>
                    <span>Uscita</span>
                </button>
            </div>
        </div>
    );
}
