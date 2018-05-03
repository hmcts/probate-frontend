'use strict';

/* eslint no-console: 0 */

const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const SUBMIT_SERVICE_PORT = config.services.submit.port;
const SUBMIT_SERVICE_PATH = config.services.submit.path;

router.post(SUBMIT_SERVICE_PATH, (req, res) => {
    res.status(200);
    res.send({
        submissionReference: '6',
        registryName: 'Birmingham',
        registrySequenceNumber: '20000',
        registryEmail: 'asdvavv',
        registryAddress: 'Line 1 Bham\nLine 2 Bham\nLine 3 Bham\nPostCode Bham'
    });
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

app.use(router);

// start the app
console.log(`Listening on: ${SUBMIT_SERVICE_PORT}`);
const server = app.listen(SUBMIT_SERVICE_PORT);

module.exports = server;
