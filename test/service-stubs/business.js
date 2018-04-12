'use strict';

/* eslint no-console: 0 */

const express = require('express'),
    app = express(),
    router = require('express').Router();
router.get('invites/allAgreed/:id', function (req, res) {
    res.status(200);
    res.send('false');
});

app.use(router);

console.log('Listening on: 8080');
const server = app.listen(8080);

module.exports = server;