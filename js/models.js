// const express = require('express');
// const router = express.Router();

class Movie {
    constructor(id, url, title, year, imdb_score, votes, image_url, genres) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.year = year;
        this.imdb_score = imdb_score;
        this.votes = votes;
        this.image_url = image_url;
        this.genres = genres;
    }
}

export default Movie;