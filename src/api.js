// URL Hardcoded come richiesto dall'utente
//const HARDCODED_API_URL = "https://script.google.com/macros/s/AKfycbxac3j3RUR0CLqJ8ytXn3fysd6Tm3lHnzMxMzvgJqGYJqwah67skiQuGZjSnYbF8t6o/exec";

const HARDCODED_API_URL = "https://script.google.com/macros/s/AKfycbzjaBWnjCVhd7eYJ4YK1GiQoCNVNScByEEItMsH3s6V4AY3OGWGdSEPn0IDYDf6ThKI/exec";
const getApiUrl = () => {
    // Usa sempre l'URL hardcoded
    return HARDCODED_API_URL;
};

export const getTransactions = async (token) => {
    const API_URL = getApiUrl();
    try {
        // Append token to URL for GET request
        const urlWithToken = `${API_URL}?token=${encodeURIComponent(token)}`;
        const response = await fetch(urlWithToken);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { balance: 0, transactions: [] };
    }
};

export const addTransaction = async (transaction, token) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: 'add',
                token: token,
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

export const deleteTransaction = async (rowNumber, token) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: 'delete',
                token: token,
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
