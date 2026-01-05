import React, { useState } from 'react';
import { X, Check, CreditCard, Banknote } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function TransactionForm({ type, onClose, onSubmit, isSubmitting }) {
    const incomeCategories = [
        'Altro', 'Donazioni familiari', 'Lavoro', 'Paghetta', 'Regali', 'Rimborsi'
    ].sort();

    const expenseCategories = [
        'Abbonamenti', 'Aerei', 'Altro', 'Auto e moto', 'Bollette', 'Bus', 'Carburante', 'Hotel', 'Istruzione',
        'Palestra', 'Regali', 'Rimborsi', 'Ristoranti', 'Salute e benessere', 'Shopping',
        'Snack', 'Spesa', 'Svago', 'Telepass', 'Treni'
    ].sort();

    const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('contanti');
    const [category, setCategory] = useState(currentCategories[0]);
    const [note, setNote] = useState('');
    const [isCashOnly, setIsCashOnly] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return;

        // Determine final type based on checkbox
        let finalType = type;
        if (isCashOnly && method === 'contanti') {
            finalType = type === 'income' ? 'cash_income' : 'cash_expense';
        }

        onSubmit({
            type: finalType,
            amount: parseFloat(amount),
            method,
            category: isCashOnly ? 'EXTRA_CASH' : category, // Optional: override category or keep as selected
            note,
            date: new Date().toISOString(),
        });
    };



    const paymentMethods = [
        { id: 'contanti', label: 'Contanti', icon: Banknote },
        { id: 'buddybank', label: 'Buddybank', icon: CreditCard },
        { id: 'hype', label: 'Hype', icon: CreditCard },
        { id: 'revolut', label: 'Revolut', icon: CreditCard },
    ];

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${type}`}>
                <div className="modal-header">
                    <h2>{type === 'income' ? 'Nuova Entrata' : 'Nuova Uscita'}</h2>
                    <button className="btn-close" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group amount-group">
                        <label>Importo</label>
                        <div className="input-wrapper">
                            <span className="currency-symbol">€</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Metodo di Pagamento</label>
                        <div className="payment-methods">
                            {paymentMethods.map((pm) => (
                                <button
                                    key={pm.id}
                                    type="button"
                                    className={`btn-method ${method === pm.id ? 'active' : ''}`}
                                    onClick={() => setMethod(pm.id)}
                                >
                                    <pm.icon size={18} />
                                    <span>{pm.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {method === 'contanti' && (
                        <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="cashOnly"
                                checked={isCashOnly}
                                onChange={(e) => setIsCashOnly(e.target.checked)}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor="cashOnly" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Solo su Saldo Contanti (Extra Budget)
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Dettagli opzionali..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner size="small" /> Salvataggio...
                            </>
                        ) : (
                            <>
                                <Check size={20} /> Conferma
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
