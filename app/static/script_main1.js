
//let API_KEY = '3VYPFA8-H37MAZ9-H0JA9A5-CRAJTFN';  
let API_URL;  
let StrReleaseCountry = '';
let StrReleaseDate = '';
let StrGenreList = '';
let ReleaseYearsStart;
let GenresName;
let CountriesName;
let SortingName = '';


function getUserAPI_URL(){
    fetch('/api/preferences', {
        method: "GET",
    })
    .then(response => response.json())
    .then(info => {
        Destroy = info;
        console.log('adadada');
        console.log(Destroy);
        if (Destroy[2].length >= 1) {
            StrReleaseDate = Destroy[2][0].split(',');
            StrReleaseDate = StrReleaseDate.map(date => date.replace(/\s/g, '').replace("До", "1874-")).join('&releaseYears.start=');
            ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
        }
        else {
            ReleaseYearsStart = "&releaseYears.start=1874-2050";
        }
        if (Destroy[1].length >= 1) {
            StrReleaseCountry = Destroy[1][0].split(',');
            StrReleaseCountry = StrReleaseCountry.join('&countries.name=');
            CountriesName = `&countries.name=${StrReleaseCountry}`;
        }
        else {
            CountriesName = ' ';
        }

        if (Destroy[0].length >= 1) {
            StrReleaseGenre = Destroy[0][0].split(',');
            StrReleaseGenre = StrReleaseGenre.join('&genres.name=');
            GenresName = `&genres.name=${StrReleaseGenre}`;
        }
        else {
            GenresName = ' '
        }
        console.log(GenresName, CountriesName, ReleaseYearsStart);
        
        fetchMovies();
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

getUserAPI_URL(); //Надо будет убрать api_url в
console.log(GenresName, CountriesName, ReleaseYearsStart); 
const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': '6EYB3EZ-6JD4Y60-PM5SHWP-BECR3SE'}
  };

let Liked = []


//получение списка лайков пользователя
function getUserLike(){
    fetch('/api/favorites', {
        method: "GET",
    })
    .then(response => response.json())
    .then(info => {
        // Предполагая, что info - это массив объектов, представляющих понравившиеся фильмы
        Liked = info; // Сохраняем полученные данные в список Liked
        console.log(Liked); // Выводим в консоль список Liked
        if (document.querySelector('.mv_li1')){
            updateUI()}
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
}

//создание html контента по списку liked
function updateUI(){ //Для LikedMovies
    const Liked_MovieContent = document.querySelector('.mv_li1');
    if (Liked_MovieContent && Liked.length > 0) {
        Liked.forEach(movie => {
            let movieElement = CreateMovieElement(movie);
            Liked_MovieContent.append(movieElement);
        });
    }
}


//чтобы не получать лайки 2 раза (это получение в main1)
if (!document.querySelector('.mv_li1')){
    getUserLike();}


//отправка лайкнутого фильма
if (document.querySelector('.Genre')){
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




    let i = 0;
    let j = 1;
    let ImageList;
    let LenOfImageList;
    let countriesList;
    let ageRating;
    let resultString;

    console.log('dvs')
    console.log(GenresName);
    console.log(ReleaseYearsStart);
    console.log(CountriesName);
    //запрос на фильмы
    function fetchMovies(){
        API_URL = `https://api.kinopoisk.dev/v1.4/movie?page=${j}&limit=10&selectFields=name&selectFields=id&selectFields=description&selectFields=shortDescription&selectFields=rating&selectFields=ageRating&selectFields=poster&selectFields=genres&selectFields=countries&selectFields=movieLength&selectFields=releaseYears${ReleaseYearsStart}${GenresName}${CountriesName}`;
        console.log(API_URL)
        console.log(GenresName);
        fetch(API_URL, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                ImageList = response;
                LenOfImageList = ImageList.docs.length; // Указываем длину списка
                i = 0;
                ThroughList(); // Вызываем функцию для обработки списка
            })
            .catch(err => {
                console.error(err);
                console.log(err);
            });
    }


    //прокрутка фильмов
    function ThroughList(){
        if (ImageList.docs.length === 0){
            i = 0; 
            j = 1;
            alert("Фильмы кончились, поменяйте фильтр");
            return;
        }
        if (i > LenOfImageList-1){
            j +=1;
            fetchMovies();
            return;
        }
        if (i === LenOfImageList-1 ){
            if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url){
                image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
                MovieName.textContent = `${ImageList.docs[i].name}`;
                countriesList = ImageList.docs[i].countries.map(country => country.name);
                ageRating = `${ImageList.docs[i].ageRating}+`;
                relYear = `${ImageList.docs[i].releaseYears[0].start}`
                if (ageRating ==='null+'){
                    resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
                }else{
                    resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
                }
                Description.textContent = `${resultString}`;
                Rating.textContent = `${parseFloat(ImageList.docs[i].rating.kp).toFixed(1)}`;
                i += 1;
                console.log(i);
            }else{
                i+=1;
                ThroughList();
            }
            }
        else if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
            image.innerHTML = `<img src=${ImageList.docs[i].poster.url} width="350" height="500" alt="" ></img>`;
            MovieName.textContent = `${ImageList.docs[i].name}`;
            countriesList = ImageList.docs[i].countries.map(country => country.name);
            ageRating = `${ImageList.docs[i].ageRating}+`;
            relYear = `${ImageList.docs[i].releaseYears[0].start}`
            if (ageRating ==='null+'){
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            }else{
                resultString = `${countriesList.slice(0, 2).join(", ")}, ${ageRating}, ${relYear}`;//Обрезается и показывает страны-создатели (иногда без тех, что уазаны в фильтре)
            }
            console.log(countriesList);
            Description.textContent = `${resultString}`;
            Rating.textContent = `${parseFloat(ImageList.docs[i].rating.kp).toFixed(1)}`;
            i = (i + 1) % LenOfImageList;
            console.log(i);
        }else{
            for (i; i<= LenOfImageList-1; i++){
                if (ImageList.docs[i] && ImageList.docs[i].poster && ImageList.docs[i].poster.url) {
                    ThroughList()
                    break;
                }
            }
        }
    }


    //запрос на фильмы, чтобы с самого начала что-то было
    fetchMovies();


    const image = document.querySelector('.Tinder');
    const MovieName = document.querySelector('.MovieName');
    const Description = document.querySelector('.Description');
    const Rating = document.querySelector('.Rating');

    //Нажатие на сердечко
    let Like = document.querySelector('.Heart2');
    Like.addEventListener('click', () =>{
        if (!Liked.some(item => item.name === ImageList.docs[i-1].name)) {
            Liked.push(ImageList.docs[i-1]);
            console.log(JSON.stringify([Liked[Liked.length-1]]));
            fetchUser([Liked[Liked.length-1]]);
        }
    })
    Like.addEventListener('click', ThroughList);

    //нажатие на крестик
    let Skip = document.querySelector('.Cross');
    Skip.addEventListener('click', ThroughList);

    //нажатие на закладку
    let Mark = document.querySelector('.Add');
    let Marked = []
    Mark.addEventListener('click', () =>{
        if (!Marked.some(item => item.name === ImageList.docs[i-1].name)) {
            Marked.push(ImageList.docs[i-1]);
            console.log(JSON.stringify(Marked));
        }
    })
    Mark.addEventListener('click', ThroughList);



    //Это надо для recomendation.html

    //выбор фильмов по дате выхода
    let ReleaseDate = [];
    let DateList = document.querySelectorAll('.ReleaseDate')

    DateList.forEach(function(Date) {
        Date.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            let content = event.target.textContent;
            let index = ReleaseDate.indexOf(content);
            if (index !== -1) {
                ReleaseDate.splice(index, 1);
                event.target.style.background = '#f5f5f5';
            } else {
                ReleaseDate.push(content);
                event.target.style.background = '#ffee58';
            }
            console.log(ReleaseDate);
            StrReleaseDate = ReleaseDate.map(date => date.replace(/\s/g, '').replace("До", "1874-")).join('&releaseYears.start=');
            if (StrReleaseDate !== ''){
                ReleaseYearsStart = `&releaseYears.start=${StrReleaseDate}`;
            }else{
                ReleaseYearsStart = '&releaseYears.start=1874-2050';
            }
            fetchMovies(); //это в recomendation.html не надо
            console.log(ReleaseYearsStart);
            console.log(API_URL);
            event.preventDefault();
        }
    });
    });


    //выбор фильмов по стране выхода
    let ReleaseCountry = [];
    let CountryList = document.querySelectorAll('.Country')

    CountryList.forEach(function(Country) {
        Country.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            let content = event.target.textContent;
            let index = ReleaseCountry.indexOf(content);
            if (index !== -1) {
                ReleaseCountry.splice(index, 1);
                event.target.style.background = '#f5f5f5';
            } else {
                ReleaseCountry.push(content);
                event.target.style.background = '#ffee58';
            }
            console.log(ReleaseCountry);
            StrReleaseCountry = ReleaseCountry.join('&countries.name=');
            if (StrReleaseCountry !== ''){
                CountriesName = `&countries.name=${StrReleaseCountry}`;
            }else{
                CountriesName = '';
            }
            fetchMovies(); //это в recomendation.html не надо
            console.log(CountriesName);
            console.log(API_URL);
            event.preventDefault();
        }
    });
    });


    //выбор фильмов по жанру
    let ReleaseGenre = [];
    let GenreList = document.querySelectorAll('.Genre')

    GenreList.forEach(function(Genre) {
        Genre.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            let content = event.target.textContent;
            let index = ReleaseGenre.indexOf(content);
            if (index !== -1) {
                ReleaseGenre.splice(index, 1);
                event.target.style.background = '#f5f5f5';
            } else {
                ReleaseGenre.push(content);
                event.target.style.background = '#ffee58';
            }

            console.log(ReleaseGenre);
            StrReleaseGenre = ReleaseGenre.join('&genres.name=');
            if (StrReleaseGenre !== ''){
                GenresName = `&genres.name=${StrReleaseGenre}`;
            }else{
                GenresName = ``;
            }
            fetchMovies(); //это в recomendation.html не надо
            console.log(GenresName);
            console.log(API_URL);
            event.preventDefault();
        }
    });
    });
}
//дальше в recomendation.html не надо




//other html
if (document.querySelector('.mv_li1')){
    getUserLike();
    function CreateMovieElement(movie){
        const div = document.createElement('div');
        let movie_name = movie.name.length > 40 ? movie.name.slice(0, 40) + '...' : movie.name;
        let poster_url = movie.posterUrl != null ? movie.posterUrl : "../static/zaglushka.png";
        let age_rating = movie.ageRating != null ? movie.ageRating + '+' : '';
        let imdb_rating = movie.imdb_rating != '0' ? movie.imdb_rating : 'Нет';
        div.className = 'movie';
        //div.id = movie-${movie.id}; надо будет добавить id
        div.id = `${movie.name}`;//надо будет поменять
        div.innerHTML = `
            <div class="like_movie_li">
                <div class="movie_photo_li">
                    <img src="${poster_url}">
                </div>
                <div class="movie_describe_li">
                    <div class="movie_name_li">${movie_name}</div>
                    <div class="movie_data_li">${movie.releaseStart} ${age_rating}</div>
                    <div class="movie_rating_li">
                        <img src="../static/star.png"> ${imdb_rating}
                    </div>
                </div>
            </div>
    `/*<div class="movie_data_li">${movie.releaseStart} ${movie.movieLength} ${movie.ageRating}</div>*/
        return div
    }
    function MovieCard(movie){
        console.log('ss');
        console.log(movie.name);
        const div = document.createElement('div');
        div.className = 'MovieCard';
        div.id = `${movie.name}`;
        countriesList = movie.countries;
        //нужно добавить актеров и прочих челиков, imdb rating анрил
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
                                <div class="movie_element">Год производства <strong class="bl">${movie.releaseStart}</strong></div>
                                <div class="movie_element">Страна <strong class="bl">${countriesList}</strong></div>
                                <div class="movie_element">Жанр <strong class="bl">${movie.genres}</strong></div>
                                <div class="movie_element">Режиссер <strong class="bl">Николас Виндинг Рефн</strong></div> 
                                <div class="movie_element">Сценарий <strong class="bl">Хуссейн Амини, Джеймс Саллис</strong></div>
                                <div class="movie_element">Продюсер <strong class="bl">Мишель Литвак, Джон Палермо, Марк Э. Платт</strong></div>
                                <div class="movie_element">Художник <strong class="bl">Бет Микл, Кристофер Тандон, Эрин Бенач</strong></div>
                                <div class="movie_element">Композитор <strong class="bl">Клифф Мартинес</strong></div>
                                <div class="rating_block">
                                    <div class="srv_rate">
                                        <img class="logo1" src="../static/kinopoisk-icon-main.png">
                                        <strong class="rate">${movie.kp_rating}</strong>
                                    </div>
                                    <div class="srv_rate">
                                        <img class="logo2" src="../static/jopa.png" >
                                        <strong class="rate">${movie.imdb_rating}</strong>
                                    </div>
                                </div>
                                <div class="movie_retell">
                                    ${movie.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="movie_panel">
                        <div>
                            <img class="movie_photo" src="${movie.posterUrl}">
                        </div>
                        <div class="movie_panel_li">
                            <ul class="mv_li">
                                <li>
                                    <div class="movie_panel_btn delete">
                                        <img class="mv_pnl_btn" src="../static/broken_heart.png"">
                                        <div class="btn_name">Убрать из списка</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="movie_panel_btn ratte">
                                        <img class="mv_pnl_btn" src="../static/star.png" }}">
                                        <div class="btn_name" id="open-modal-btn">Оценить</div>
                                    </div>
                                    <div class="modal" id="my-modal">
                                        <div class="modal_box">
                                            <button type="button" class="modal_close_btn" id="close-my-modal-btn">
                                                <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.09082 0.03125L22.9999 22.0294L20.909 24.2292L-8.73579e-05 2.23106L2.09082 0.03125Z" fill="#333333"></path>
                                                    <path d="M0 22.0295L20.9091 0.0314368L23 2.23125L2.09091 24.2294L0 22.0295Z" fill="#333333"></path>
                                                </svg>
                                            </button>
                                            <div class="rate2">
                                                <img src="../static/star.png" width='50' height="50">
                                                <p class="bad">1</p>
                                                <p class="bad">2</p>
                                                <p class="bad">3</p>
                                                <p class="bad">4</p>
                                                <p class="okay">5</p>
                                                <p class="okay">6</p>
                                                <p class="good">7</p>
                                                <p class="good">8</p>
                                                <p class="good">9</p>
                                                <p class="good">10</p>
                                            </div>
                                            <div class="send">
                                                <p>Сохранить</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
        `
        return div
    }
    let sigma;  //хранение текущего названия фильма
    function UpdateMovieCard(id){
        const MovieCardContent = document.querySelector('.selected_movie');
        movie = Liked[id];
        sigma = movie.id;
        getfilmark(sigma);
        console.log('eshkere')
        console.log(Liked[id])
        MovieCardContent.innerHTML = '' ;
        MovieCardContent.appendChild(MovieCard(movie))
    }

    //нажатие на фильм
    document.addEventListener('DOMContentLoaded', function() {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');
    
        list.addEventListener('click', function(event) {
            // Всплываем от цели клика (event.target) вверх по DOM-дереву,
            // чтобы найти ближайшего предка с классом 'like_movie_li'.
            let target = event.target;
            while (target != this) {
                if (target.classList.contains('like_movie_li')) {
                    // Сброс фона всех элементов.
                    document.querySelectorAll('.like_movie_li').forEach(function(el) {
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
        });
    });
    let index;

    //меняем карточку
    document.addEventListener('DOMContentLoaded', function() {
        // Выбираем родительский элемент, например, <ul>
        const list = document.querySelector('.mv_li1');
        if(list){
            list.addEventListener('click', function(event) {
            let movieElement = event.target.closest('.movie');
            if (movieElement) {
                let movieId = movieElement.id;
                console.log('Нажат фильм с ID:', movieId);
                for (let i = 0; i < Liked.length; i++) {
                    if (`${Liked[i].name}` === movieId) { // Убеждаемся, что используем строки для сравнения
                        UpdateMovieCard(i); // Передаем индекс найденного элемента
                        break;
                    }
                }
            }
            })
        }
        else{ console.error("Элемент с классом 'movie' не найден.");}
    });
    
    //дальше меню на карточке фильма

    //получение внутрисайтовой оценки не надо она будет в списке Liked
    function getfilmark(sigma){
        fetch(`/api/rate/${sigma}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(info => {
            InnerRating = info; 
            console.log(InnerRating); 
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
    }
    getfilmark();
    //оценка

    //Добавка класса Open
    document.addEventListener('DOMContentLoaded', function(){
        document.body.addEventListener("click", function(event){
            if(event.target && event.target.id === "open-modal-btn"){
                var modal = document.getElementById("my-modal");
                if (modal) {
                    modal.classList.add("open");
                    star = 11; //Отслеживаем открытие модального окна
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modal" not found.');
                }
            }
        });
    })
    //убираем класс Open
    document.addEventListener('DOMContentLoaded', function(){
        document.body.addEventListener("click", function(event){
            let closeButton = event.target.closest("#close-my-modal-btn");
            if(closeButton){
                var modal = document.getElementById("my-modal");
                if (modal) {
                    modal.classList.remove("open");
                    console.log('eshkere2')
                } else {
                    console.error('Element with id "my-modal" not found.');
                }
            }
        });
    })
    //отправка на серв по клику
    document.addEventListener('DOMContentLoaded', function(){
        document.body.addEventListener("click", function(event){
            let closeButton = event.target.closest(".send");
            if(closeButton && star !== 11){
                Rate(star, sigma);
                console.log('success');
            }else if(closeButton && star ===11){
                alert('поставьте оценку фильму');
            }
        });
    })

    
    //нажатие на число оценки
    let star; 
    document.addEventListener('DOMContentLoaded', function() {
        let selected;
        function resetColors() {
            document.querySelectorAll('.rate2 p').forEach(function(p) {
                p.style.color = ''; // Сброс цвета текста
            });
        }
        document.body.addEventListener('click', function(e) {
            // чекаем, что элемент на который нажали это тег p в .rate2
            if (e.target && e.target.nodeName === 'P' && e.target.closest('.rate2')) {
                resetColors();
                star = e.target.textContent; 
                selected = e.target;
                if (['1', '2', '3', '4'].includes(star)) {
                    selected.style.color = 'red';
                } else if (['5', '6'].includes(star)) {
                    selected.style.color = 'brown';
                } else if (['7', '8', '9', '10'].includes(star)) {
                    selected.style.color = 'green';
                }
                console.log(star);  
                console.log(sigma);  
            }
        });
    });

    //запрос на отправку фильма и оценки пользователя нужен будет адрес (отправка оценки и названия фильма)
    function Rate(star, sigma){
        fetch('/api/rate/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: sigma, rate: star }),
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
            console.log(JSON.stringify({ name: sigma, rate: star }));
        })
        .catch(error => {
            console.error('There was an error:', error);
        });
    }

    //удаление у пользователя 
    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('click', function(event) {
          // Проверяем, что элемент имеет класс delete
          if (event.target.closest('.delete')) {
            // Ищем фильм с нужным названием sigma в Liked
            console.log(sigma)
            let index = Liked.findIndex(function(item) {
                return item.id === sigma;
              });
            fetchUserDel(Liked[index]);// удаляю, отправляю фулл элемент удаляемый
            console.log(index); 
            Liked = Liked.filter(function(item) {
                return item.id !== sigma;
              });
          }
        });
      });

    //запрос на удаление (нужно будет попросить поменять ссылку)
    function fetchUserDel(movie){
        fetch('/api/favorites/delete', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: movie.id }),
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
            location.reload();
        })
        .catch(error => {
            console.error('There was an error:', error);
        });
    }

}