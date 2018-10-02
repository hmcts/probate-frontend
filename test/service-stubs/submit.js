'use strict';

/* eslint no-console: 0 */

const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const SUBMIT_SERVICE_PORT = config.services.submit.port;
const SUBMIT_SERVICE_URL = config.services.submit.url;

router.post(SUBMIT_SERVICE_URL + '/submit', (req, res) => {
    res.status(200);
    res.send({
        submissionReference: '6',
        registry: {
            name: 'Birmingham',
            sequenceNumber: '20000',
            email: 'asdvavv',
            address: 'Line 1 Bham\nLine 2 Bham\nLine 3 Bham\nPostCode Bham'
        }
    });
});

router.post(SUBMIT_SERVICE_URL + '/updatePaymentStatus', (req, res) => {
  res.status(200);
  res.send({
    submissionReference: '6',
    registry: {
      name: 'Birmingham',
      sequenceNumber: '20000',
      email: 'asdvavv',
      address: 'Line 1 Bham\nLine 2 Bham\nLine 3 Bham\nPostCode Bham'
    }
  });
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

router.get('/info', function (req, res) {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e2'
           }
        }
    });
});

app.use(router);

// start the app
console.log(`Listening on: ${SUBMIT_SERVICE_PORT}`);
const server = app.listen(SUBMIT_SERVICE_PORT);

module.exports = server;
