'use strict';

const config = require('config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger.cjs')('Init');
const app = express();
const orchestratorServicePort = config.services.orchestrator.port;
const orchestratorServicePath = config.services.orchestrator.paths.submissions;

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

router.get(`${orchestratorServicePath}/:data`, (req, res) => {
    const data = require(`test/data/${req.params.data}`);
    res.send(data);
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
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

logger.info(`Listening on: ${orchestratorServicePort}`);

const server = app.listen(orchestratorServicePort);

module.exports = server;
