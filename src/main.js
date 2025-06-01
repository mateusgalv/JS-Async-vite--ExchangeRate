import "./styles/style.css";
import { getRates } from "./utils/rates.js";

const dropdown = document.getElementById("currency-dropdown");
const applyNewCurrency = document.getElementById("fetch");
const tableContainer = document.getElementById("table-container");

const setDropDownOptions = (currencies) => {
    currencies.forEach(currency => {
        const option = document.createElement("option");
        
        option.innerText = currency;
        dropdown.appendChild(option);
    });
}

const createTableRow = () => {
    const row = document.createElement("tr");
    row.classList.add("row");
    table.appendChild(row);
}

const createTableElement = (currency, rate) => {
    const currentRow = table.lastElementChild;

    const data = document.createElement("td");
    const currencyElement = document.createElement("div");
    const rateElement = document.createElement("div");
    
    currencyElement.innerText = currency;
    rateElement.innerText = rate;
    
    data.appendChild(currencyElement);
    data.appendChild(rateElement);
    currentRow.appendChild(data);
}

const createTable = (rates, currencies) => {
    const table = document.createElement("table");
    table.id = "table";
    tableContainer.appendChild(table);
    
    currencies.shift() // first element = selected currency
    
    currencies.forEach((currency, index) => {
        if(index === 0 || index%3 === 0) {
            createTableRow();
        }
        const currentRate = rates[`${currency}`].toFixed(2);
        createTableElement(currency, currentRate);
    });
}

const removeTable = () => {
    const currentTable = document.getElementById("table");
    currentTable.remove();
}

applyNewCurrency.addEventListener("click", async () => {
    const rates = await getRates(dropdown.value);
    const currencies = Object.keys(rates);

    sessionStorage.setItem("rates", JSON.stringify(rates));
    removeTable();
    createTable(rates, currencies);
});

window.onload = async () => {
    const rates = await getRates();
    const currencies = Object.keys(rates);

    sessionStorage.setItem("rates", JSON.stringify(rates));
    
    setDropDownOptions(currencies);
    createTable(rates, currencies);
}