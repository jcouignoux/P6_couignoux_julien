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
    modal.innerHTML = (
        '<div class="modal-content">\
            <span id="close'+ movie.id +'" class="close">&times;</span>\
            <div id=card'+ movie.id +'></div>\
        </div>'
    )
    displayMovieCard(movie)
    var span = document.getElementById("close"+ movie.id);
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
        let movieCard = document.getElementById('card' + movie.id)
        let div1 = document.createElement('div')
        let card = document.createElement('div')
        card.classList.add('card')
        let img = document.createElement('img')
        img.setAttribute('src', movie_detail.image_url)
        img.setAttribute('alt', movie.title)
        div1.appendChild(img)
        card.appendChild(div1)
        let div2 = document.createElement('div')
        div2.innerHTML = (
            '<p class="title">'+ movie_detail.title +'</p>\
            <p>'+ movie_detail.genres +'<p>\
            <p>Year: '+ movie_detail.year +'</p>\
            <p>Rating: '+ movie_detail.rated +'</p>\
            <p>IMDB: '+ movie_detail.imdb_score +'</p>\
            <p>Directors: '+ movie_detail.directors +'</p>\
            <p>With: '+ movie_detail.actors +'</p>\
            <p>Duration: '+ movie_detail.duration +' min.</p>\
            <p>'+ movie_detail.countries +'</p>\
            <p>'+ movie_detail.worldwide_gross_income +'</p>\
            <p>Description: '+ movie_detail.description +'</p>'
        )
        card.appendChild(div2)
        movieCard.appendChild(card)
    })
}

function topMovieWindow(movie) {
    // display Best Movie content
    let topMovie = document.getElementById('topMovie');
    getMovie(movie.id)
    .then(movieDetail => {
        topMovie.innerHTML = (
            '<div class="topCard-container">\
                <div>\
                    <p class="catTitle">Best Movie<p>\
                </div>\
                <button id="modalBtntopMovie' + movieDetail.id + '">\
                    <div class="topCard">\
                        <div>\
                            <img src="' + movieDetail.image_url +'">\
                        </div>\
                        <div>\
                            <p class="title">'+ movieDetail.title +'<p>\
                            <p>Resume: '+ movieDetail.description +'<p>\
                        </div>\
                    </div>\
                </button>\
            </div>'
        )
        var btn = document.getElementById("modalBtntopMovie" + movie.id);
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
                    // cardCont.innerHTML =  (
                    //     '<button id="modalBtn'+ movie.id +'"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./img/sans-couverture.png\'" alt='+ movie.title +'></button>'
                    // )
                    track.appendChild(cardCont)
                    // var btn = document.getElementById("modalBtn"+ movie.id);
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
