import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ActionButtons({ onAddIncome, onAddExpense }) {
    return (
        <div className="action-buttons">
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
    );
}
