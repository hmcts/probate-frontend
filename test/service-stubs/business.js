'use strict';

/* eslint no-console: 0 */
const config = require('app/config');
const express = require('express'),
    app = express(),
    router = require('express').Router();
const validationServicePort = config.services.validation.port;
const logger = require('app/components/logger')('Init');

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

logger.info(`Listening on: ${validationServicePort}`);
const server = app.listen(validationServicePort);

module.exports = server;
