var express = require('express');

var bodyParser = require('body-parser');
var reload = require('reload');
var cron = require('node-cron');
var db = require('./utils/database.js');
var sync = require('./utils/sync.js');

const app = express();
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

db.setUpConnection();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(require('./routes/index'));
app.use(require('./routes/articles'));
app.use(require('./routes/words'));
app.use(express.static('public'));
var server = app.listen(server_port, server_ip_address, function() {
    console.log('App started on port ' + server_port);
});

cron.schedule('0 2 * * * *', function() {
    sync.syncArticles();
});

reload(server, app);