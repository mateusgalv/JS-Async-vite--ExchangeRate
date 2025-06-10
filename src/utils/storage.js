export const storeRates = (rates) => {
    sessionStorage.setItem("rates", JSON.stringify(rates));
}

export const getStoredRates = () => {
    return JSON.parse(sessionStorage.getItem("rates"));
}

export const storeFavorites = (favorites) => {
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
}

export const getStoredFavorites = () => {
    return JSON.parse(sessionStorage.getItem("favorites"));
}