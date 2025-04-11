# Brazilian Currency Quote System

The **Brazilian Currency Quote System** is a web application designed to provide real-time exchange rates for the Brazilian Real (BRL) against foreign currencies. It offers a simple and intuitive interface for users to convert, track, and share currency data.

## Features

- **Real-Time Exchange Rates**: Get up-to-date exchange rates for the Brazilian Real (BRL).
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Theme Toggle**: Switch between light and dark themes for better accessibility.
- **Social Media Integration**: Links to social media profiles for easy sharing.
- **PWA Support**: Includes a manifest file for Progressive Web App functionality.

## Technologies Used

- **HTML5**: For structuring the web pages.
- **CSS3**: Custom styles and Bootstrap for responsive design.
- **JavaScript**: For interactivity, including theme toggling.
- **Bootstrap 5**: For pre-styled components and layout.
- **GitHub Pages**: For hosting the static site.

## Project Structure

```
br-currency-quote/
├── .github/
│   └── workflows/
│       └── static.yml       # GitHub Actions workflow for deployment
├── images/                  # Icons and logo assets
├── scripts/
│   └── scripts.js           # Custom JavaScript for interactivity
├── styles/
│   └── styles.css           # Custom CSS for styling
├── index.html               # Main HTML file
├── manifest.json            # PWA manifest file
├── browserconfig.xml        # Browser configuration for Microsoft tiles
└── README.md                # Project documentation
```

## Accessibility

This project follows accessibility best practices:

- Buttons and links have accessible names using `aria-label` attributes.
- Semantic HTML is used for better screen reader support.

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/chrsmendes/br-currency-quote.git
   ```
2. Navigate to the project directory:
   ```bash
   cd br-currency-quote
   ```
3. Open `index.html` in your browser.

## Deployment

The project is automatically deployed to GitHub Pages using a GitHub Actions workflow. Any changes pushed to the `main` branch will trigger a deployment.

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
