const url = "http://localhost:8000/api/v1/titles/"
const categories = ['action', 'animation', 'biography']
const topCont = document.getElementById('conteneur');
const categoryCont = document.getElementById('categories');

function getModalContent(movie) {
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
    getMovie(movie.id)
    .then(movie_detail => {
        let movieCard = document.getElementById('card' + movie.id)
        movieCard.innerHTML = (
            '<div class="card">\
                <div>\
                    <img src="' + movie_detail.image_url +'" alt='+ movie.title +'>\
                </div>\
                <div>\
                    <p class="title">'+ movie_detail.title +'</p>\
                    <p>'+ movie_detail.genres +'<p>\
                    <p>Year: '+ movie_detail.year +'</p>\
                    <p>Rating: '+ movie_detail.rated +'</p>\
                    <p>IMDB: '+ movie_detail.imdb_score +'</p>\
                    <p>Directors: '+ movie_detail.directors +'</p>\
                    <p>With: '+ movie_detail.actors +'</p>\
                    <p>Duration: '+ movie_detail.duration +' min.</p>\
                    <p>'+ movie_detail.countries +'</p>\
                    <p>'+ movie_detail.worldwide_gross_income +'</p>\
                    <p>Description: '+ movie_detail.description +'</p>\
                </div>\
            </div>'
        )
    })
}

function topMovieWindow(movie) {
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
            getMovies(nextPage)
            .then(ret => {
                movies = ret[0];
                prevPage = ret[1];
                nextPage = ret[2];
                for (let movie of movies) {
                    cardCont = document.createElement('div')
                    cardCont.classList.add("card-container")
                    cardCont.innerHTML =  (
                        '<button id="modalBtn'+ movie.id +'"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./img/sans-couverture.png\'" alt='+ movie.title +'></button>'
                    )
                    track.appendChild(cardCont)
                    var btn = document.getElementById("modalBtn"+ movie.id);
                    btn.onclick = function() {
                        getModalContent(movie)
                    }
                }
            });
        }
        index = index + 1;
        prev.classList.add("show");
        track.style.transform = "translateX(" + index * -width  + "px)";
        if (nextPage == null) {
            next.classList.add("hide");
        }
        getCarrousel(genre, prevPage, nextPage, index, indexList)
    });
    prev.addEventListener("click", function () {
        index = index - 1;
        next.classList.remove("hide");
        if (index == 0) {
          prev.classList.remove("show");
        }
        track.style.transform = "translateX(" + index * -width + "px)";
        getCarrousel(genre, prevPage, nextPage, index, indexList)
    });
}

async function getMovies(page_url) {
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

async function getTopMovies(page_url) {
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
            return result;
        })
        .catch(function(err) {
            console.log('errorMovies')
        });
}

async function getMovie(movieId) {
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
        carrousel.innerHTML = (
            '<div class="carousel-container">\
                <div class="catTitle">' + cat + '</div>\
                <div class="inner-carousel">\
                    <div class="track"></div>\
                    <div class="nav">\
                        <button class="prev"><i class="fas fa-arrow-left fa-2x"></i></button>\
                        <button class="next"><i class="fas fa-arrow-right fa-2x"></i></button>\
                    </div>\
                </div>\
            </div>'
        )
        const track = document.querySelector('#' + cat + ' .track');
        for (let movie of movies) {
            cardCont = document.createElement('div')
            cardCont.classList.add("card-container")
            cardCont.innerHTML =  (
                '<button id="modalBtn'+ cat + movie.id + '"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'../img/sans-couverture.png\'"></button>'
            )
            track.appendChild(cardCont)
            var btn = document.getElementById("modalBtn"+ cat + movie.id);
            btn.onclick = function() {
                getModalContent(movie)
            }
        }
        getCarrousel(cat, prevPage, nextPage)
    });
}
 
topMovies()

for (let cat of categories) {
    let pageUrl = url + '?genre=' + cat+ '&sort_by=-imdb_score'
    const newCat =  document.createElement("div");
    newCat.setAttribute('id', cat)
    categoryCont.appendChild(newCat);
    let carrousel = document.getElementById(cat);
    carrousel.innerHTML = (
        '<div class="carousel-container">\
            <div class="catTitle">' + cat + '</div>\
            <div class="inner-carousel">\
                <div class="track"></div>\
                <div class="nav">\
                    <button class="prev"><i class="fas fa-arrow-left fa-2x"></i></button>\
                    <button class="next"><i class="fas fa-arrow-right fa-2x"></i></button>\
                </div>\
            </div>\
        </div>'
    )
    const track = document.querySelector('#' + cat + ' .track');
    getMovies(pageUrl)
    .then(ret => {
        let movies = ret[0];
        let prevPage = ret[1];
        let nextPage = ret[2];
        for (let movie of movies) {
            cardCont = document.createElement('div')
            cardCont.classList.add("card-container")
            cardCont.innerHTML =  (
                '<button id="modalBtn' + movie.id + '"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./img/sans-couverture.png\'" alt='+movie.title+'></button>'
            )
            track.appendChild(cardCont)
            var btn = document.getElementById("modalBtn"+ movie.id);
            btn.onclick = function() {
                getModalContent(movie)
            }
        }
        getCarrousel(cat, prevPage, nextPage)
    });
}
