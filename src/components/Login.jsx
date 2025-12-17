import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            onLogin(password.trim());
        } else {
            setError(true);
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div className="login-card" style={{
                background: 'var(--color-surface)',
                padding: '2rem',
                borderRadius: '2rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '1rem',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    marginBottom: '1.5rem',
                    color: 'var(--color-primary)'
                }}>
                    <Lock size={48} />
                </div>

                <h2 style={{ marginBottom: '0.5rem' }}>Bentornato</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Inserisci la password per accedere al tuo budget.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Password"
                            style={{
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                letterSpacing: '2px'
                            }}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        style={{ marginTop: '1rem' }}
                    >
                        Accedi <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
