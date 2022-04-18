// import { movie } from './models';
// const movie = require('./model/movie')
const url = "http://localhost:8000/api/v1/titles/"
const categories = ['action', 'animation', 'biography']
const categoryCont = document.getElementById('categories');

function getModalContent(movie) {
    let conteneur = document.getElementById('conteneur')
    let modal = document.createElement('div')
    conteneur.appendChild(modal)
    modal.setAttribute('id', 'myModal'+ movie.id)
    modal.classList.add('modal')
    modal.innerHTML = (
        '<div class="modal-content">\
            <span id="close'+ movie.id +'" class="close">&times;</span>\
            <div id=card' + movie.id + '></div>\
        </div>'
    )
    displayMovieCard(movie)
    console.log(modal)
    // var btn = document.getElementById("modalBtn"+ movie.id);
    var span = document.getElementById("close"+ movie.id);
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        // modal.remove();
        conteneur.removeChild(modal)
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
                <img src="' + movie_detail.image_url +'" alt="John" style="width:100%">\
                </div>\
                <div>\
                <p class="title">'+ movie_detail.title +'</p>\
                <p>'+ movie_detail.genres +'<p>\
                <h2>'+ movie_detail.year +'</h2>\
                <h2>'+ movie_detail.rated +'</h2>\
                <h2>'+ movie_detail.imdb_score +'</h2>\
                <h4>'+ movie_detail.directors +'</h4>\
                <h4>'+ movie_detail.actors +'</h4>\
                <h4>'+ movie_detail.duration +'</h4>\
                <h4>'+ movie_detail.countries +'</h4>\
                <h4>'+ movie_detail.worldwide_gross_income +'</h4>\
                <h4>'+ movie_detail.description +'</h4>\
                </div>\
            </div>'
        )
    })
}

function topMovieWindow(movie) {
    let topMovie = document.getElementById('topMovie');
    topMovie.innerHTML = (
        '<div class="card">\
            <div>\
                <img src="' + movie.image_url +'">\
            </div>\
            <div>\
                <h1>'+ movie.title +'</h1>\
                <p class="title">'+ movie.imdb_score +'</p>\
                <p><button id="modalBtn' + movie.id + '">Voir</button></p>\
            </div>\
        </div>'
    )
    var btn = document.getElementById("modalBtn"+ movie.id);
    btn.onclick = function() {
        getModalContent(movie)
    }
}

function getCarrousel(genre, prevPage, nextPage, index=0, indexList=[]) {
    const track = document.querySelector('#' + genre + ' .track');
    const prev = document.querySelector('#' + genre + ' .prev');
    const next = document.querySelector('#' + genre + ' .next');
    let carousel = document.querySelector('#' + genre + ' .carousel-container');
    let width = carousel.offsetWidth;
    // if (!(index in indexList)) {
    //     indexList.push(index)
    // };
    console.log(indexList)
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
                        '<button id="modalBtn' + movie.id + '"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./sans-couverture.png\'"></button>'
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
        // if (track.offsetWidth - index * width < index * width) {
        //   next.classList.add("hide");
        // }
        if (nextPage == null) {
          next.classList.add("hide");
        }
        getCarrousel(genre, prevPage, nextPage, index, indexList)
    });
    prev.addEventListener("click", function () {
        index = index - 1;
        console.log(index)
        next.classList.remove("hide");
        if (index === 0) {
          prev.classList.remove("show");
        }
        // console.log(prevPage)
        // if (prevPage == 'null') {
        //   next.classList.add("hide");
        // }
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
            console.log
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

function topMovie() {
    page_url = url + '?sort_by=-imdb_score'
    getTopMovies(page_url)
    .then(ret => {
        let movie = ret[0]
        topMovieWindow(movie)
    });
}
 
topMovie()

for (let cat of categories) {
    pageUrl = url + '?genre=' + cat // + '?sort_by=-imdb_score'
    const newCat =  document.createElement("div");
    newCat.setAttribute('id', cat)
    categoryCont.appendChild(newCat);
    let carrousel = document.getElementById(cat);
    carrousel.innerHTML = (
        '<div class="carousel-container">\
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
        movies = ret[0];
        prevPage = ret[1];
        nextPage = ret[2];
        for (let movie of movies) {
            cardCont = document.createElement('div')
            cardCont.classList.add("card-container")
            cardCont.innerHTML =  (
                '<button id="modalBtn' + movie.id + '"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./sans-couverture.png\'"></button>'
            )
            track.appendChild(cardCont)
            var btn = document.getElementById("modalBtn"+ movie.id);
            btn.onclick = function() {
                getModalContent(movie)
            }
        }
        getCarrousel(cat, prevPage, nextPage)
    });
    // getCarrousel(cat, pageUrl, prevPage, nextPage)
    // getMovies(page_url)
    //     .then(ret => {
    //         let movies = ret[0];
    //         let prev = ret[1];
    //         let next = ret[2];
    //         const newCat =  document.createElement("div");
    //         newCat.setAttribute('id', cat)
    //         categoryCont.appendChild(newCat);
    //         carrousel(cat, movies, prev, next)
    // });
}
