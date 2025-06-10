import "./styles/style.css";
import { getRates, getCurrencies } from "./utils/rates.js";
import {
    storeRates,
    getStoredRates,
    storeFavorites,
    getStoredFavorites,
} from "./utils/storage.js";

const header = document.getElementById("settings-bar");
const body = document.getElementById("body");
const dropdown = document.getElementById("currency-dropdown");
const tableContainer = document.getElementById("table-container");
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

const createTableDataElement = (currency, rate, favorites) => {
    const lastRow = table.lastElementChild;
    
    const tdElement = document.createElement("td");
    tdElement.classList.add("table-data", currentTheme());  
    tdElement.addEventListener("click", () => tdElement.classList.toggle("favorite"));
    
    const currencyElement = createDiv("currency-element", currency);
    const rateElement = createDiv("rate-element", rate);

    if(favorites.includes(currency)) {
        tdElement.classList.add("favorite")
    }
    
    tdElement.appendChild(currencyElement);
    tdElement.appendChild(rateElement);
    lastRow.appendChild(tdElement);

    return tdElement;
}

const currentTheme = () => body.className;

const getTable = () => document.getElementById("table");

const getFavoriteElements = () => {
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
    const allElements = [
        header,
        themeToggle,
        userOptions,
        tableContainer,
        getTable(),
        ...allTableDataElements
    ];

    allElements.forEach((element) => {
        toggleTheme(element);
    })
}

const displayFavCurrencies = () => {
    const favorites = getFavoriteElements();

    removeTable();
    createFavTable(favorites);
}

const displayAllCurrencies = () => {
    const rates = getStoredRates();
    const currencies = getCurrencies(rates);
    const favorites = getFavoriteElements();

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

const getFavorites = () => {
    const favoriteElements = getFavoriteElements();

    const favList = favoriteElements.map((tdElement) => tdElement.children[0].innerText);
    storeFavorites(favList);

    return favoriteElements;
}

applyBtn.addEventListener("click", async () => {
    const rates = await getRates(dropdown.value);
    const currencies = Object.keys(rates);
    
    storeRates(rates);
    const favoriteElements = getFavorites();

    changeSelectedCurrency(currencies[0]);
    removeTable();
    createFullTable(rates, currencies);
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

const changeSelectedCurrency = (newCurrency) => {
    currency.innerText = `Mostrando valores de 1.00 ${newCurrency}`;
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
    currencies.shift() // first element = selected currency
    const favorites = getStoredFavorites();

    createTableElement();
    currencies.forEach((currency, index) => {
        if(index === 0 || index%3 === 0) {
            createTableRowElement();
        }
        const currentRate = rates[`${currency}`].toFixed(4);
        createTableDataElement(currency, currentRate, favorites);
    });
    if(favToggle.checked) {
        displayFavCurrencies();
    }
}

window.onload = async () => {
    const rates = await getRates();
    const currencies = getCurrencies(rates);
    const mainCurrency = currencies[0];

    storeRates(rates);
    storeFavorites([]);
    
    changeSelectedCurrency(mainCurrency);
    setDropDownOptions(currencies);
    createFullTable(rates, currencies);
}