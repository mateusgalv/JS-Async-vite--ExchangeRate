export const getRates = async (currency = "BRL") => {
    try {
        const URL = `https://v6.exchangerate-api.com/v6/12e6e2d0bd6f4b72fb7af04b/latest/${currency}`;
        return fetch(URL)
        .then(response => response.json())
        .then(data => data.conversion_rates);
    } catch {
        console.alert("error");
    }
}
