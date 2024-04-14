const allTabsBody = document.querySelectorAll('.tab-body-single');
const allTabsHead = document.querySelectorAll('.tab-head-single');
const searchForm = document.querySelector('.app-header-search');
let searchList = document.getElementById('search-list');

let activeTab = 1, allData;

const init = () => {
    showActiveTabBody();
    showActiveTabHead();
}

const showActiveTabHead = () => allTabsHead[activeTab - 1].classList.add('active-tab');

const showActiveTabBody = () => {
    hideAllTabBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
}

const hideAllTabBody = () => allTabsBody.forEach(singleTabBody => singleTabBody.classList.remove('show-tab'));
const hideAllTabHead = () => allTabsHead.forEach(singleTabHead => singleTabHead.classList.remove('active-tab'));

window.addEventListener('DOMContentLoaded', () => init());

allTabsHead.forEach(singleTabHead => {
    singleTabHead.addEventListener('click', () => {
        hideAllTabHead();
        activeTab = singleTabHead.dataset.id;
        showActiveTabHead();
        showActiveTabBody();
    });
});

const getInputValue = (event) => {
    event.preventDefault();
    let searchText = searchForm.search.value;
    if (searchText.length > 1) {
        fetchAllSuperHero(searchText);
    } else {
        searchList.innerHTML = "";
    }
}

searchForm.addEventListener('submit', getInputValue);

const fetchAllSuperHero = async (searchText) => {
    let url = `https://www.superheroapi.com/api.php/1216454192525968/search/${searchText}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allData = await response.json();
        if (allData.response === 'success') {
            showSearchList(allData.results);
        }
    } catch (error) {
        console.log('Fetch error:', error.message);
    }
}

const showSearchList = (data) => {
    searchList.innerHTML = "";
    data.forEach(dataItem => {
        const divElem = document.createElement('div');
        divElem.classList.add('search-list-item');
        divElem.innerHTML = `
            <img src="${dataItem.image.url ? dataItem.image.url : ""}" alt="">
            <p data-id="${dataItem.id}">${dataItem.name}</p>
        `;
        searchList.appendChild(divElem);
    });
}

searchForm.search.addEventListener('keyup', getInputValue);

searchList.addEventListener('click', (event) => {
    let searchId = event.target.dataset.id;
    let singleData = allData.results.find(dataItem => searchId === dataItem.id);
    if (singleData) {
        showSuperheroDetails(singleData);
    }
    searchList.innerHTML = "";
});
const showSuperheroDetails = (data) => {
    console.log(data);
    document.querySelector('.app-body-content-thumbnail').innerHTML = `
        <img src="${data.image.url}">
    `;
    
    document.querySelector('.name').textContent = data.name;

    const powerstatsList = document.querySelector('.powerstats');
    powerstatsList.innerHTML = "";
    for (const [key, value] of Object.entries(data.powerstats)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <i class="fa-solid fa-shield-halved"></i>
                <span>${key}</span>
            </div>
            <span>${value}</span>
        `;
        powerstatsList.appendChild(listItem);
    }

    const biographyList = document.querySelector('.biography');
    biographyList.innerHTML = "";
    for (const [key, value] of Object.entries(data.biography)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${key}</span>
            <span>${value}</span>
        `;
        biographyList.appendChild(listItem);
    }

    const appearanceList = document.querySelector('.appearance');
    appearanceList.innerHTML = "";
    for (const [key, value] of Object.entries(data.appearance)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span><i class="fas fa-star"></i> ${key}</span>
            <span>${value}</span>
        `;
        appearanceList.appendChild(listItem);
    }

    const connectionsList = document.querySelector('.connections');
    connectionsList.innerHTML = "";
    for (const [key, value] of Object.entries(data.connections)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${key}</span>
            <span>${value}</span>
        `;
        connectionsList.appendChild(listItem);
    }
}
