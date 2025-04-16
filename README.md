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
- **Husky**: For Git hooks to enforce code quality standards.
- **lint-staged**: For running linters on staged Git files.
- **Prettier**: For consistent code formatting.

## Project Structure

```text
br-currency-quote/
├── .github/
│   └── workflows/
│       └── main.yml       # GitHub Actions workflow for deployment with PR previews
├── .husky/                # Git hooks for code quality enforcement
│   └── pre-commit         # Pre-commit hook to run linters before committing
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
3. Install dependencies:
   ```bash
   npm install
   ```
4. Open `index.html` in your browser.

## Development

This project uses several tools to maintain code quality:

- **ESLint**: Checks JavaScript code for quality and adherence to style guidelines
- **Prettier**: Formats code consistently across the project
- **Husky**: Manages Git hooks to automate quality checks
- **lint-staged**: Runs linters only on staged Git files for better performance

A pre-commit hook is set up to run ESLint and Prettier on your files before each commit. This ensures that all code committed to the repository maintains consistent style and passes linting rules. If any issues are found that can't be automatically fixed, the commit will be blocked until you resolve them.

## Deployment

The project is automatically deployed to GitHub Pages using a GitHub Actions workflow. Any changes pushed to the `main` branch will trigger a deployment. Pull requests also get preview deployments available at a dedicated URL.

### Continuous Integration

This project uses GitHub Actions for continuous integration to ensure code quality:

- **Automated Linting**: All pushes to the main branch and pull requests are automatically checked with ESLint and Prettier
- **Quality Gates**: Deployments will only proceed if all linting checks pass
- **Preview Environments**: Pull requests generate preview environments with URLs commented directly on the PR

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and ensure they pass the linting checks.
4. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
   Note: The pre-commit hook will automatically run ESLint and Prettier before allowing the commit.
5. Push to your branch:
   ```bash
   git push origin feature-name
   ```
6. Open a pull request.

## Contact

For questions or feedback, please contact:

- **Email**: titolei.bossle@gmail.com
- **GitHub**: [chrsmendes](https://github.com/chrsmendes)
