let ReleaseYearsStart='&releaseYears.start=1874-2050';
let GenresName = '';
let CountriesName = '';
localStorage.setItem('Countries', CountriesName);
localStorage.setItem('Years', ReleaseYearsStart);
localStorage.setItem('Genres', GenresName);


let ReleaseDate = [];
let StrReleaseDate = '';
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
        localStorage.setItem('Years', ReleaseYearsStart);
        console.log(ReleaseYearsStart);
        console.log(API_URL);
        event.preventDefault();
    }
});
});


//выбор фильмов по стране выхода
let ReleaseCountry = [];
let StrReleaseCountry = '';
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
        localStorage.setItem('Countries', CountriesName);
        console.log(CountriesName);
        console.log(API_URL);
        event.preventDefault();
    }
});
});


//выбор фильмов по жанру
let ReleaseGenre = [];
let StrGenreList = '';
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
        localStorage.setItem('Genres', GenresName);
        console.log(GenresName);
        console.log(API_URL);
        event.preventDefault();
    }
});
});


document.querySelector('.save').addEventListener('click', function(event) {
    event.preventDefault();
    const url = event.currentTarget.closest('.save-link').getAttribute('href');
    let j = 1;
    // Предполагаем, что api_url - это URL сервера для отправки POST запроса
    const api_url = `https://api.kinopoisk.dev/v1.4/movie?page=${j}&limit=10&selectFields=name&selectFields=id&selectFields=persons&selectFields=description&selectFields=shortDescription&selectFields=rating&selectFields=ageRating&selectFields=poster&selectFields=genres&selectFields=countries&selectFields=movieLength&selectFields=releaseYears${ReleaseYearsStart}${GenresName}${CountriesName}`;

    fetch('/api/preferences/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: api_url}),
    }).then(response => {
      if (response.ok) {
        window.location.href = url;
        return response.json();
      }
      throw new Error('Server responded with an error.');
    }).catch(error => {
      console.error('Error:', error);
    });
    event.reventDefault();
  }); 