import HistoryTracker from './HistoryTracker.mjs';

class CurrencyService {
    static async getCurrencies() {
        const url = 'https://brasilapi.com.br/api/cambio/v1/moedas';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching currencies: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

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