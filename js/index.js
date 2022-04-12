// import { movie } from './models';
// const movie = require('./model/movie')
const url = "http://localhost:8000/api/v1/titles/"
const categories = ['Action', 'Animation', 'Biography']
const categoryCont = document.getElementById('categories');


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
    let movie = ''
    getMovies('?sort_by=-imdb_score')
    .then(movies => {
        console.log(movies)
        movie = movies[0]
        topMovie.innerText = movie.title;
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