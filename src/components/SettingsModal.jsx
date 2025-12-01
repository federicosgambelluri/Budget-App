import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';

export default function SettingsModal({ onClose }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const savedUrl = localStorage.getItem('budget_app_api_url') || '';
        setUrl(savedUrl);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('budget_app_api_url', url);
        alert('URL salvato! L\'app verrà ricaricata.');
        window.location.reload();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Impostazioni</h2>
                    <button className="btn-close" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Google Apps Script URL</label>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                            Incolla qui l'URL della Web App ottenuto dal deploy su Google Sheets.
                        </p>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://script.google.com/..."
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" style={{ background: 'var(--color-primary)' }}>
                        <Save size={20} /> Salva Configurazione
                    </button>
                </form>
            </div>
        </div>
    );
}
