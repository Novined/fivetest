var express = require('express');
var router = express.Router();
var db = require('../utils/database.js');


router.get('/api/words', function(req, res) {
    db.listWords().then(function(data) {
        return res.send(data);
    });
});


module.exports = router;