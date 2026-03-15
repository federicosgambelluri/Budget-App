export const getTransactionsWithoutMatchedGiroconti = (transactions) => {
    let incomes = [];
    let expenses = [];
    let matchedIndices = new Set();

    transactions.forEach((t, index) => {
        if (t.category === 'Giroconto') {
            if (t.type === 'income' || t.type === 'cash_income') incomes.push({ ...t, index });
            if (t.type === 'expense' || t.type === 'cash_expense') expenses.push({ ...t, index });
        }
    });

    incomes.forEach(inc => {
        const incAmount = Math.abs(parseFloat(inc.amount));
        const matchIdx = expenses.findIndex(exp => 
            !matchedIndices.has(exp.index) && 
            Math.abs(parseFloat(exp.amount)) === incAmount
        );
        
        if (matchIdx !== -1) {
            matchedIndices.add(inc.index);
            matchedIndices.add(expenses[matchIdx].index);
        }
    });

    return transactions.filter((_, index) => !matchedIndices.has(index));
};
