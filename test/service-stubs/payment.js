'use strict';

/* eslint no-console: 0 */

const express = require('express'),
    app = express(),
    router = require('express').Router(),
    bodyParser = require('body-parser');
let lastId;

const FAILURE_NAME = 'Break';
const FAILURE_PAY_ID = '999';
const PAYMENT_STUB_PORT = 8383;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

router.all('*', function (req, res, next) {
    console.log(req.url);
    next();
});

router.post('/users/:userId/payments', function (req, res) {
    const data = require('test/data/payments/create.json');
    if (req.body.reference.indexOf(FAILURE_NAME) > -1) {
        lastId = FAILURE_PAY_ID;
        data.id = lastId;
    } else {
        lastId = data.id;
    }
    console.log(201);
    console.log(data);
    res.status(201);
    res.send(data);
    delete require.cache[require.resolve('test/data/payments/create.json')];
});

router.get('/users/:userId/payments/:paymentId', function (req, res) {
    const data = require('test/data/payments/find.json');
    if (req.params.paymentId === FAILURE_PAY_ID) {
        data.state.status = 'failed';
        res.status(200);
        res.send(data);
    } else {
        res.status(200);
        res.send(data);
    }
    console.log(200);
    console.log(data);
    delete require.cache[require.resolve('test/data/payments/find.json')];
});

app.use(router);

console.log(`Listening on: ${PAYMENT_STUB_PORT}`);
const server = app.listen(PAYMENT_STUB_PORT);

module.exports = server;
