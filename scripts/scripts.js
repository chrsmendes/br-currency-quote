import CurrencyService from './CurrencyService.mjs';
import { renderExchangeRateChart } from './ChartRenderer.mjs';
import CurrencyConversion from './CurrencyConversion.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    setMaxDate();

    try {
        // Check if currencies are already in localStorage
        let currencies = JSON.parse(localStorage.getItem('currencies'));
        if (!currencies) {
            currencies = await CurrencyService.getCurrencies();
            localStorage.setItem('currencies', JSON.stringify(currencies));
        }

        // Populate currency options from localStorage
        const currencySelect = document.getElementById('currency');
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.simbolo;
            option.textContent = `${currency.nome} (${currency.simbolo})`;
            currencySelect.appendChild(option);
        });

        // Populate currency options for conversion
        const conversionCurrencySelect = document.getElementById('conversion-currency');

        currencySelect.addEventListener('change', () => {
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
        });

        // Handle form submission
        const form = document.getElementById('exchange-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedCurrency = currencySelect.value;
            const conversionCurrency = conversionCurrencySelect.value;
            const amount = parseFloat(document.getElementById('amount').value);

            // Validate that one of the currencies is BRL
            if (selectedCurrency !== 'BRL' && conversionCurrency !== 'BRL') {
                alert('Conversions are only allowed between BRL and other currencies.');
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

                // Remove any previous chart if exists
                const previousChart = document.getElementById('exchangeRateChart');
                if (previousChart) {
                    previousChart.remove();
                }

                const chart = renderExchangeRateChart(calculatedData);
                const resultDivParent = resultDiv.parentNode;
                resultDivParent.insertBefore(chart, resultDiv.nextSibling);

            } catch (error) {
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <strong>Error:</strong> ${error.message || 'An unexpected error occurred.'}
                    </div>
                `;

                console.error('Failed to fetch exchange rate:', error);
            }
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

// When click on the button, toggle the "active" switch the data-bs-theme of the html element between "dark" and "light"
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-bs-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);

    // change the content of the button
    if (targetTheme === 'dark') {
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }
});

function setMaxDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('max', today);
    } else {
        console.warn('Element with id "date" not found in the DOM.');
    }
}