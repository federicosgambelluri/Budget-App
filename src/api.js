// URL Hardcoded come richiesto dall'utente
//const HARDCODED_API_URL = "https://script.google.com/macros/s/AKfycbxac3j3RUR0CLqJ8ytXn3fysd6Tm3lHnzMxMzvgJqGYJqwah67skiQuGZjSnYbF8t6o/exec";

const HARDCODED_API_URL = "https://script.google.com/macros/s/AKfycbzjaBWnjCVhd7eYJ4YK1GiQoCNVNScByEEItMsH3s6V4AY3OGWGdSEPn0IDYDf6ThKI/exec";
const getApiUrl = () => {
    // Usa sempre l'URL hardcoded
    return HARDCODED_API_URL;
};

export const getTransactions = async () => {
    const API_URL = getApiUrl();
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { balance: 0, transactions: [] };
    }
};

export const addTransaction = async (transaction) => {
    const API_URL = getApiUrl();

    // Google Apps Script requires text/plain or application/x-www-form-urlencoded for CORS sometimes,
    // but usually JSON with no-cors or specific setup.
    // Standard way for public web app:
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: 'add',
                ...transaction
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { success: false };
    }
};

export const deleteTransaction = async (rowNumber) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: 'delete',
                rowNumber: rowNumber
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return { success: false };
    }
};
