exports.listArticles = listArticles;
exports.listWords = listWords;

var axios = require('axios');

function listArticles() {
    return axios.get('http://localhost:8080/api/articles');
}

function listWords() {
    return axios.get('http://localhost:8080/api/words');
}