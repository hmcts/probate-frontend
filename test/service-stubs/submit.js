'use strict';

const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const SUBMIT_SERVICE_PORT = config.services.submit.port;
const logger = require('app/components/logger');

router.all('*', (req, res, next) => {
    logger().info(`Submit Service URL being called: ${req.url}`);
    next();
});

router.post('/submit', (req, res) => {
    res.status(200);
    res.send({
        status: 'Success',
        caseId: '1234123512361237',
        caseState: 'PAApplicationCreated',
        registry: {
            name: 'Birmingham',
            sequenceNumber: '20000',
            email: 'asdvavv',
            address: 'Line 1 Bham\nLine 2 Bham\nLine 3 Bham\nPostCode Bham'
        }
    });
});

router.post('/updatePaymentStatus', (req, res) => {
    res.status(200);
    res.send({
        status: 'Success',
        caseState: 'CaseCreated'
    });
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

router.get('/info', (req, res) => {
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

logger().info(`Listening on: ${SUBMIT_SERVICE_PORT}`);
const server = app.listen(SUBMIT_SERVICE_PORT);

module.exports = server;
