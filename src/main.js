import "./styles/style.css";
import { getRates } from "./utils/rates.js";

const dropdown = document.getElementById("currency-dropdown");
const applyNewCurrency = document.getElementById("fetch");
const tableContainer = document.getElementById("table-container");
const body = document.getElementById("main");
const modeSelector = document.getElementById("mode-selector");


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
    data.classList.add("table-data");
    
    const currencyElement = document.createElement("div");
    currencyElement.classList.add("currency-element");
    currencyElement.innerText = currency;
    
    const rateElement = document.createElement("div");
    rateElement.classList.add("rate-element");
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
        const currentRate = rates[`${currency}`].toFixed(4);
        createTableElement(currency, currentRate);
    });
}

const removeTable = () => {
    const currentTable = document.getElementById("table");
    currentTable.remove();
}

const checkCurrMode = () => body.className;

const switchElementMode = (element) => {
    const currElmentClasses = element.classList()
    const currMode = checkCurrMode();

    const newClasses = currElmentClasses.map((elementClass) => {
        if (elementClass !== currMode) {
            return elementClass;
        }
    });

    currMode === 'dark' ? newClasses.push('light') : newClasses.push('dark');

    newClasses.forEach((newClass) => {
        element.classList.add(newClass);
    });
}


applyNewCurrency.addEventListener("click", async () => {
    const rates = await getRates(dropdown.value);
    const currencies = Object.keys(rates);
    
    sessionStorage.setItem("rates", JSON.stringify(rates));
    removeTable();
    createTable(rates, currencies);
});

modeSelector.addEventListener('click', () => {
    const currentMode = body.className;
    body.className = "";

    currentMode == "light" ? body.className = 'dark' : body.className = 'light';
});

window.onload = async () => {
    const rates = await getRates();
    const currencies = Object.keys(rates);
    
    sessionStorage.setItem("rates", JSON.stringify(rates));
    
    setDropDownOptions(currencies);
    createTable(rates, currencies);
}