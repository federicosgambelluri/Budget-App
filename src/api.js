const getApiUrl = () => {
    return localStorage.getItem('budget_app_api_url') || import.meta.env.VITE_API_URL;
};

export const getTransactions = async () => {
    const API_URL = getApiUrl();
    if (!API_URL) return { balance: 0, transactions: [] };
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
    if (!API_URL) {
        console.warn("API URL not set");
        return { success: false };
    }

    // Google Apps Script requires text/plain or application/x-www-form-urlencoded for CORS sometimes,
    // but usually JSON with no-cors or specific setup.
    // Standard way for public web app:
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(transaction),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { success: false };
    }
};
