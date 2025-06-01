const API_KEY = "12e6e2d0bd6f4b72fb7af04b";
const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export const getRates = () => fetch(URL)
    .then(response => response.json())
    .then(data => data.conversion_rates);
