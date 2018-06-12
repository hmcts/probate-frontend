'use strict';

/* eslint no-console: 0 */

const config = require('app/config'),
        express = require('express'),
        app = express(),
        router = require('express').Router(),
        PERSISTENCE_SERVICE_PORT = config.services.persistence.port,
        PERSISTENCE_SERVICE_PATH = config.services.persistence.path;

router.get('invitedata/:id', function (req, res) {
    if (req.params.id === 'true') {
        res.status(200);
        res.send({valid: true});
    } else {
        res.status(404);
        res.send({valid: false});
    }
});

router.patch('/invitedata/:id', function (req, res) {
    res.status(200);
    res.send('SuperTrooper');
});

router.get(`${PERSISTENCE_SERVICE_PATH}/:data`, function (req, res) {
    const data = require(`test/data/${req.params.data}`);
    res.status(200);
    res.send(data);
});

router.get('/health', function (req, res) {
    res.send({'status': 'UP'});
});

router.get('/info', function (req, res) {
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

console.log(`Listening on: ${PERSISTENCE_SERVICE_PORT}`);
const server = app.listen(PERSISTENCE_SERVICE_PORT);

module.exports = server;
