import HistoryTracker from './HistoryTracker.mjs';

/**
 * Service for fetching and formatting currency exchange rates
 * from the BrasilAPI.
 */
class CurrencyService {
    /**
     * Fetches the flags data from an external API endpoint.
     * 
     * @returns {Promise<Array>}
     * @throws {Error}
     */
    static async fetchFlags() {
        const flagsUrl = 'https://gist.githubusercontent.com/ibrahimhajjaj/a0e39e7330aebf0feb49912f1bf9062f/raw/d160e7d3b0e11ea3912e97a1b3b25b359746c86a/currencies-with-flags.json';
        try {
            const flagsResponse = await fetch(flagsUrl);
            if (!flagsResponse.ok) {
                throw new Error(`Error fetching flags: ${flagsResponse.statusText}`);
            }
            return await flagsResponse.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Fetches the list of available currencies from the BrasilAPI.
     * 
     * @returns {Promise<Array>} - List of currencies
     * @throws {Error} - If either API fetch operation fails
     */
    static async getCurrencies() {
        const url = 'https://brasilapi.com.br/api/cambio/v1/moedas';
        try {
            // Fetch both currencies and flags in parallel for efficiency
            const [response, flagsData] = await Promise.all([fetch(url), this.fetchFlags()]);
            if (!response.ok) {
                throw new Error(`Error fetching currencies: ${response.statusText}`);
            }

            const data = await response.json();

            // Add BRL to the list of currencies as it is not included in the API response
            const brl = { nome: 'Real Brasileiro', simbolo: 'BRL' };
            data.push(brl);

            // Map flags to currencies
            const currenciesWithFlags = data.map(currency => {
                const flagInfo = Array.isArray(flagsData)
                    ? flagsData.find(flag => flag.code === currency.simbolo)
                    : null;
                return {
                    ...currency,
                    flag: flagInfo ? flagInfo.flag : 'default-flag-url' // Provide a default flag URL or null
                };
            });

            return currenciesWithFlags;
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