import "./styles/style.css";
import { getRates } from "./utils/rates.js";

const table = document.getElementById('table');

const createTableRow = () => {
    const row = document.createElement("tr");
    row.classList.add("row");
    table.appendChild(row);
}

const createTableElement = (currency, rate=0) => {
    const currentRow = table.lastElementChild;

    const data = document.createElement("td");
    data.innerText = currency;
    data.classList.add("currency");
    currentRow.appendChild(data);
}

window.onload = async () => {
    const rates = await getRates();
    const currencies = Object.keys(rates);

    currencies.forEach((currency, index) => {
        if(index === 0 || index%3 === 0) {
            createTableRow();
        }

        createTableElement(currency);
    });
}