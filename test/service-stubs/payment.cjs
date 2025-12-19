'use strict';

const express = require('express');
const app = express();
const router = require('express').Router();
const bodyParser = require('body-parser');
const logger = require('app/components/logger.cjs');
let lastId;

const UNDEFINED_PAY_ID = 'undefined';
const FAILURE_NAME = 'Break';
const FAILURE_PAY_ID = '999';
const PAYMENT_STUB_PORT = 8383;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

router.all('*', (req, res, next) => {
    logger().info(req.url);
    next();
});

router.post('/users/:userId/payments', (req, res) => {
    const data = require('test/data/payments/create.json');
    if (req.body.reference.indexOf(FAILURE_NAME) > -1) {
        lastId = FAILURE_PAY_ID;
        data.id = lastId;
    } else {
        lastId = data.id;
    }
    logger().info(201);
    logger().info(data);
    res.status(201);
    res.send(data);
    delete require.cache[require.resolve('test/data/payments/create.json')];
});

router.get('/users/:userId/payments/:paymentId', (req, res) => {
    const data = require('test/data/payments/find.json');
    if (req.params.paymentId === UNDEFINED_PAY_ID) {
        res.status(500);
        logger().info(500);
    } else if (req.params.paymentId === FAILURE_PAY_ID) {
        data.state.status = 'failed';
        res.status(200);
        res.send(data);
        logger().info(data);
    } else {
        res.status(200);
        res.send(data);
        logger().info(200);
        logger().info(data);
    }
    delete require.cache[require.resolve('test/data/payments/find.json')];
});

app.use(router);

logger().info(`Listening on: ${PAYMENT_STUB_PORT}`);
const server = app.listen(PAYMENT_STUB_PORT);

module.exports = server;
