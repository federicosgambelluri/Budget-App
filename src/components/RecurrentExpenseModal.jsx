import React from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';

export default function RecurrentExpenseModal({ onClose, onSelect }) {
    const expenses = [
        { id: 'telepass', label: 'Telepass', amount: 1.50, category: 'Telepass', method: 'buddybank', icon: '🚗' },
        { id: 'applemusic', label: 'Apple Music', amount: 5.99, category: 'Abbonamenti', method: 'buddybank', icon: '🎵' },
        { id: 'icloud', label: 'iCloud', amount: 9.99, category: 'Abbonamenti', method: 'buddybank', icon: '☁️' },
        { id: 'serenis49', label: 'Serenis', amount: 49.00, category: 'Salute e benessere', method: 'buddybank', icon: '🧠' },
        { id: 'serenis34', label: 'Serenis', amount: 34.00, category: 'Salute e benessere', method: 'buddybank', icon: '🧠' },
        { id: 'benzina50', label: 'Benzina', amount: 50.00, category: 'Carburante', method: 'contanti', icon: '⛽' },
        { id: 'benzina10', label: 'Benzina', amount: 10.00, category: 'Carburante', method: 'contanti', icon: '⛽' },
        { id: 'barbiere', label: 'Barbiere', amount: 26.50, category: 'Salute e benessere', method: 'contanti', icon: '✂️' },
        { id: 'nutrizionista', label: 'Nutrizionista', amount: 40.00, category: 'Salute e benessere', method: 'contanti', icon: '🥗' },
        { id: 'eleonora', label: 'Eleonora Furfaro', amount: 15.00, category: 'Altro', method: 'contanti', icon: '👩‍⚕️' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content recurrent-modal" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={24} color="#f97316" /> Spese Ricorrenti
                    </h2>
                    <button className="btn-close" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="recurrent-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    {expenses.map((expense) => (
                        <button
                            key={expense.id}
                            className="btn-recurrent-item"
                            onClick={() => onSelect(expense)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{expense.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{expense.label}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        {expense.method === 'buddybank' ? '💳 Buddybank' :
                                            expense.method === 'hype' ? '💳 Hype' :
                                                expense.method === 'revolut' ? '💳 Revolut' :
                                                    expense.method === 'unicredit' ? '💳 Unicredit' :
                                                        '💵 Contanti'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: '#ef4444' }}>-€{expense.amount.toFixed(2)}</span>
                                <ArrowRight size={16} color="var(--color-text-muted)" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
