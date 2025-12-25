import { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ActionButtons from './components/ActionButtons';
import TransactionForm from './components/TransactionForm';
import SettingsModal from './components/SettingsModal';
import CategorySummary from './components/CategorySummary';
import ChartsView from './components/ChartsView';
import Login from './components/Login';
import { getTransactions, addTransaction, deleteTransaction } from './api';
import { Settings, Trash2 } from 'lucide-react';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('budget_token') || '');
  const [balance, setBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'income', 'expense', 'settings'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'summary', 'charts'

  const handleLogout = () => {
    localStorage.removeItem('budget_token');
    setToken('');
    setTransactions([]);
    setBalance(0);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTransactions(token);

    // If invalid token (backend returns error or empty structure implying auth fail), 
    // we might want to logout. For now, let's just show what we get.
    // Ideally backend returns { error: 'Invalid token' }
    if (data.error === 'Invalid token') {
      handleLogout();
      return;
    }

    setBalance(data.balance || 0);
    setCashBalance(data.cashBalance || 0);
    setTransactions(data.transactions || []);
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [token, fetchData]);

  const handleLogin = (newToken) => {
    localStorage.setItem('budget_token', newToken);
    setToken(newToken);
  };

  const handleAddTransaction = async (transaction) => {
    setIsSubmitting(true);
    const result = await addTransaction(transaction, token);
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
    const result = await deleteTransaction(rowNumber, token);
    if (result && result.success) {
      await fetchData();
    } else {
      alert('Errore durante l\'eliminazione.');
    }
    setDeletingId(null);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {isLoading && <LoadingSpinner overlay={true} />}
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

      {/* Logout Button (temporary placement or permanent) */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'transparent',
          color: 'var(--color-text-muted)',
          padding: '0.5rem',
          fontSize: '0.8rem'
        }}
      >
        Esci
      </button>

      {view === 'summary' ? (
        <CategorySummary
          transactions={transactions}
          onBack={() => setView('dashboard')}
        />
      ) : view === 'charts' ? (
        <ChartsView
          transactions={transactions}
          onBack={() => setView('dashboard')}
        />
      ) : (
        <>
          <Dashboard
            balance={balance}
            cashBalance={cashBalance}
            income={totalIncome}
            expense={totalExpense}
            isLoading={isLoading}
          />

          <div className="recent-transactions">
            <h3>Transazioni</h3>
            {transactions.length === 0 ? (
              <p className="empty-state">Nessuna transazione recente.</p>
            ) : (
              <ul className="transaction-list">
                {transactions.map((t, index) => (
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
            onShowSummary={() => setView('summary')}
            onShowCharts={() => setView('charts')}
          />
        </>
      )}

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
