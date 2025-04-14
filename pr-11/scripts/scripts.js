import CurrencyService from './CurrencyService.mjs';
import UIController from './UIController.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    UIController.setMaxDate();
    UIController.initializeThemeToggle();

    try {
        // Fetch currencies using the new method
        const currencies = await CurrencyService.getOrFetchCurrencies();

        // Populate currency options from localStorage
        const currencySelect = document.getElementById('currency');
        const conversionCurrencySelect = document.getElementById('conversion-currency');
        UIController.populateCurrencyOptions(currencies, currencySelect, conversionCurrencySelect);

        // Handle form submission using UIController
        const form = document.getElementById('exchange-form');
        UIController.handleFormSubmission(form, currencySelect, conversionCurrencySelect);
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});