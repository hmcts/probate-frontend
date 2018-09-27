'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const persistenceServicePort = config.services.persistence.port;
const persistenceServicePath = config.services.persistence.path;

router.get('invitedata/:id', (req, res) => {
    if (req.params.id === 'true') {
        res.send({valid: true});
    } else {
        res.status(404);
        res.send({valid: false});
    }
});

router.patch('/invitedata/:id', (req, res) => {
    res.send('SuperTrooper');
});

router.get(`${persistenceServicePath}/:data`, (req, res) => {
    const data = require(`test/data/${req.params.data}`);
    res.send(data);
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

router.get(`${config.featureToggles.path}/:featureToggleKey`, (req, res) => {
    res.send('true');
});

router.get('/info', (req, res) => {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e3'
            }
        }
    });
});

app.use(router);

logger.info(`Listening on: ${persistenceServicePort}`);

const server = app.listen(persistenceServicePort);

module.exports = server;
