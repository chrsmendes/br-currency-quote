import CurrencyService from './CurrencyService.mjs';
import CurrencyConversion from './CurrencyConversion.mjs';
import { renderExchangeRateChart } from './ChartRenderer.mjs';
import LinkSharer from './LinkSharer.mjs';

/**
 * UIController class for managing the user interface and interactions
 */
export default class UIController {
    /**
     * Initializes the UIController by setting up event listeners and default values.
     * This method should be called when the DOM is fully loaded.
     * 
     * @static
     * @returns {void}
     */
    static initialize() {
        // Initialize theme toggle functionality
        this.initializeThemeToggle();

        // Set max date for date input
        this.setMaxDate();

        // Clear results on page load
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }

    /**
     * Initializes the theme toggle button to switch between light and dark themes.
     * This method should be called when the DOM is fully loaded.
     * 
     * @static
     * @returns {void}
     */
    static initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme(themeToggle);
            });
        }
    }

    /**
     * Sets the maximum date for the date input field to today's date.
     * This method should be called when the DOM is fully loaded.
     * 
     * @static
     * @returns {void}
     */
    static setMaxDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.setAttribute('max', today);
        } else {
            console.warn('Element with id "date" not found in the DOM.');
        }
    }

    /**
     * Populates the currency options in the select elements.
     * This method also sets up an event listener to filter the conversion currency options based on the selected currency.
     * 
     * @param {Array} currencies - List of currency objects to populate the select elements.
     * @param {HTMLSelectElement} currencySelect - The select element for the main currency.
     * @param {HTMLSelectElement} conversionCurrencySelect - The select element for the conversion currency.
     * @static
     * @returns {void}
     */
    static populateCurrencyOptions(currencies, currencySelect, conversionCurrencySelect) {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.simbolo;
            option.textContent = `${currency.nome} (${currency.simbolo})`;
            currencySelect.appendChild(option);
        });

        const changeHandler = () => {
            const selectedCurrency = currencySelect.value;

            // Clear previous options
            conversionCurrencySelect.innerHTML = '';

            if (selectedCurrency === 'BRL') {
                // Populate all currencies except BRL
                currencies.forEach(currency => {
                    if (currency.simbolo !== 'BRL') {
                        const option = document.createElement('option');
                        option.value = currency.simbolo;
                        option.textContent = `${currency.nome} (${currency.simbolo})`;
                        conversionCurrencySelect.appendChild(option);
                    }
                });
            } else {
                // Ensure only BRL is available as the conversion currency
                const option = document.createElement('option');
                option.value = 'BRL';
                option.textContent = 'Brazilian Real (BRL)';
                conversionCurrencySelect.appendChild(option);
            }
        };

        // Remove any existing 'change' event listener before adding a new one
        const handlerMap = UIController._handlerMap || (UIController._handlerMap = new WeakMap());

        if (handlerMap.has(currencySelect)) {
            currencySelect.removeEventListener('change', handlerMap.get(currencySelect));
        }
        currencySelect.addEventListener('change', changeHandler);
        handlerMap.set(currencySelect, changeHandler);
    }

    /**
     * Displays the result of the exchange rate calculation in the UI.
     * This method creates a card element to show the exchange rate details.
     * 
     * @param {Object} data - The exchange rate data to display.
     * @param {string} selectedCurrency - The selected currency code.
     * @param {string} conversionCurrency - The conversion currency code.
     * @param {Object} lastRate - The last exchange rate object containing buy and sell rates.
     * @static
     * @returns {void}
     */
    static displayResult(data, selectedCurrency, conversionCurrency, lastRate) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Exchange Rate for ${selectedCurrency} on ${data.data}</h5>
                    <p class="card-text">Buy Rate: ${selectedCurrency} 1.00 → ${conversionCurrency} ${lastRate.cotacao_compra}</p>
                    <p class="card-text">Sell Rate: ${selectedCurrency} 1.00 → ${conversionCurrency} ${lastRate.cotacao_venda}</p>
                </div>
            </div>
        `;
    }

    /**
     * Displays an error message in the UI.
     * This method creates an alert element to show the error details.
     * 
     * @param {Error} error - The error object containing the error message.
     * @static
     * @returns {void}
     */
    static displayError(error) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> ${error.message || 'An unexpected error occurred.'}
            </div>
        `;
        console.error('Failed to fetch exchange rate:', error);
    }

    /**
     * Toggles the theme between light and dark modes.
     * This method updates the theme attribute on the document element and changes the button icon.
     * 
     * @param {HTMLElement} themeToggle - The button element used to toggle the theme.
     * @static
     * @returns {void}
     */
    static toggleTheme(themeToggle) {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-bs-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);

        // Change the content of the button
        if (targetTheme === 'dark') {
            themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
    }

    /**
     * Handles the form submission for currency conversion.
     * This method validates the input, fetches the exchange rate data, and displays the result.
     * 
     * @param {HTMLFormElement} form - The form element for currency conversion.
     * @param {HTMLSelectElement} currencySelect - The select element for the main currency.
     * @param {HTMLSelectElement} conversionCurrencySelect - The select element for the conversion currency.
     * @static
     * @returns {void}
     */
    static async handleFormSubmission(form, currencySelect, conversionCurrencySelect) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedCurrency = currencySelect.value;
            const conversionCurrency = conversionCurrencySelect.value;
            const amount = parseFloat(document.getElementById('amount').value);

            // Validate that one of the currencies is BRL
            if (selectedCurrency !== 'BRL' && conversionCurrency !== 'BRL') {
                this.showNotification('Conversions are only allowed between BRL and other currencies.', 'warning');
                return;
            }

            const selectedDate = document.getElementById('date').value;

            try {
                let data;
                if (selectedCurrency === 'BRL') {
                    // Use CurrencyConversion for BRL to foreign currency
                    data = await CurrencyConversion.getBRLExchangeRate(conversionCurrency, selectedDate);
                } else {
                    // Use CurrencyService for foreign currency to BRL
                    data = await CurrencyService.getExchangeRate(selectedCurrency, selectedDate);
                }

                // Calculate custom amount
                const calculatedData = CurrencyConversion.calculateCustomAmount(data, amount);

                const lastRate = calculatedData.cotacoes && calculatedData.cotacoes.length > 0
                    ? calculatedData.cotacoes[calculatedData.cotacoes.length - 1]
                    : null;

                if (!lastRate) {
                    throw new Error('No exchange rate data available for the selected date.');
                }

                this.displayResult(data, selectedCurrency, conversionCurrency, lastRate);

                // Remove any previous chart if exists
                const previousChart = document.getElementById('exchangeRateChart');
                if (previousChart) {
                    previousChart.remove();
                }

                const chart = renderExchangeRateChart(calculatedData);
                const resultDiv = document.getElementById('result');
                const resultDivParent = resultDiv.parentNode;
                resultDivParent.insertBefore(chart, resultDiv.nextSibling);

            } catch (error) {
                this.displayError(error);
            }
        });
    }

    /**
     * Adds functionality to generate and copy a shareable link for the form.
     * This method sets up the event listener for the 'Generate Shareable Link' button
     * and handles copying the link to the clipboard.
     * 
     * @param {HTMLFormElement} form - The form element for currency conversion.
     * @static
     * @returns {void}
     */
    static setupShareableLink(form) {
        const shareLinkButton = document.getElementById('share-link-button');
        if (shareLinkButton) {
            shareLinkButton.addEventListener('click', () => {
                const shareableLink = LinkSharer.generateShareableLink(form);

                // Copy the shareable link to clipboard and notify the user
                navigator.clipboard.writeText(shareableLink).then(() => {
                    UIController.showNotification(`Shareable Link copied to clipboard 🔗`, 'success');
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                    UIController.showNotification(`Failed to copy the link. Here it is: ${shareableLink}`, 'danger');
                });
            });
        }

        // Load query parameters into the form
        LinkSharer.loadQueryParamsToForm(form);

        // Automatically submit the form if query parameters exist
        LinkSharer.autoSubmitFormIfParamsExist(form);
    }

    /**
     * Displays a Bootstrap notification.
     * This method creates a dismissible alert element to show messages.
     * 
     * @param {string} message - The message to display.
     * @param {string} type - The type of alert (e.g., 'success', 'danger', 'info', 'warning').
     * @static
     * @returns {void}
     */
    static showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            console.error('Notification container not found in the DOM.');
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        notificationContainer.appendChild(alertDiv);

        // Automatically remove the alert after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
        }, 5000);
    }
}