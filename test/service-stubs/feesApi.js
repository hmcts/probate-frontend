'use strict';

const config = require('config');
const express = require('express');
const logger = require('app/components/logger');
const app = express();
const router = require('express').Router();
const FEES_API_PORT = config.services.feesRegister.port;

router.get(`/fees-register${config.services.feesRegister.paths.feesLookup}`, (req, res) => {
    let feeAmount = 0;
    let feeAmountPerCopy;

    res.status(200);

    switch (req.query.event) {
    case 'issue':
        if (req.query.amount_or_volume > config.services.feesRegister.ihtMinAmt) {
            feeAmount = 273;
        }

        logger().info(`Application fee: £${feeAmount}`);

        res.send({
            'code': 'FEE0219',
            'description': 'Application for a grant of probate (Estate over £5000)',
            'version': 3,
            'fee_amount': feeAmount
        });
        break;
    case 'copies':
        feeAmountPerCopy = 0.5;
        if (req.query.keyword === 'NewFee') {
            feeAmountPerCopy = 1.5;
        }
        feeAmount = feeAmountPerCopy * req.query.amount_or_volume;

        if (req.query.keyword) {
            logger().info(`Keyword: ${req.query.keyword}`);
        }
        logger().info(`Copies fee: £${feeAmount}`);

        res.send({
            'code': 'FEE0003',
            'description': 'Additional copies of the grant representation',
            'version': 3,
            'fee_amount': feeAmount
        });
        break;
    default:
        res.send('false');
    }
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

logger().info(`Listening on: ${FEES_API_PORT}`);

const server = app.listen(FEES_API_PORT);

module.exports = server;
