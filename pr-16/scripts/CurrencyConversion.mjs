import CurrencyService from "./CurrencyService.mjs";

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
      const originalData = await CurrencyService.getExchangeRate(
        currency,
        date,
      );

      // Create a deep copy to avoid modifying the original data
      const convertedData = JSON.parse(JSON.stringify(originalData));

      // Invert the rates in each cotacao entry
      convertedData.cotacoes = originalData.cotacoes.map((cotacao) => {
        const convertedCotacao = { ...cotacao };

        // Invert buying rate (1 BRL to foreign currency)
        if (cotacao.cotacao_compra && cotacao.cotacao_compra !== 0) {
          convertedCotacao.cotacao_compra = +(
            1 / cotacao.cotacao_compra
          ).toFixed(6);
        }

        // Invert selling rate (1 BRL to foreign currency)
        if (cotacao.cotacao_venda && cotacao.cotacao_venda !== 0) {
          convertedCotacao.cotacao_venda = +(1 / cotacao.cotacao_venda).toFixed(
            6,
          );
        }

        return convertedCotacao;
      });

      // Add a note to indicate the rates are inverted
      convertedData.inverted = true;

      return convertedData;
    } catch (error) {
      console.error("Error converting exchange rates:", error);
      throw error;
    }
  }

  /**
   * Converts exchange rate data to show how much a custom amount of BRL is worth in the foreign currency
   * or how much a custom amount of foreign currency is worth in BRL.
   * @param {Object} data - The exchange rate data (from getBRLExchangeRate or getExchangeRate)
   * @param {number} amount - The custom amount to calculate the exchange rate for
   * @returns {Object} - Modified exchange rate data with calculated values for the custom amount
   */
  static calculateCustomAmount(data, amount) {
    if (!data || !data.cotacoes || data.cotacoes.length === 0) {
      throw new Error("Invalid exchange rate data");
    }

    // Create a deep copy to avoid modifying the original data
    const calculatedData = JSON.parse(JSON.stringify(data));

    // Round the calculated rates to two decimal places for display
    calculatedData.cotacoes = data.cotacoes.map((cotacao) => {
      const calculatedCotacao = { ...cotacao };

      if (cotacao.cotacao_compra && cotacao.cotacao_compra !== 0) {
        calculatedCotacao.cotacao_compra = +(
          cotacao.cotacao_compra * amount
        ).toFixed(2);
      }

      if (cotacao.cotacao_venda && cotacao.cotacao_venda !== 0) {
        calculatedCotacao.cotacao_venda = +(
          cotacao.cotacao_venda * amount
        ).toFixed(2);
      }

      return calculatedCotacao;
    });

    // Add a note to indicate the rates are calculated for a custom amount
    calculatedData.customAmount = amount;

    return calculatedData;
  }
}

export default CurrencyConversion;
