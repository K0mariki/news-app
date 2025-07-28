const APIKEY = '42864fc20a3748309d66ce9e80d92efd';
const APIURL = `https://newsapi.org/v2/everything?q=`;
const formSearch = document.getElementById('formSearch');
const titleNews = document.getElementById('titleNews');
const dateFromNewsSelect = document.getElementById('dateFromNews');
const dateToNewsSelect = document.getElementById('dateToNews');
const filterNewsSelect = document.getElementById('filterNews');
const languageNewsSelect = document.getElementById('languageNews');
const tabletNewsNode = document.getElementById('tabletNews');
const nextBtnNode = document.getElementById('nextBtn');
const prevBtnNode = document.getElementById('prevBtn');


let articlesArr = [];
let fromNews = 0;
let toNews = 10;

if(localStorage.getItem('news')){
    const news = JSON.parse(localStorage.getItem('news'));
    const from = JSON.parse(localStorage.getItem('from'));
    const to = JSON.parse(localStorage.getItem('to'));
    articlesArr = news;
    renderNews(from, to, news)
}

async function getNews(title, dateFrom, dateTo, sort, language) {
    const responce = await fetch(`${APIURL}${title}${dateFrom}${dateTo}&sortBy=${sort}&language=${language}&apiKey=${APIKEY}`);
    const data = await responce.json();
    articlesArr = data.articles;
    renderNews(0, 10, articlesArr);
};

formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleNews.value;
    const dateFromNews = parseDate(dateFromNewsSelect.value, 'from');
    const dateToNews = parseDate(dateToNewsSelect.value, 'to');
    const filterNews = filterNewsSelect.value;
    const languageNews = languageNewsSelect.value;
    getNews(title, dateFromNews, dateToNews, filterNews, languageNews);
});

function parseDate(date, format) {
    if (date) {
        return `&${format}=${date}`;
    }
    return '';
};


function renderNews (from, to, arrayNews){
    const sliceArray = arrayNews.slice(from, to);
    tabletNewsNode.innerHTML = '';
    sliceArray.forEach((article) => {
        const cardHTML = `
        <div class="col">
            <div class="card h-100">
                <a href="${article.url}" target="_blank"><img src="${article.urlToImage}" class="card-img-top" alt="перейти к посту"></a>
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description}</p>
                </div>
                <div class="card-footer">
                    <a href="/" class="card-subtitle mb-2">${article.author}</a>
                    <small class="text-body-secondary">${article.publishedAt}</small>
                </div>
            </div>
        </div>`;
        tabletNewsNode.innerHTML += cardHTML;
        saveLocalStorage(fromNews, toNews, articlesArr);
    });
};

nextBtnNode.addEventListener('click', ()=> {
    fromNews = fromNews + 10;
    toNews = toNews + 10;
    renderNews(fromNews, toNews, articlesArr);
});

prevBtnNode.addEventListener('click', ()=> {
    fromNews = fromNews - 10;
    toNews = toNews - 10;
    renderNews(fromNews, toNews, articlesArr);
});

function saveLocalStorage(from, to, array) {
    localStorage.setItem('news', JSON.stringify(array));
    localStorage.setItem('from', JSON.stringify(from));
    localStorage.setItem('to', JSON.stringify(to));
}