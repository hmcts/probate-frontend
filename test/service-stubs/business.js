'use strict';

/* eslint no-console: 0 */
const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const validationServicePort = config.services.validation.port;
const logger = require('app/components/logger')('Init');


router.get('invites/allAgreed/:id', (req, res) => {
    res.status(200);
    res.send('false');
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

router.get('/info', (req, res) => {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e1'
            }
        }
    });
});

router.post('/document/upload', (req, res) => {
    res.json([
        'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
    ]);
});

router.delete('/document/delete/:index', (req, res) => {
    res.status(204).send(true);
});

app.use(router);

logger.info(`Listening on: ${validationServicePort}`);
const server = app.listen(validationServicePort);

module.exports = server;
