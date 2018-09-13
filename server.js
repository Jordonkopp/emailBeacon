const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
var redis            = require("redis-mock");

var client = redis.createClient();
const port = 8000;

var logger = require('./app/logger/logger');

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, client, logger);

app.listen(port, () => {
    logger.accessLog.info('Service running on port: ' + port);
});

module.exports = app
