import CurrencyService from './CurrencyService.mjs';

/**
 * Service for converting currency data to show BRL-to-Foreign rates
 * Instead of Foreign-to-BRL rates that the API returns by default
 */
class CurrencyConversion {
    /**
     * Converts exchange rate data to show how much 1 BRL is worth in the foreign currency
     * @param {string} currency - The currency code (e.g., USD, EUR, JPY)
     * @param {string} date - The date in YYYY-MM-DD format
     * @returns {Promise<Object>} - Modified exchange rate data with inverted rates
     */
    static async getBRLExchangeRate(currency, date) {
        try {
            // Get original exchange rate data from the service
            const originalData = await CurrencyService.getExchangeRate(currency, date);

            // Create a deep copy to avoid modifying the original data
            const convertedData = JSON.parse(JSON.stringify(originalData));

            // Invert the rates in each cotacao entry
            convertedData.cotacoes = originalData.cotacoes.map(cotacao => {
                const convertedCotacao = { ...cotacao };

                // Invert buying rate (1 BRL to foreign currency)
                if (cotacao.cotacao_compra && cotacao.cotacao_compra !== 0) {
                    convertedCotacao.cotacao_compra = +(1 / cotacao.cotacao_compra).toFixed(6);
                }

                // Invert selling rate (1 BRL to foreign currency)
                if (cotacao.cotacao_venda && cotacao.cotacao_venda !== 0) {
                    convertedCotacao.cotacao_venda = +(1 / cotacao.cotacao_venda).toFixed(6);
                }

                return convertedCotacao;
            });

            // Add a note to indicate the rates are inverted
            convertedData.inverted = true;
            convertedData.rateDescription = `1 BRL to ${currency}`;

            return convertedData;
        } catch (error) {
            console.error('Error converting exchange rates:', error);
            throw error;
        }
    }
}

export default CurrencyConversion;