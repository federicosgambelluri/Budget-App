import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ActionButtons from './components/ActionButtons';
import TransactionForm from './components/TransactionForm';
import { getTransactions, addTransaction } from './api';
import './index.css';

function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'income' or 'expense'
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="app-container">
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
                <span className="t-amount">
                  {t.type === 'expense' ? '-' : '+'}€{Math.abs(t.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ActionButtons
        onAddIncome={() => setActiveModal('income')}
        onAddExpense={() => setActiveModal('expense')}
      />

      {activeModal && (
        <TransactionForm
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSubmit={handleAddTransaction}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default App;
