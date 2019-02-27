'use strict';

/* eslint no-console: 0 */

const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const FEES_API_PORT = config.services.feesRegister.port;

router.get(`/fees-register${config.services.feesRegister.paths.feesLookup}`, (req, res) => {
    res.status(200);
    if (req.query.event === 'issue') {
        res.send({
            'code': 'FEE0219',
            'description': 'Application for a grant of probate (Estate over £5000)',
            'version': 3,
            'fee_amount': 215
        });
    }
    if (req.query.event === 'copies') {
        res.send({
            'code': 'FEE0003',
            'description': 'Additional copies of the grant representation',
            'version': 3,
            'fee_amount': 0.50
        });
    }
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

app.use(router);

console.log(`Listening on: ${FEES_API_PORT}`);

const server = app.listen(FEES_API_PORT);

module.exports = server;
