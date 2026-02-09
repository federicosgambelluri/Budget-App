import { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import ActionButtons from './components/ActionButtons';
import TransactionForm from './components/TransactionForm';
import SettingsModal from './components/SettingsModal';
import CategorySummary from './components/CategorySummary';
import ChartsView from './components/ChartsView';
import RecurrentExpenseModal from './components/RecurrentExpenseModal';
import Login from './components/Login';
import { getTransactions, addTransaction, deleteTransaction } from './api';
import { Settings, Trash2 } from 'lucide-react';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('budget_token') || '');
  const [balance, setBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0); // New State
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'income', 'expense', 'settings', 'recurrent'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'summary', 'charts'
  const [currentDate, setCurrentDate] = useState(new Date()); // Gestione Mese/Anno

  const handleLogout = () => {
    localStorage.removeItem('budget_token');
    setToken('');
    setTransactions([]);
    setBalance(0);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    // Passiamo mese e anno alla API
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const data = await getTransactions(token, month, year);

    // If invalid token (backend returns error or empty structure implying auth fail), 
    // we might want to logout. For now, let's just show what we get.
    // Ideally backend returns { error: 'Invalid token' }
    if (data.error === 'Invalid token') {
      handleLogout();
      return;
    }

    setBalance(data.balance || 0);
    setCashBalance(data.cashBalance || 0);
    setTotalSavings(data.totalSavings || 0);
    setTransactions(data.transactions || []);
    setIsLoading(false);
  }, [token, currentDate]);

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

  const handleAddRecurrentTransaction = async (expense) => {
    const transaction = {
      type: 'expense',
      amount: parseFloat(expense.amount),
      method: expense.method,
      category: expense.category,
      note: expense.label, // Use label as note/description
      date: new Date().toISOString()
    };
    await handleAddTransaction(transaction);
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

  // Navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    const nextMonth = new Date(newDate.setMonth(newDate.getMonth() + 1));
    const today = new Date();

    // Non andare oltre il mese corrente reale (opzionale, ma richiesto implicitamente "tornare al foglio del mese corrente")
    // Se "quando sono al mese corrente la frecca dx non è più visibile", allora qui controlliamo solo di non sforare per sicurezza
    if (nextMonth <= today || (nextMonth.getMonth() === today.getMonth() && nextMonth.getFullYear() === today.getFullYear())) {
      setCurrentDate(nextMonth);
    } else {
      // Se siamo già a oggi, forziamo a oggi (o non facciamo nulla)
      setCurrentDate(today);
    }
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
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
            totalSavings={totalSavings}
            income={totalIncome}
            expense={totalExpense}
            isLoading={isLoading}
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            isCurrentMonth={isCurrentMonth()}
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
            onAddRecurrent={() => setActiveModal('recurrent')}
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

      {activeModal === 'recurrent' && (
        <RecurrentExpenseModal
          onClose={() => setActiveModal(null)}
          onSelect={handleAddRecurrentTransaction}
        />
      )}
    </div>
  );
}

export default App;
