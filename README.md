# Brazilian Currency Quote System

The **Brazilian Currency Quote System** is a web application designed to provide real-time exchange rates for the Brazilian Real (BRL) against foreign currencies. It offers a simple and intuitive interface for users to convert, track, and share currency data.

## Features

- **Real-Time Exchange Rates**: Get up-to-date exchange rates for the Brazilian Real (BRL) against foreign currencies.
- **Historical Data**: Look up exchange rates for specific dates in the past.
- **Custom Amount Conversion**: Convert any amount between BRL and foreign currencies.
- **Data Visualization**: View exchange rate charts to visualize rate changes.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Theme Toggle**: Switch between light and dark themes for better accessibility.
- **Shareable Links**: Generate and share specific currency conversion links.
- **Local Storage**: Save previous queries for faster access when revisiting.
- **PWA Support**: Includes a manifest file for Progressive Web App functionality.

## Technologies Used

- **HTML5**: For structuring the web pages.
- **CSS3**: Custom styles and Bootstrap for responsive design.
- **JavaScript (ES6+)**: Modular JavaScript using ES modules for better organization.
- **Bootstrap 5**: For responsive design and pre-styled components.
- **Chart.js**: For visualizing exchange rate data.
- **BrasilAPI**: Data source for currency exchange rates.
- **localStorage API**: For caching exchange rate data and user preferences.
- **GitHub Pages**: For hosting the application.
- **ESLint**: For code quality and consistent style.

## Project Structure

```text
br-currency-quote/
├── .github/
│   └── workflows/
│       └── main.yml       # GitHub Actions workflow for deployment with PR previews
├── images/                # Icons and logo assets
├── scripts/
│   ├── ChartRenderer.mjs  # Chart.js integration for data visualization
│   ├── CurrencyConversion.mjs # Handles currency conversion calculations
│   ├── CurrencyService.mjs # API service for fetching exchange rates
│   ├── HistoryTracker.mjs # Manages local storage of exchange rate history
│   ├── LinkSharer.mjs     # Handles creation and parsing of shareable links
│   ├── scripts.js         # Main entry point for JavaScript
│   └── UIController.mjs   # Manages the user interface and interactions
├── styles/
│   └── styles.css         # Custom CSS styles
├── index.html             # Main HTML file
├── manifest.json          # PWA manifest file
├── browserconfig.xml      # Browser configuration for Microsoft tiles
├── eslint.config.mjs      # ESLint configuration file
├── package.json           # Node.js package configuration
└── README.md              # Project documentation
```

## How It Works

1. The application fetches currency data from the BrasilAPI.
2. Users can select a source currency, target currency, amount, and date.
3. When the form is submitted, the application fetches the exchange rate and calculates the conversion.
4. Results are displayed with visual charts for better understanding.
5. Users can generate shareable links to specific conversions.
6. The application caches previous queries in localStorage for faster access.

## Accessibility

This project follows accessibility best practices:

- Theme toggle for better readability (light/dark mode)
- Semantic HTML structure for screen readers
- ARIA attributes for interactive elements
- Keyboard navigation support
- High contrast ratio for text elements

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/chrsmendes/br-currency-quote.git
   ```
2. Navigate to the project directory:
   ```bash
   cd br-currency-quote
   ```
3. Install dependencies (optional - for development only):
   ```bash
   npm install
   ```
4. Open `index.html` in your browser.

## Deployment

The project is automatically deployed to GitHub Pages using a GitHub Actions workflow. Any changes pushed to the `main` branch will trigger a deployment. Pull requests also get preview deployments available at a dedicated URL.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Contact

For questions or feedback, please contact:

- **Email**: titolei.bossle@gmail.com
- **GitHub**: [chrsmendes](https://github.com/chrsmendes)
