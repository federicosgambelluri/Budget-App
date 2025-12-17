import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    LineChart, Line, CartesianGrid
} from 'recharts';

export default function ChartsView({ transactions, onBack }) {

    // 1. Data for Pie Chart (Income vs Expense)
    const pieData = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

        return [
            { name: 'Entrate', value: income, color: '#22c55e' },
            { name: 'Uscite', value: expense, color: '#ef4444' }
        ];
    }, [transactions]);

    // 2. Data for Bar Chart (Expenses by Category)
    const barData = useMemo(() => {
        const categories = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const amount = Math.abs(parseFloat(t.amount));
                categories[t.category] = (categories[t.category] || 0) + amount;
            });

        return Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by highest expense
    }, [transactions]);

    // 3. Data for Line Chart (Daily Trend)
    const lineData = useMemo(() => {
        const days = {};
        // Sort transactions by date (oldest first)
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        sorted.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
            const amount = parseFloat(t.amount);

            if (!days[date]) {
                days[date] = { date, income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                days[date].income += Math.abs(amount);
            } else {
                days[date].expense += Math.abs(amount);
            }
        });

        return Object.values(days);
    }, [transactions]);

    return (
        <div className="charts-container" style={{
            height: '100%',
            overflowY: 'auto',
            paddingBottom: '2rem',
            animation: 'fadeIn 0.3s ease-in'
        }}>
            <div className="header" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
                position: 'sticky',
                top: 0,
                background: 'var(--color-bg)',
                zIndex: 10,
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        color: 'var(--color-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                >
                    <ArrowLeft size={24} /> Indietro
                </button>
                <h2 style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>Analisi</h2>
            </div>

            {/* Pie Chart Section */}
            <div className="chart-card" style={cardStyle}>
                <h3>Entrate vs Uscite</h3>
                <div style={{ height: '250px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'var(--color-surface)', border: 'none', borderRadius: '8px' }}
                                formatter={(value) => `€${value.toFixed(2)}`}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="chart-card" style={cardStyle}>
                <h3>Spese per Categoria</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ background: 'var(--color-surface)', border: 'none', borderRadius: '8px' }}
                                formatter={(value) => `€${value.toFixed(2)}`}
                            />
                            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart Section */}
            <div className="chart-card" style={cardStyle}>
                <h3>Andamento Giornaliero</h3>
                <div style={{ height: '250px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: 'var(--color-surface)', border: 'none', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="income" name="Entrate" stroke="#22c55e" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="expense" name="Uscite" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

const cardStyle = {
    background: 'var(--color-surface)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};
