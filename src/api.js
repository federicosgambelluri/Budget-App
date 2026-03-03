// URL Hardcoded come richiesto dall'utente
//const HARDCODED_API_URL = "";

const HARDCODED_API_URL = "https://script.google.com/macros/s/AKfycbzLsiSwfefrnSL2KwirjvcKeVrZ6dTObDqpUCCAnCrbXG1-I8vLLYJBnHBCETuqONu_/exec";
const getApiUrl = () => {
    // Usa sempre l'URL hardcoded
    return HARDCODED_API_URL;
};

export const getTransactions = async (token, month, year) => {
    const API_URL = getApiUrl();
    try {
        // Append token, month, and year to URL for GET request
        let urlWithToken = `${API_URL}?token=${encodeURIComponent(token)}`;

        if (month !== undefined && year !== undefined) {
            urlWithToken += `&month=${month}&year=${year}`;
        }

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
