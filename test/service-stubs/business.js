'use strict';

/* eslint no-console: 0 */

const express = require('express'),
    app = express(),
    router = require('express').Router();
router.get('invites/allAgreed/:id', function (req, res) {
    res.status(200);
    res.send('false');
});

router.get('/health', function (req, res) {
    res.send({'status': 'UP'});
});

router.get('/info', function (req, res) {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e1'
           }
        }
    });
});

app.use(router);

console.log('Listening on: 8080');
const server = app.listen(8080);

module.exports = server;
