import "./styles/style.css";
import { getRates } from "./utils/rates.js";

const body = document.getElementById("main");
const dropdown = document.getElementById("currency-dropdown");
const tableContainer = document.getElementById("table-container");
const currencyContainer = document.getElementById("currency-container");
const currency = document.getElementById("currency");

const themeToggle = document.getElementById("theme-toggle");
const favToggle = document.getElementById("fav-toggle");

const applyBtn = document.getElementById("apply-btn");

const userOptions = document.getElementsByClassName("user-options")[0];

const createTableElement = () => {
    const table = document.createElement("table");
    table.id = "table";    
    table.classList.add(currentTheme());
    tableContainer.appendChild(table);

    return table;
}

const createTableRowElement = () => {
    const row = document.createElement("tr");
    row.classList.add("row");
    table.appendChild(row);

    return row;
}

const createDiv = (className, value) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add(className);
    newDiv.innerText = value;

    return newDiv;
}

const createTableDataElement = (currency, rate) => {
    const currentRow = table.lastElementChild;
    
    const data = document.createElement("td");
    data.classList.add("table-data", currentTheme());  
    data.addEventListener("click", () => data.classList.toggle("favorite"));
    
    const currencyElement = createDiv("currency-element", currency);
    const rateElement = createDiv("rate-element", rate);
    
    data.appendChild(currencyElement);
    data.appendChild(rateElement);
    currentRow.appendChild(data);

    return data;
}

const currentTheme = () => body.className;

const getTable = () => document.getElementById("table");

const getFavorites = () => {
    const collection = document.getElementsByClassName("favorite");
    
    return [...collection];
}

const removeTable = () => {
    const table = getTable();
    table.remove();
}

const toggleTheme = (element) => {
    element.classList.remove("dark", "light");
    currentTheme() === "dark" ? element.classList.add("dark") : element.classList.add("light");
}

const uncheckFav = () => favToggle.checked = false;

const switchAllElementsTheme = () => {
    const allTableDataElements = document.getElementsByTagName("td");
    const allElements = [getTable(), currencyContainer, userOptions, tableContainer, ...allTableDataElements];

    allElements.forEach((element) => {
        toggleTheme(element);
    })
}

const displayFavCurrencies = () => {
    const favorites = getFavorites();

    removeTable();
    createFavTable(favorites);
}

const displayAllCurrencies = () => {
    const rates = JSON.parse(sessionStorage.getItem("rates"));
    const currencies = Object.keys(rates);
    const favorites = getFavorites();

    removeTable();
    createFullTable(rates, currencies);
    const allElements = [...document.getElementsByTagName("td")];
    favorites.forEach((favorite) => {
        allElements.forEach((element) => {
            if(element.firstChild.innerText === favorite.firstChild.innerText) {
                element.classList.add("favorite");
            }
        });
    });
}

applyBtn.addEventListener("click", async () => {
    const rates = await getRates(dropdown.value);
    const currencies = Object.keys(rates);
    changeCurrencyOnText(currencies[0]);
    
    sessionStorage.setItem("rates", JSON.stringify(rates));
    removeTable();
    createFullTable(rates, currencies);
    uncheckFav();
});

themeToggle.addEventListener("click", () => {
    const currentTheme = body.className;
    body.className = "";

    currentTheme == "light" ? body.className = 'dark' : body.className = 'light';
    switchAllElementsTheme();
});

favToggle.addEventListener("change", (e) => {
    if(e.target.checked) {
        displayFavCurrencies();
    } else {
        displayAllCurrencies();
    }
});

const changeCurrencyOnText = (newCurrency) => {
    currency.innerText = `Valores de 1.00 ${newCurrency}`;
}

const setDropDownOptions = (currencies) => {
    currencies.forEach(currency => {
        const option = document.createElement("option");
        
        option.innerText = currency;
        dropdown.appendChild(option);
    });
}

const createFavTable = (favorites) => {
    const table = createTableElement();
    
    favorites.forEach((favorite, index) => {
        if(index === 0 || index%3 === 0) {
            createTableRowElement();
        }
        const currentRow = table.lastElementChild;
        currentRow.appendChild(favorite);
    });
}

const createFullTable = (rates, currencies) => {
    createTableElement();

    currencies.shift() // first element = selected currency
    
    currencies.forEach((currency, index) => {
        if(index === 0 || index%3 === 0) {
            createTableRowElement();
        }
        const currentRate = rates[`${currency}`].toFixed(4);
        createTableDataElement(currency, currentRate);
    });
}

window.onload = async () => {
    const rates = await getRates();
    const currencies = Object.keys(rates);
    const mainCurrency = currencies[0];
    
    sessionStorage.setItem("rates", JSON.stringify(rates));
    
    changeCurrencyOnText(mainCurrency);
    setDropDownOptions(currencies);
    createFullTable(rates, currencies);
}