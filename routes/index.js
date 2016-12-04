var express = require('express');
var router = express.Router();
var api = require('../utils/api.js');

router.get('/', function(req, res) {
    api.listArticles().then(function(responseArticles) {
        api.listWords().then(function(responseWords) {
            res.render('index', {
                "articles": responseArticles.data,
                "words": responseWords.data
            });
        });
    });
});

module.exports = router;