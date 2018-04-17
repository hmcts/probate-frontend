'use strict';

/* eslint no-console: 0 */

const config = require('app/config'),
    express = require('express'),
    app = express(),
    router = require('express').Router(),
    SUBMIT_SERVICE_PORT = config.services.submit.port,
    SUBMIT_SERVICE_PATH = config.services.submit.path;

router.post(SUBMIT_SERVICE_PATH, function (req, res) {
    res.status(200);
    res.send('1234567890');
});
router.get('/health', function (req, res) {
    res.send({'status': 'UP'});
});

app.use(router);

// start the app
console.log(`Listening on: ${SUBMIT_SERVICE_PORT}`);
const server = app.listen(SUBMIT_SERVICE_PORT);

module.exports = server;
