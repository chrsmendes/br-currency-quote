import CurrencyService from './CurrencyService.mjs';
import UIController from './UIController.mjs';
import LinkSharer from './LinkSharer.mjs';

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

        // Setup shareable link functionality using UIController
        UIController.setupShareableLink(form);

        // Load query parameters into the form
        LinkSharer.loadQueryParamsToForm(form);

        // Automatically submit the form if query parameters exist
        LinkSharer.autoSubmitFormIfParamsExist(form);
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();