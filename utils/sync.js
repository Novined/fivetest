exports.syncArticles = syncArticles;

var express = require('express');
var db = require('../utils/database.js');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');

function getUTCDate(str) {
    var times = str.split(',');
    times[1] = times[1].trim();
    var month = 1;
    if (times[1].indexOf("фев") != -1) {
        month = 2;
    } else if (times[1].indexOf("мар") != -1) {
        month = 3;
    } else if (times[1].indexOf("апр") != -1) {
        month = 4;
    } else if (times[1].indexOf("мая") != -1) {
        month = 5;
    } else if (times[1].indexOf("июн") != -1) {
        month = 6;
    } else if (times[1].indexOf("июл") != -1) {
        month = 7;
    } else if (times[1].indexOf("авг") != -1) {
        month = 8;
    } else if (times[1].indexOf("сен") != -1) {
        month = 9;
    } else if (times[1].indexOf("окт") != -1) {
        month = 10;
    } else if (times[1].indexOf("ноя") != -1) {
        month = 11;
    } else if (times[1].indexOf("дек") != -1) {
        month = 12;
    }

    var day = times[1].split(' ')[0];
    var year = times[1].split(' ')[2];

    return moment(year + '-' + month + '-' + day + ' ' + times[0] + ' +0000', "YYYY-MM-DD HH:mm Z");
}

function newWord(index, wordsArray) {
    if (wordsArray[index] !== undefined) {
        db.addWord(wordsArray[index].toLowerCase(), function(err, w) {
            newWord(++index, wordsArray);
        });
    }
}

function syncArticles() {
    var words = [];
    request('http://lenta.ru', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body, { decodeEntities: false });

            var lastElem = $('.items').children().length;
            var elemCount = 0;

            $('.items').children().each(function(i, elem) {
                var title = $(this).children().text().replace($(this).children().children('time').text())
                    .replace(/[&]nbsp[;]/gi, " ").replace('undefined', '');

                var articleWords = title.split(' ');

                var article = {
                    title: title,
                    link: $(this).children().attr('href'),
                    date: getUTCDate($(this).children().children('time').attr('datetime').trim())
                }

                db.addArticle(article, function(err, isAdded) {
                    console.log(isAdded);
                    if (isAdded) {
                        articleWords.forEach(function(word) {
                            console.log(word);
                            words.push(word.toLowerCase());
                        });
                    }
                    elemCount++;
                    if (elemCount == lastElem) {
                        console.log(words);

                        newWord(0, words);

                        db.countArticles(function(count) {
                            if (count > 12) {
                                var index = 12;
                                db.listArticles().then(function(articles) {
                                    while (articles[index] != 'undefined') {
                                        db.removeArticle(articles[index]._id);
                                        index++;
                                    }
                                });
                            }

                            var time = moment.duration("36:00:00");
                            var deadDate = moment();
                            deadDate.subtract(time);

                            var dataIndex = 0;

                            db.listArticles().then(function(data) {
                                while (data[dataIndex] != 'undefined') {
                                    if (moment(data[dataIndex].date).isBefore(deadDate)) {
                                        db.removeArticle(data[dataIndex]._id);
                                    }

                                    dataIndex++;
                                }
                            });
                        });
                    }
                });
            });
        }
    });
}