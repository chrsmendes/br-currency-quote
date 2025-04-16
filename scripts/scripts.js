// Apply saved theme before anything else
import UIController from "./UIController.mjs";
UIController.applySavedTheme();

import CurrencyService from "./CurrencyService.mjs";
import LinkSharer from "./LinkSharer.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  UIController.setMaxDate();
  UIController.initializeThemeToggle();

  try {
    // Fetch currencies using the cache-first strategy
    const currencies = await CurrencyService.getOrFetchCurrencies();

    // Get references to DOM elements for dropdown containers
    const currencyUl = document.querySelector(
      'ul[aria-labelledby="currency-container"]',
    );
    const conversionCurrencyUl = document.querySelector(
      'ul[aria-labelledby="conversion-currency-container"]',
    );
    UIController.populateCurrencyOptions(
      currencies,
      currencyUl,
      conversionCurrencyUl,
    );

    // Get references to the form and currency selection elements
    const form = document.getElementById("exchange-form");
    const currencySpan = document.querySelector("#currency-span");
    const conversionCurrencySpan = document.querySelector(
      "#conversion-currency-span",
    );
    UIController.handleFormSubmission(
      form,
      currencySpan,
      conversionCurrencySpan,
    );

    // Set up the shareable link functionality
    UIController.setupShareableLink(form);

    // Load any query parameters into the form
    LinkSharer.loadQueryParamsToForm(form);

    // Automatically submit the form if query parameters exist
    LinkSharer.autoSubmitFormIfParamsExist(form);

    setupFormValidation(form);
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
});

/**
 * Sets up validation for the currency exchange form.
 *
 * @param {HTMLFormElement} form - The form element to validate
 */
function setupFormValidation(form) {
  // Validation function for dropdown elements
  function validateDropdown(dropdown) {
    if (!dropdown.querySelector(".selected-dropdown").textContent) {
      dropdown.classList.add("is-invalid");
      return false;
    } else {
      dropdown.classList.remove("is-invalid");
      return true;
    }
  }

  form.querySelectorAll(".form-control").forEach((dropdown) => {
    dropdown.addEventListener("click", () => validateDropdown(dropdown));
  });

  form.addEventListener("submit", (event) => {
    let isValid = true;

    form.querySelectorAll("[data-required]").forEach((dropdown) => {
      if (!dropdown.querySelector(".selected-dropdown").textContent) {
        dropdown.classList.add("is-invalid");
        isValid = false;
      }
    });

    if (!form.checkValidity() || !isValid) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  });
}

/**
 * Bootstrap's built-in form validation initialization
 * This adds validation styles to all forms with the 'needs-validation' class
 */
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
