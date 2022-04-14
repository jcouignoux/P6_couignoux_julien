// import { movie } from './models';
// const movie = require('./model/movie')
const url = "http://localhost:8000/api/v1/titles/"
const categories = ['Action', 'Animation', 'Biography']
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
                <h2>'+ movie_detail.genres +'</h2>\
                <h2>'+ movie_detail.year +'</h2>\
                <h2>'+ movie_detail.rated +'</h2>\
                <h2>'+ movie_detail.imdb_score +'</h2>\
                <h4>'+ movie_detail.writers +'</h4>\
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

function carrousel(genre, movies) {
    let carrousel = document.getElementById(genre);
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
    const track = document.querySelector('#' + genre + ' .track');
    // console.log(movies)
    for (let movie of movies) {
        cardCont = document.createElement('div')
        cardCont.classList.add("card-container")
        cardCont.innerHTML =  (
                '<p><button id="modalBtn' + movie.id + '"><img src='+ movie.image_url +' onerror="this.onerror=null; this.src=\'./sans-couverture.png\'"></button></p>'
        )
        track.appendChild(cardCont)
        var btn = document.getElementById("modalBtn"+ movie.id);
        btn.onclick = function() {
            getModalContent(movie)
        }
    }
    sel = ('#' + genre + ' .prev')
    const prev = document.querySelector('#' + genre + ' .prev');
    const next = document.querySelector('#' + genre + ' .next');
    const carousel = document.querySelector('#' + genre + ' .carousel-container');
    // const track = document.querySelector('#' + genre + ' .track');
    let width = carousel.offsetWidth;
    let index = 0;
    window.addEventListener("resize", function () {
      width = carousel.offsetWidth;
    });
    next.addEventListener("click", function (e) {
      e.preventDefault();
      index = index + 1;
      prev.classList.add("show");
      track.style.transform = "translateX(" + index * -width  + "px)";
      if (track.offsetWidth - index * width < index * width) {
        next.classList.add("hide");
      }
    });
    prev.addEventListener("click", function () {
      index = index - 1;
      next.classList.remove("hide");
      if (index === 0) {
        prev.classList.remove("show");
      }
      track.style.transform = "translateX(" + index * -width + "px)";
    });
}

async function getMovies(filter) {
    return res = await fetch(url + filter)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            let result = value.results;
            let next = value.next;
            return [result, next];
        })
        .catch(function(err) {
            console.log('error')
        });
}

async function getMovie(filter) {
    return res = await fetch(url + filter)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            return value;
        })
        .catch(function(err) {
            console.log('error')
        });
}

function topMovie() {
    getMovies('?sort_by=-imdb_score')
    .then(ret => {
        let movies = ret[0];
        let movie = movies[0]
        topMovieWindow(movie)
    });
}
 
topMovie()

for (let cat of categories) {
    getMovies('?genre=' + cat)
        .then(ret => {
            let movies = ret[0];
            let next = ret[1];
            if (next != null) {
                next_page = next.split("/").pop();
                getMovies(next_page)
                .then((res) => {
                    let moviesToAdd = res[0]
                    next = res[1]
                    for (let movie of moviesToAdd) {
                        movies.push(movie)
                    }
                    console.log(movies)
                    const newCat =  document.createElement("div");
                    let genre = cat
                    newCat.setAttribute('id', cat)
                    categoryCont.appendChild(newCat);
                    carrousel(genre, movies)
                })
            }
    });
}
