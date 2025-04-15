class HistoryTracker {
    static saveExchangeRate(currency, date, data) {
        if (this.isToday(date)) return; // Do not save data for the current day

        const history = JSON.parse(localStorage.getItem('exchangeRateHistory')) || {};
        if (!history[currency]) {
            history[currency] = {};
        }
        history[currency][date] = data;
        localStorage.setItem('exchangeRateHistory', JSON.stringify(history));
    }

    static getExchangeRate(currency, date) {
        const history = JSON.parse(localStorage.getItem('exchangeRateHistory')) || {};
        return history[currency]?.[date] || null;
    }

    static isToday(date) {
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    }
}

export default HistoryTracker;