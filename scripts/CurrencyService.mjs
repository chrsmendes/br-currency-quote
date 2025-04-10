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
        const url = `https://brasilapi.com.br/api/cambio/v1/cotacao/${currency}/${date}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default CurrencyService;