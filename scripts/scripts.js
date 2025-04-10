import CurrencyService from './CurrencyService.mjs';

document.addEventListener('DOMContentLoaded', async () => {
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
            option.value = currency.simbolo; // Assuming 'simbolo' is the currency code
            option.textContent = `${currency.nome} (${currency.simbolo})`;
            currencySelect.appendChild(option);
        });

        // Handle form submission
        const form = document.getElementById('exchange-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const selectedCurrency = currencySelect.value;
            const selectedDate = document.getElementById('date').value;

            try {
                const data = await CurrencyService.getExchangeRate(selectedCurrency, selectedDate);
                const lastRate = data.cotacoes[data.cotacoes.length - 1];

                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Exchange Rate for ${data.moeda} on ${data.data}</h5>
                            <p class="card-text">Buy Rate: ${data.moeda} 1.00 → BRL ${lastRate.cotacao_compra}</p>
                            <p class="card-text">Sell Rate: ${data.moeda} 1.00 → BRL ${lastRate.cotacao_venda}</p>
                        </div>
                    </div>
                `;
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
