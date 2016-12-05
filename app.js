var express = require('express');

var bodyParser = require('body-parser');
var reload = require('reload');
var cron = require('node-cron');
var db = require('./utils/database.js');
var sync = require('./utils/sync.js');

const app = express();
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP;
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;

db.setUpConnection();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(require('./routes/index'));
app.use(require('./routes/articles'));
app.use(require('./routes/words'));
app.use(express.static('public'));
var server = app.listen(port, ipaddr, function() {
    console.log('App started on port ' + port);
});

cron.schedule('0 2 * * * *', function() {
    sync.syncArticles();
});

reload(server, app);
