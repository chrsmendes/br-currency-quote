import HistoryTracker from './HistoryTracker.mjs';

/**
 * Service for fetching and formatting currency exchange rates
 * from the BrasilAPI.
 */
class CurrencyService {
    /**
     * Fetches the list of available currencies from the API
     * @returns {Promise<Array>} - List of currencies
     */
    static async getCurrencies() {
        const url = 'https://brasilapi.com.br/api/cambio/v1/moedas';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching currencies: ${response.statusText}`);
            }

            // Add BRL to the list of currencies as it is not included in the API response
            const data = await response.json();
            const brl = { nome: 'Real Brasileiro', simbolo: 'BRL' };
            data.push(brl);

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Fetches the exchange rate for a given currency and date
     * @param {string} currency - The currency code (e.g., 'USD', 'EUR')
     * @param {string} date - The date in 'YYYY-MM-DD' format
     * @returns {Promise<Object>} - The exchange rate data
     */
    static async getExchangeRate(currency, date) {
        // Check local storage first
        const cachedData = HistoryTracker.getExchangeRate(currency, date);
        if (cachedData) {
            return cachedData;
        }

        const url = `https://brasilapi.com.br/api/cambio/v1/cotacao/${currency}/${date}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const data = await response.json();

            // Save to local storage if not today's date
            HistoryTracker.saveExchangeRate(currency, date, data);

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default CurrencyService;