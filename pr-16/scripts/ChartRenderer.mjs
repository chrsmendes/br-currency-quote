// Get Chart from the global scope since it's loaded via CDN in HTML
const Chart = window.Chart;

export function renderExchangeRateChart(data, chartId = 'exchangeRateChart') {
    if (!Array.isArray(data.cotacoes) || data.cotacoes.length === 0) {
        throw new Error('Invalid or empty cotacoes array');
    }

    const labels = data.cotacoes.map(cotacao => {
        const parts = typeof cotacao.data_hora_cotacao === 'string' ? cotacao.data_hora_cotacao.split(' ') : [];
        return parts.length > 1 ? parts[1].substring(0, 5) : 'Unknown';
    });
    const buyRates = data.cotacoes.map(cotacao => cotacao.cotacao_compra || 0);
    const sellRates = data.cotacoes.map(cotacao => cotacao.cotacao_venda || 0);

    const canvas = document.createElement('canvas');
    canvas.id = chartId;
    canvas.style.maxWidth = '700px';
    canvas.style.maxHeight = '400px';

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Buy Rate',
                    data: buyRates,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                    label: 'Sell Rate',
                    data: sellRates,
                    borderColor: 'rgb(93, 220, 38)',
                    backgroundColor: 'rgba(93, 220, 38, 0.2)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Exchange Rate for ${data.moeda} on ${data.data}`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Rate (BRL)'
                    }
                }
            }
        }
    });

    return canvas;
}