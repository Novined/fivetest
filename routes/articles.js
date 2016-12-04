var express = require('express');
var router = express.Router();
var db = require('../utils/database.js');

router.get('/api/articles', function(req, res) {
    db.listArticles().then(function(data) {
        return res.send(data);
    });
});


module.exports = router;