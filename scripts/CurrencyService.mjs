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
     * Fetches or retrieves currencies from localStorage
     * @returns {Promise<Array>} - List of currencies
     */
    static async getOrFetchCurrencies() {
        // Check if currencies are already in localStorage
        let currencies = JSON.parse(localStorage.getItem('currencies'));
        if (!currencies) {
            currencies = await this.getCurrencies();
            localStorage.setItem('currencies', JSON.stringify(currencies));
        }
        return currencies;
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
                const errorMessage = errorData.message || 'An unknown error occurred while fetching the exchange rate.';
                throw new Error(errorMessage);
            }
            const data = await response.json();

            // Ensure cotacao_compra and cotacao_venda are floats
            if (data.cotacoes) {
                data.cotacoes = data.cotacoes.map(cotacao => {
                    return {
                        ...cotacao,
                        cotacao_compra: parseFloat(cotacao.cotacao_compra),
                        cotacao_venda: parseFloat(cotacao.cotacao_venda)
                    };
                });
            }

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