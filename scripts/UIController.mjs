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
        }
    }

    /**
     * Creates a currency list item element with proper event listeners
     * 
     * @param {Object} currency - Currency object containing symbol, name, and flag information
     * @param {Function} onItemSelected - Callback function to execute when an item is selected
     * @returns {HTMLLIElement} - The list item element representing a currency option
     * @static
     * @private
     */
    static _createCurrencyListItem(currency, onItemSelected) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a class="dropdown-item" href="#" data-value="${currency.simbolo}">
            <img src="${currency.flag}" alt="${currency.nome} flag" width="25" height="25"> ${currency.simbolo}
        </a>`;

        listItem.addEventListener('click', function (e) {
            const dropdownContainer = this.closest('.dropdown');
            const selectedDropdown = dropdownContainer.querySelector('.selected-dropdown');
            selectedDropdown.innerHTML = this.innerHTML;
            selectedDropdown.setAttribute('data-value', currency.simbolo);

            if (onItemSelected) {
                onItemSelected(selectedDropdown);
            }
        });

        return listItem;
    }

    /**
     * Updates the conversion currency options based on the selected primary currency
     * 
     * @param {HTMLElement} selectedDropdown - The dropdown element that was changed
     * @param {Array} currencies - List of all available currencies
     * @param {HTMLUListElement} conversionCurrencyUl - The list element for conversion currencies
     * @static
     * @private
     */
    static _updateConversionCurrencyOptions(selectedDropdown, currencies, conversionCurrencyUl) {
        const selectedCurrency = selectedDropdown.getAttribute('data-value');

        // Clear previous options
        conversionCurrencyUl.innerHTML = '';

        if (selectedCurrency === 'BRL') {
            // When BRL is selected as the primary currency,
            // populate all other available currencies as conversion options
            this._populateForeignCurrencyOptions(currencies, conversionCurrencyUl);

            // Reset the selected conversion currency
            const conversionDropdown = conversionCurrencyUl.closest('.dropdown').querySelector('.selected-dropdown');
            conversionDropdown.innerHTML = "";
            conversionDropdown.setAttribute('data-value', '');
        } else {
            // When a foreign currency is selected, only allow BRL as conversion currency
            this._setOnlyBRLAsConversionOption(currencies, conversionCurrencyUl);
        }
    }

    /**
     * Populates the conversion dropdown with all foreign currencies (excluding BRL)
     * 
     * @param {Array} currencies - List of all available currencies
     * @param {HTMLUListElement} conversionCurrencyUl - The list element for conversion currencies
     * @static
     * @private
     */
    static _populateForeignCurrencyOptions(currencies, conversionCurrencyUl) {
        currencies.forEach(currency => {
            if (currency.simbolo !== 'BRL') {
                const listItem = this._createCurrencyListItem(currency, null);
                conversionCurrencyUl.appendChild(listItem);
            }
        });
    }

    /**
     * Sets BRL as the only available conversion currency option
     * 
     * @param {Array} currencies - List of all available currencies
     * @param {HTMLUListElement} conversionCurrencyUl - The list element for conversion currencies
     * @static
     * @private
     */
    static _setOnlyBRLAsConversionOption(currencies, conversionCurrencyUl) {
        const brlCurrency = currencies.find(currency => currency.simbolo === 'BRL');
        if (brlCurrency) {
            const listItem = this._createCurrencyListItem(brlCurrency, null);
            conversionCurrencyUl.appendChild(listItem);

            // Auto-select BRL as the conversion currency
            listItem.click();
        }
    }

    /**
     * Populates the currency options in the select elements.
     * This method also sets up an event listener to filter the conversion currency options
     * based on the selected currency.
     * 
     * @param {Array} currencies - List of currency objects to populate the select elements
     * @param {HTMLUListElement} currencyUl - The list element for the main currency
     * @param {HTMLUListElement} conversionCurrencyUl - The list element for the conversion currency
     * @static
     * @returns {void}
     */
    static populateCurrencyOptions(currencies, currencyUl, conversionCurrencyUl) {

        // Populate the primary currency dropdown
        currencies.forEach(currency => {
            const listItem = this._createCurrencyListItem(
                currency,
                (selectedDropdown) => this._updateConversionCurrencyOptions(
                    selectedDropdown,
                    currencies,
                    conversionCurrencyUl
                )
            );
            currencyUl.appendChild(listItem);
        });
    }

    /**
     * Displays the result of the exchange rate calculation in the UI.
     * This method creates a card element to show the exchange rate details.
     * 
     * @param {Object} data - The exchange rate data to display
     * @param {string} selectedCurrency - The selected currency code
     * @param {string} conversionCurrency - The conversion currency code
     * @param {Object} lastRate - The last exchange rate object containing buy and sell rates
     * @param {number} amount - The amount to convert
     * @static
     * @returns {void}
     */
    static displayResult(data, selectedCurrency, conversionCurrency, lastRate, amount) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="card mb-3">
                <div class="card-body">
                    <h3 class="card-title">Exchange Rate for ${selectedCurrency} on ${data.data}</h3>
                    <p class="card-text">Buy Rate: ${selectedCurrency} ${amount} → ${conversionCurrency} ${lastRate.cotacao_compra}</p>
                    <p class="card-text">Sell Rate: ${selectedCurrency} ${amount} → ${conversionCurrency} ${lastRate.cotacao_venda}</p>
                </div>
            </div>
        `;
    }

    /**
     * Displays an error message in the UI.
     * This method creates an alert element to show the error details.
     * 
     * @param {Error} error - The error object containing the error message
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
    }

    /**
     * Toggles the theme between light and dark modes.
     * This method updates the theme attribute on the document element and changes the button icon.
     * 
     * @param {HTMLElement} themeToggle - The button element used to toggle the theme
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
     * Validates that one of the currencies must be BRL
     * 
     * @param {string} sourceCurrency - The source currency code
     * @param {string} targetCurrency - The target currency code
     * @returns {boolean} - Whether the selection is valid (one of them must be BRL)
     * @static
     * @private
     */
    static _validateCurrencySelection(sourceCurrency, targetCurrency) {
        if (sourceCurrency !== 'BRL' && targetCurrency !== 'BRL') {
            this.showNotification('Conversions are only allowed between BRL and other currencies.', 'warning');
            return false;
        }
        return true;
    }

    /**
     * Fetches and processes exchange rate data
     * 
     * @param {string} selectedCurrency - The selected source currency code
     * @param {string} conversionCurrency - The selected target currency code
     * @param {string} selectedDate - The date for the exchange rate
     * @param {number} amount - The amount to convert
     * @returns {Promise<Object>} - The calculated exchange rate data
     * @static
     * @private
     */
    static async _fetchExchangeRateData(selectedCurrency, conversionCurrency, selectedDate, amount) {
        let data;

        if (selectedCurrency === 'BRL') {
            // Use CurrencyConversion for BRL to foreign currency
            data = await CurrencyConversion.getBRLExchangeRate(conversionCurrency, selectedDate);
        } else {
            // Use CurrencyService for foreign currency to BRL
            data = await CurrencyService.getExchangeRate(selectedCurrency, selectedDate);
        }

        // Calculate custom amount
        return CurrencyConversion.calculateCustomAmount(data, amount);
    }

    /**
     * Handles the form submission for currency conversion.
     * This method validates the input, fetches the exchange rate data, and displays the result.
     * 
     * @param {HTMLFormElement} form - The form element for currency conversion
     * @param {HTMLElement} currencySpan - The element that holds the selected source currency
     * @param {HTMLElement} conversionCurrencySpan - The element that holds the selected target currency
     * @static
     * @returns {void}
     */
    static async handleFormSubmission(form, currencySpan, conversionCurrencySpan) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedCurrency = currencySpan.getAttribute('data-value');
            const conversionCurrency = conversionCurrencySpan.getAttribute('data-value');
            const amount = parseFloat(document.getElementById('amount').value);
            const selectedDate = document.getElementById('date').value;

            // Validate that one of the currencies is BRL
            if (!this._validateCurrencySelection(selectedCurrency, conversionCurrency)) {
                return;
            }

            try {
                const calculatedData = await this._fetchExchangeRateData(
                    selectedCurrency,
                    conversionCurrency,
                    selectedDate,
                    amount
                );

                const lastRate = calculatedData.cotacoes && calculatedData.cotacoes.length > 0
                    ? calculatedData.cotacoes[calculatedData.cotacoes.length - 1]
                    : null;

                if (!lastRate) {
                    throw new Error('No exchange rate data available for the selected date.');
                }

                this.displayResult(calculatedData, selectedCurrency, conversionCurrency, lastRate, amount);

                // Render the exchange rate chart
                this._renderExchangeRateChart(calculatedData);

            } catch (error) {
                this.displayError(error);
            }
        });
    }

    /**
     * Renders the exchange rate chart and adds it to the DOM
     * 
     * @param {Object} calculatedData - The exchange rate data to visualize
     * @static
     * @private
     */
    static _renderExchangeRateChart(calculatedData) {
        // Remove any previous chart if exists
        const previousChart = document.getElementById('exchangeRateChart');
        if (previousChart) {
            previousChart.remove();
        }

        const chart = renderExchangeRateChart(calculatedData);
        const resultDiv = document.getElementById('result');
        const resultDivParent = resultDiv.parentNode;
        resultDivParent.insertBefore(chart, resultDiv.nextSibling);
    }

    /**
     * Adds functionality to generate and copy a shareable link for the form.
     * This method sets up the event listener for the 'Generate Shareable Link' button
     * and handles copying the link to the clipboard.
     * 
     * @param {HTMLFormElement} form - The form element for currency conversion
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
                }).catch(() => {
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
     * @param {string} message - The message to display
     * @param {string} type - The type of alert (e.g., 'success', 'danger', 'info', 'warning')
     * @static
     * @returns {void}
     */
    static showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
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