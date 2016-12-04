exports.setUpConnection = setUpConnection;
exports.listArticles = listArticles;
exports.countArticles = countArticles;
exports.removeArticle = removeArticle;
exports.addArticle = addArticle;
exports.addWord = addWord;
exports.listWords = listWords;

var mongoose = require('mongoose');

require('../models/Article');
require('../models/Word');

const Article = mongoose.model('Article');
const Word = mongoose.model('Word');
var db_name = 'articles';
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

function setUpConnection() {
    mongoose.connect(mongodb_connection_string);
}

function listArticles() {
    return Article.find().sort({ date: -1 });
}

function listWords() {
    return Word.find();
}

function countArticles(callback) {
    Article.count({}, function(err, count) {
        return callback(count);
    });
}

function removeArticle(id) {
    console.log(id);
    return Article.findOneAndRemove({ _id: id }, function(err, res) {
        console.log(res);
    });
}

function addArticle(data, callback) {
    const article = new Article({
        title: data.title,
        link: data.link,
        date: data.date,
    });

    Article.find({ link: data.link }, function(err, docs) {
        if (docs.length) {
            callback('Name exists already', false);
        } else {
            article.save(function(err) {
                callback(err, true);
            });
        }
    });
}

function addWord(data, callback) {

    // Word.findOneAndUpdate({
    //     query: { word: data },
    //     update: {
    //         $inc: { count: 1 },
    //         $setOnInsert: {
    //             word: data,
    //             count: 1
    //         }
    //     },
    //     new: true, // return new doc if one is upserted
    //     upsert: true // insert the document if it does not exist
    // }, function(err) {
    //     callback(err, word);
    // });
    const word = new Word({
        word: data,
        count: 1
    });

    Word.find({ word: data }, function(err, docs) {
        console.log(data + ': ' + docs)
        if (docs.length) {
            Word.findOneAndUpdate({ word: data }, { $inc: { count: 1 } }, { new: true },
                function(err, res) {
                    callback(err, res);
                });
        } else {
            word.save(function(err) {
                callback(err, word);
            });
        }
    });
}