let API_URL;
const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'X-API-KEY': '6EYB3EZ-6JD4Y60-PM5SHWP-BECR3SE' }
};

var data;

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        performSearch(query);
    }
});

async function performSearch(query) {
    API_URL = `https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=5&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function searchById(id) {
    API_URL = `https://api.kinopoisk.dev/v1.4/movie/${encodeURIComponent(id)}`;
    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data);
        UpdateMovieCard(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function CreateMovieElement(movie) {
    const div = document.createElement('div');
    let movie_name = movie.name.length > 40 ? movie.name.slice(0, 40) + '...' : movie.name;
    let poster_url = movie.poster.url != null ? movie.poster.url : "../static/zaglushka.png";
    let age_rating = movie.ageRating != null ? movie.ageRating + '+' : '';
    let imdb_rating = movie.rating.imdb != '0' ? movie.rating.imdb : 'Нет';
    div.className = 'movie';
    div.id = movie.id; // надо будет поменять
    div.innerHTML = `
        <div class="like_movie_li">
            <div class="movie_photo_li">
                <img src="${poster_url}">
            </div>
            <div class="movie_describe_li">
                <div class="movie_name_li">${movie_name}</div>
                <div class="movie_data_li">${movie.year} ${age_rating}</div>
                <div class="movie_rating_li">
                    <img src="../static/star.png"> ${imdb_rating}
                </div>
            </div>
        </div>
    `;
    return div;
}

document.addEventListener('DOMContentLoaded', function(){
    // Выбираем родительский элемент, например, <ul>
    const list = document.querySelector('.mv_li2');

    list.addEventListener('click', function (event) {
        // Всплываем от цели клика (event.target) вверх по DOM-дереву,
        // чтобы найти ближайшего предка с классом 'like_movie_li'.
        let target = event.target;
        while (target != this) {
            if (target.classList.contains('like_movie_li')) {
                // Сброс фона всех элементов.
                document.querySelectorAll('.like_movie_li').forEach(function (el) {
                    el.style.background = '';
                });
                // Установка фона для целевого элемента.
                target.style.background = 'white';
                // Выходим из цикла, так как нашли нужный элемент.
                break;
            }
            // Перемещаемся к следующему родительскому элементу.
            target = target.parentNode;
        }
        console.log(target);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем родительский элемент, например, <ul>
    const list = document.querySelector('.mv_li2');
    if(list){
        list.addEventListener('click', function(event) {
        let movieElement = event.target.closest('.movie');
        if (movieElement) {
            searchById(movieElement.id);
        }
        })
    }
    else{ console.error("Элемент с классом 'movie' не найден.");}
});

function MovieCard(movie){
    const div = document.createElement('div');
    let poster_url = movie.poster.url != null ? movie.poster.url : "../static/zaglushka.png";
    let country = movie.countries.map(country => country.name).join(', ');
    let genres = movie.genres.map(genre => genre.name).join(', ');
    let directors = movie.persons.filter(i => i.enProfession == 'director'); // режиссеры
    directors = directors.length > 4 ? directors.slice(0, 4) : directors;
    directors = directors.length == 0 ? "Нет" : directors.map(director => director.name).join(', ')
    let scenarists = movie.persons.filter(i => i.enProfession == 'scenarist'); // сценаристы
    scenarists = scenarists.length > 4 ? scenarists.slice(0, 4) : scenarists;
    scenarists = scenarists.length == 0 ? "Нет" : scenarists.map(scenarist => scenarist.name).join(', ')
    let producers = movie.persons.filter(i => i.enProfession == 'producer'); // продюсеры
    producers = producers.length > 4 ? producers.slice(0, 4) : producers;
    producers = producers.length == 0 ? "Нет" : producers.map(producer => producer.name).join(', ')
    let designers = movie.persons.filter(i => i.enProfession == 'designer'); // дизайнеры
    designers = designers.length > 4 ? designers.slice(0, 4) : designers;
    designers = designers.length == 0 ? "Нет" : designers.map(designer => designer.name).join(', ')
    let composers = movie.persons.filter(i => i.enProfession == 'composer'); // композиторы
    composers = composers.length > 4 ? composers.slice(0, 4) : composers;
    composers = composers.length == 0 ? "Нет" : composers.map(composer => composer.name).join(', ')
    div.className = 'MovieCard';
    div.id = `${movie.id}`;
    div.innerHTML = `
            <div class="movie_data">
                <div class="movie_name"><h1>${movie.name}</h1></div>
                <ul class="switch_menu mv_li">
                    <li class="select_option">
                        О фильме
                    </li>
                    <li class="select_option">
                        Рецензии зрителей
                    </li>
                </ul>
                <div class="movie_describe">
                    <div class="movie_text">
                        <div class="movie_element">Год производства <strong class="bl">${movie.year}</strong></div>
                        <div class="movie_element">Страна <strong class="bl">${country}</strong></div>
                        <div class="movie_element">Жанр <strong class="bl">${genres}</strong></div>
                        <div class="movie_element">Режиссер <strong class="bl">${directors}</strong></div> 
                        <div class="movie_element">Сценарий <strong class="bl">${scenarists}</strong></div>
                        <div class="movie_element">Продюсер <strong class="bl">${producers}</strong></div>
                        <div class="movie_element">Художник <strong class="bl">${designers}</strong></div>
                        <div class="movie_element">Композитор <strong class="bl">${composers}</strong></div>
                        <div class="rating_block">
                            <div class="srv_rate">
                                <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                <strong class="rate">${movie.rating.kp != '0' ? movie.rating.kp : "Нет"}</strong>
                            </div>
                            <div class="srv_rate">
                                <img class="logo2" src="../static/jopa.png" >
                                <strong class="rate">${movie.rating.imdb != '0' ? movie.rating.imdb : "Нет"}</strong>
                            </div>
                        </div>
                        <div class="movie_retell">
                            ${movie.description != null ? movie.description : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="movie_panel">
                <div>
                    <img class="movie_photo" src="${poster_url}">
                </div>
                <div class="movie_panel_li">
                    <ul class="mv_li">
                        <li>
                            <div class="movie_panel_btn willwatch">
                                <img class="mv_pnl_btn1" src="../static/heart.png"">
                                <div class="btn_name1">Буду смотреть</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
    `
    return div
}

let newfilm;
function UpdateMovieCard(movie){
    console.log(movie);
    newfilm = movie;
    const MovieCardContent = document.querySelector('.selected_movie');
    MovieCardContent.innerHTML = '' ;
    MovieCardContent.appendChild(MovieCard(movie))
}

function displayResults(data) {
    const resultsList = document.querySelector('.mv_li2');
    resultsList.innerHTML = ''; // Очистка предыдущих результатов

    data.docs.slice(0, 5).forEach(item => { // Убедитесь, что `data.docs` содержит массив объектов
        const movieElement = CreateMovieElement(item);
        resultsList.appendChild(movieElement);
    });
}


//ОШИБКА 500
//отправлка лайкнутого фильма
function fetchUser(Liked){
    fetch('/api/favorites/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Liked),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong with the network response.');
        }
    })
    .then(info => {
        console.log(info);
    })
    .catch(error => {
        console.error('There was an error:', error);
    });
}

//сохраняем новый фильм с поиска
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
      // Проверяем, что элемент имеет класс delete
      if (event.target.closest('.willwatch')) {
        // Ищем фильм с нужным названием sigma в Liked
        console.log(JSON.stringify([newfilm]));
        fetchUser([newfilm]);// удаляю, отправляю фулл элемент удаляемый
        //location.reload() //тип убрал и перезагружаю страницу
      }
    });
});