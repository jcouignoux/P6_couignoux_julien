// import { movie } from './models';
// const movie = require('./model/movie')
const url = "http://localhost:8000/api/v1/titles/"
const categories = ['Action', 'Animation', 'Biography']
const categoryCont = document.getElementById('categories');

function topMovieWindow(movie) {
    let topMovie = document.getElementById('topMovie');
    topMovie.innerHTML = (
        '<div class="card">\
            <img src="' + movie.image_url +'" alt="John" style="width:10%">\
            <h1>'+ movie.title +'</h1>\
            <p class="title">'+ movie.imdb_score +'</p>\
            <p><button id="modalBtn'+ movie.id +'">Voir</button></p>\
        </div>\
        <div id="myModal'+ movie.id +'" class="modal">\
            <div class="modal-content">\
            <span class="close">&times;</span>\
            <p>'+ movie.title +'</p>\
            </div>\
        </div>'
    )
    var modal = document.getElementById("myModal" + movie.id);
    var btn = document.getElementById("modalBtn" + movie.id);
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
}

function carrousel(movies) {
    let carrousel = document.getElementById('Action');
    console.log(movies);
    carrousel.innerHTML = (
        '<div class="carousel-container">\
            <div class="inner-carousel">\
                <div class="track">\
                    <div class="card-container">\
                        <div class=card><img src="'+ movies[0].image_url +'></div>\
                    </div>\
                    <div class="card-container">\
                        <div class=card><img src="'+ movies[1].image_url +'></div>\
                    </div>\
                    <div class="card-container">\
                        <div class=card><img src="'+ movies[2].image_url +'></div>\
                    </div>\
                    <div class="card-container">\
                        <div class=card><img src="'+ movies[3].image_url +'></div>\
                    </div>\
                    <div class="card-container">\
                        <div class=card><img src="'+ movies[4].image_url +'></div>\
                    </div>\
                    <div class="card-container">\
                        <div class="card card12">12</div>\
                    </div>\
                </div>\
                <div class="nav">\
                    <button class="prev"><i class="fas fa-arrow-left fa-2x"></i></button>\
                    <button class="next"><i class="fas fa-arrow-right fa-2x"></i></button>\
                </div>\
            </div>\
        </div>'
    )
    const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const carousel = document.querySelector(".carousel-container");
const track = document.querySelector(".track");
let width = carousel.offsetWidth;
let index = 0;
window.addEventListener("resize", function () {
  width = carousel.offsetWidth;
});
next.addEventListener("click", function (e) {
  e.preventDefault();
  index = index + 1;
  prev.classList.add("show");
  track.style.transform = "translateX(" + index * -width + "px)";
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

function getMovies(filter) {
    return fetch(url + filter)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            let result = value.results;
            return result;
        })
        .catch(function(err) {
            console.log('error')
        });
}

function topMovie() {
    let topMovie = document.getElementById('topMovie');
    let topMovieTemplate = document.createElement('topMovieTemplate')
    getMovies('?sort_by=-imdb_score')
    .then(movies => {
        console.log(movies)
        let movie = movies[0]
        topMovieWindow(movie)
    });
}
 
topMovie()

// for (cat_index of Array(categories.length).keys()) {
//     console.log(cat_index);
//     const newCat =  document.createElement("div");
//     getMovies('?genre=' + categories[cat_index])
//     .then(category => {
//         console.log(category);
//         newCat.innerText = categories[cat_index];
//         categoryCont.appendChild(newCat);
//     });
// }
getMovies('?genre=Action')
    .then(movies => {
        console.log('Action');
        const newCat =  document.createElement("div");
        newCat.setAttribute('id', 'Action')
        newCat.classList.add("category")
        categoryCont.appendChild(newCat);
        carrousel(movies)
    });
    
getMovies('?genre=Animation')
.then(movies => {
    console.log('Animation');
    const newCat =  document.createElement("div");
    newCat.innerText = 'Animation';
    categoryCont.appendChild(newCat);
    for (let movie of movies) {
        const newMov = document.createElement("p");
        newMov.innerText = movie.title;
        newMov.classList.add("category");
        newCat.appendChild(newMov);
    }
});

getMovies('?genre=Biography')
    .then(movies => {
        console.log('Biography');
        const newCat =  document.createElement("div");
        newCat.innerText = 'Biography';
        categoryCont.appendChild(newCat);
        for (let movie of movies) {
            const newMov = document.createElement("p");
            newMov.innerText = movie.title;
            newMov.classList.add("category");
            newCat.appendChild(newMov);
        }
    });