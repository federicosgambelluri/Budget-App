import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ActionButtons from './components/ActionButtons';
import TransactionForm from './components/TransactionForm';
import SettingsModal from './components/SettingsModal';
import { getTransactions, addTransaction, deleteTransaction } from './api';
import { Settings, Trash2 } from 'lucide-react';
import './index.css';

function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'income', 'expense', 'settings'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getTransactions();
    setBalance(data.balance || 0);
    setTransactions(data.transactions || []);
    setIsLoading(false);
  };

  const handleAddTransaction = async (transaction) => {
    setIsSubmitting(true);
    const result = await addTransaction(transaction);
    if (result && result.success) {
      // Optimistic update or refetch
      await fetchData();
      setActiveModal(null);
    } else {
      alert('Errore durante il salvataggio. Controlla la connessione o lo script.');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (rowNumber) => {
    if (!confirm('Sei sicuro di voler eliminare questa transazione?')) return;

    setDeletingId(rowNumber);
    const result = await deleteTransaction(rowNumber);
    if (result && result.success) {
      await fetchData();
    } else {
      alert('Errore durante l\'eliminazione.');
    }
    setDeletingId(null);
  };

  return (
    <div className="app-container">
      {/* Settings button hidden as URL is hardcoded now, but kept in code just in case */}
      {/* 
      <button 
        className="btn-settings" 
        onClick={() => setActiveModal('settings')}
        style={{position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--color-text-muted)', padding: '0.5rem'}}
      >
        <Settings size={24} />
      </button>
      */}

      <Dashboard balance={balance} isLoading={isLoading} />

      <div className="recent-transactions">
        <h3>Ultime Transazioni</h3>
        {transactions.length === 0 ? (
          <p className="empty-state">Nessuna transazione recente.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.slice(0, 5).map((t, index) => (
              <li key={index} className={`transaction-item ${t.type}`}>
                <div className="t-info">
                  <span className="t-category">{t.category}</span>
                  <span className="t-note">{t.note}</span>
                </div>
                <div className="t-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="t-amount">
                    {t.type === 'expense' ? '-' : '+'}€{Math.abs(t.amount).toFixed(2)}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(t.rowNumber)}
                    disabled={deletingId === t.rowNumber}
                    style={{ background: 'transparent', color: '#ef4444', padding: '0.25rem', opacity: deletingId === t.rowNumber ? 0.5 : 1 }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ActionButtons
        onAddIncome={() => setActiveModal('income')}
        onAddExpense={() => setActiveModal('expense')}
      />

      {(activeModal === 'income' || activeModal === 'expense') && (
        <TransactionForm
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSubmit={handleAddTransaction}
          isSubmitting={isSubmitting}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

export default App;
