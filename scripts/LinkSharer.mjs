/**
 * LinkSharer module for creating and handling shareable links with query parameters.
 */
export default class LinkSharer {
    /**
     * Generates a shareable link containing the query parameters of the form.
     * @param {HTMLFormElement} form - The form element containing the query parameters.
     * @returns {string} - The generated shareable link.
     */
    static generateShareableLink(form) {
        const url = new URL(window.location.href);
        const formData = new FormData(form);

        // Clear existing query parameters
        url.search = '';

        // Append form data as query parameters
        formData.forEach((value, key) => {
            if (value) {
                url.searchParams.set(key, value);
            }
        });

        return url.toString();
    }

    /**
     * Loads query parameters from the URL into the form fields.
     * @param {HTMLFormElement} form - The form element to populate with query parameters.
     * @returns {void}
     */
    static loadQueryParamsToForm(form) {
        const urlParams = new URLSearchParams(window.location.search);

        urlParams.forEach((value, key) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;

                // if input is option, call the change event to trigger any listeners
                if (input.tagName === 'SELECT') {
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            }
        });
    }

    /**
     * Submits the form automatically if query parameters are present in the URL.
     * Waits for all form fields to be populated before submitting the form.
     * @param {HTMLFormElement} form - The form element to submit.
     * @returns {void}
     */
    static async autoSubmitFormIfParamsExist(form) {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.toString()) {
            // Dispatch the submit event
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    }
}