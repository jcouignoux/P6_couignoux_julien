// import { movie } from './models';
// const movie = require('./model/movie')
const url = "http://localhost:8000/api/v1/titles/"
const categories = ['Action', 'Animation', 'Biography']
const categoryCont = document.getElementById('categories');

function topMovieWindow(movie) {
    let topMovie = document.getElementById('topMovie');
    topMovie.innerHTML = (
        '<div class="card">\
            <img src="' + movie.image_url +'" alt="John" style="width:30%">\
            <h1>'+ movie.title +'</h1>\
            <p class="title">'+ movie.imdb_score +'</p>\
            <p><button id="modalBtn">Voir</button></p>\
        </div>\
        <div id="myModal" class="modal">\
            <div class="modal-content">\
            <span class="close">&times;</span>\
            <p>Some text in the Modal..</p>\
            </div>\
        </div>'
    )
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("modalBtn");
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
        movie = movies[0]
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
        newCat.innerText = 'Action';
        categoryCont.appendChild(newCat);
        for (movie of movies) {
            const newMov = document.createElement("p");
            newMov.innerText = movie.title;
            newMov.classList.add("category");
            newCat.appendChild(newMov);
        }
    });
    
getMovies('?genre=Animation')
.then(movies => {
    console.log('Animation');
    const newCat =  document.createElement("div");
    newCat.innerText = 'Animation';
    categoryCont.appendChild(newCat);
    for (movie of movies) {
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
        for (movie of movies) {
            const newMov = document.createElement("p");
            newMov.innerText = movie.title;
            newMov.classList.add("category");
            newCat.appendChild(newMov);
        }
    });