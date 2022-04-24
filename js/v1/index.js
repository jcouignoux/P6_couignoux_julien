const url = "http://localhost:8000/api/v1/titles/"
const categories = ['action', 'animation', 'biography']
const topCont = document.getElementById('conteneur');
const categoryCont = document.getElementById('categories');

function getModalContent(movie) {
    // display modal
    let conteneur = document.getElementById('conteneur')
    let modal = document.createElement('div')
    conteneur.appendChild(modal)
    modal.setAttribute('id', 'myModal'+ movie.genre + movie.id)
    modal.classList.add('modal')
    let content = document.createElement('div')
    content.classList.add('modal-content')
    let span = document.createElement('span')
    span.setAttribute('id', 'close'+ movie.id)
    span.classList.add('close')
    span.innerHTML = '&times;'
    let card = document.createElement('div')
    card.setAttribute('id', 'card'+ movie.id)
    content.appendChild(span)
    content.appendChild(card)
    modal.appendChild(content)
    displayMovieCard(movie)
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        modal.remove();
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
          modal.remove();
        }
      }
}

function displayMovieCard(movie) {
    // display modal content
    getMovie(movie.id)
    .then(movie_detail => {
        let movieCard = document.getElementById('card' + movie.id);
        let div1 = document.createElement('div');
        let card = document.createElement('div');
        card.classList.add('card');
        let img = document.createElement('img');
        img.setAttribute('src', movie_detail.image_url);
        img.setAttribute('alt', movie.title);
        div1.appendChild(img);
        card.appendChild(div1);
        let div2 = document.createElement('div');
        let table = document.createElement('table');
        let title = document.createElement('p')
        title.classList.add('title');
        title.innerHTML = movie_detail.title;
        div2.appendChild(title);
        const data = {
            'Genres': movie_detail.genres,
            'Year': movie_detail.year,
            'Rated': movie_detail.rated,
            'IMDB': movie_detail.imdb_score,
            'Directors': movie_detail.directors,
            'Actors': movie_detail.actors,
            'Duration': movie_detail.duration,
            'Country': movie_detail.countries,
            'Box Office': movie_detail.worldwide_gross_income,
            'Resume': movie_detail.description
        }
        for (let line in data) {
                console.log(data);
                let row = table.insertRow(-1);
                let col = row.insertCell(0)
                col.innerHTML = `${line}`
                col = row.insertCell(1)
                col.innerHTML = `${data[line]}`
                table.appendChild
        }
        div2.appendChild(table)
        card.appendChild(div2)
        movieCard.appendChild(card)
    })
}

function topMovieWindow(movie) {
    // display Best Movie content
    let topMovie = document.getElementById('topMovie');
    getMovie(movie.id)
    .then(movieDetail => {
        let container = document.createElement('div');
        container.classList.add('topCard-container');
        let div1 = document.createElement('div');
        let catTitle = document.createElement('p');
        catTitle.classList.add('catTitle');
        catTitle.innerHTML = 'Best Movie';
        div1.appendChild(catTitle);
        let btn = document.createElement('button');
        btn.setAttribute('id', 'modalBtntopMovie'+ movieDetail.id);
        let topCard = document.createElement('div');
        topCard.classList.add('topCard');
        let div2 = document.createElement('div');
        let img = document.createElement('img');
        img.setAttribute('src', movieDetail.image_url);
        img.setAttribute('alt', movieDetail.title);
        div2.appendChild(img)
        let div3 = document.createElement('div');
        let title = document.createElement('p')
        title.classList.add('title')
        title.innerHTML = movieDetail.title
        let p = document.createElement('p')
        p.innerHTML = ('Resume: '+ movieDetail.description)
        div3.appendChild(title)
        div3.appendChild(p)
        topCard.appendChild(div2)
        topCard.appendChild(div3)
        btn.appendChild(topCard)
        container.appendChild(div1)
        container.appendChild(btn)
        topMovie.append(container)
        btn.onclick = function() {
            getModalContent(movie)
        }
    })
}

function getCarrousel(genre, prevPage, nextPage, index=0, indexList=[]) {
    // display carrousel content
    const track = document.querySelector('#' + genre + ' .track');
    const prev = document.querySelector('#' + genre + ' .prev');
    const next = document.querySelector('#' + genre + ' .next');
    let carousel = document.querySelector('#' + genre + ' .carousel-container');
    let width = carousel.offsetWidth;
    window.addEventListener("resize", function () {
      width = carousel.offsetWidth;
    });
    next.addEventListener("click", function (e) {
        e.preventDefault();
        if (!(index in indexList)) {
            indexList.push(index)
            // get next movies if needed
            getMovies(nextPage)
            .then(ret => {
                movies = ret[0];
                prevPage = ret[1];
                nextPage = ret[2];
                selectedMovies = movies.slice(0, 2)
                for (let movie of selectedMovies) {
                    cardCont = document.createElement('div')
                    cardCont.classList.add("card-container")
                    let btn = document.createElement('button')
                    btn.setAttribute('id', 'modalBtn'+ movie.id)
                    let img = document.createElement('img')
                    img.setAttribute('src', movie.image_url)
                    img.setAttribute('alt', movie.title)
                    btn.appendChild(img)
                    cardCont.appendChild(btn)
                    track.appendChild(cardCont)
                    btn.onclick = function() {
                        getModalContent(movie)
                    }
                }
            });
        }
        index = index + 1;
        prev.classList.add("show");
        track.style.transform = "translateX(" + index * -width *2 /5 + "px)";
        if (index == 1) {
        // if (nextPage == null) {
            next.classList.add("hide");
        }
        getCarrousel(genre, prevPage, nextPage, index, indexList);
    });
    prev.addEventListener("click", function () {
        index = index - 1;
        next.classList.remove("hide");
        if (index == 0) {
          prev.classList.remove("show");
        }
        track.style.transform = "translateX(" + index * -width *2 /5 + "px)";
        getCarrousel(genre, prevPage, nextPage, index, indexList);
    });
}

async function getMovies(page_url) {
    // get movies with url
    return res = await fetch(page_url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            let result = value.results;
            let prev = value.previous;
            let next = value.next;
            return [result, prev, next];
        })
        .catch(function(err) {
            console.log('errorMovies')
        });
}

async function getMovie(movieId) {
    // get movie detail with id
    return res = await fetch(url + movieId)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            return value;
        })
        .catch(function(err) {
            console.log('errorMovie')
        });
}

function topMovies() {
    // get top movies and display the best movie
    // and a carrousel with sorted best movies
    page_url = url + '?sort_by=-imdb_score'
    getMovies(page_url)
    .then(ret => {
        let movies = ret[0];
        let prevPage = ret[1];
        let nextPage = ret[2];
        let topMovie = movies[0];
        topMovieWindow(topMovie);
        let cat = 'topMovies';
        const topMovies = document.querySelector('#' + cat);
        const newCat =  document.createElement("div");
        newCat.setAttribute('id', cat)
        topMovies.appendChild(newCat);
        let carrousel = document.getElementById(cat);
        let container = document.createElement('div')
        container.classList.add('carousel-container')
        let catTitle = document.createElement('div')
        catTitle.classList.add('catTitle')
        catTitle.innerHTML = (cat)
        let inner = document.createElement('div')
        inner.classList.add('inner-carousel')
        let track = document.createElement('div')
        track.classList.add('track')
        let nav = document.createElement('div')
        nav.classList.add('nav')
        let prevBtn = document.createElement('button')
        prevBtn.classList.add('prev')
        prevBtn.innerHTML = ('<')
        let nextBtn = document.createElement('button')
        nextBtn.classList.add('next')
        nextBtn.innerHTML = ('>')
        nav.appendChild(prevBtn)
        nav.appendChild(nextBtn)
        inner.appendChild(track)
        inner.appendChild(nav)
        container.appendChild(catTitle)
        container.appendChild(inner)
        carrousel.appendChild(container)
        for (let movie of movies) {
            cardCont = document.createElement('div')
            cardCont.classList.add("card-container")
            let btn = document.createElement('button')
            btn.setAttribute('id', 'modalBtn'+ cat + movie.id)
            let img = document.createElement('img')
            img.setAttribute('src', movie.image_url)
            img.setAttribute('alt', movie.title)
            img.setAttribute('onerror', "this.onerror=null; this.src=\'../img/sans-couverture.png\'")
            btn.appendChild(img)
            cardCont.appendChild(btn)
            track.appendChild(cardCont)
            btn.onclick = function() {
                getModalContent(movie)
            }
        }
        getCarrousel(cat, prevPage, nextPage)
    });
}


// MAIN
// Display Best movies
topMovies()


// Display a carrousel per category
for (let cat of categories) {
    let pageUrl = url + '?genre=' + cat + '&sort_by=-imdb_score'
    const newCat =  document.createElement("div");
    newCat.setAttribute('id', cat)
    categoryCont.appendChild(newCat);
    let carrousel = document.getElementById(cat);
    let container = document.createElement('div')
    container.classList.add('carousel-container')
    let catTitle = document.createElement('div')
    catTitle.classList.add('catTitle')
    catTitle.innerHTML = (cat)
    let inner = document.createElement('div')
    inner.classList.add('inner-carousel')
    let track = document.createElement('div')
    track.classList.add('track')
    let nav = document.createElement('div')
    nav.classList.add('nav')
    let prevBtn = document.createElement('button')
    prevBtn.classList.add('prev')
    prevBtn.innerHTML = ('<')
    let nextBtn = document.createElement('button')
    nextBtn.classList.add('next')
    nextBtn.innerHTML = ('>')
    nav.appendChild(prevBtn)
    nav.appendChild(nextBtn)
    inner.appendChild(track)
    inner.appendChild(nav)
    container.appendChild(catTitle)
    container.appendChild(inner)
    carrousel.appendChild(container)
    getMovies(pageUrl)
    .then(ret => {
        let movies = ret[0];
        let prevPage = ret[1];
        let nextPage = ret[2];
        for (let movie of movies) {
            cardCont = document.createElement('div')
            cardCont.classList.add("card-container")
            let btn = document.createElement('button')
            btn.setAttribute('id', 'modalBtn' + movie.id)
            let img = document.createElement('img')
            img.setAttribute('src', movie.image_url)
            img.setAttribute('alt', movie.title)
            img.setAttribute('onerror', "this.onerror=null; this.src=\'../img/sans-couverture.png\'")
            btn.appendChild(img)
            cardCont.appendChild(btn)
            track.appendChild(cardCont)
            btn = document.getElementById("modalBtn"+ movie.id);
            btn.onclick = function() {
                getModalContent(movie)
            }
        }
        getCarrousel(cat, prevPage, nextPage)
    });
}
