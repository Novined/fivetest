exports.listArticles = listArticles;
exports.listWords = listWords;

var axios = require('axios');
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP;
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;

function listArticles() {
    return axios.get('http://' + ipaddr + ':' + port + '/api/articles');
}

function listWords() {
    return axios.get('http://' + ipaddr + ':' + port + '/api/words');
}
