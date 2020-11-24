'use strict';

const express = require('express');
const config = require('config');
const app = express();
const router = require('express').Router();
const bodyParser = require('body-parser');
const S2S_STUB_PORT = process.env.S2S_STUB_PORT || 4502;
const logger = require('app/components/logger');

const errorSequence = config.s2sStubErrorSequence;
let iterator = 0;

app.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/lease', (req, res) => {
    logger().info(req.headers);
    logger().info(req.body);

    if (!getShowErrorFromSeq()) {
        res.status(200);
        res.send('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');

    } else {
        res.status(401);
        res.send(JSON.stringify({'message': 'Invalid one-time password'}));
    }

    iterator += 1;
    if (iterator === errorSequence.length) {
        iterator = 0;
    }
});

router.get('/health', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send({'status': 'UP'});
});

app.use(router);

logger().info(`Listening on: ${S2S_STUB_PORT}`);
const server = app.listen(S2S_STUB_PORT);

module.exports = server;

const getShowErrorFromSeq = () => {
    let showError = false;
    if (errorSequence.charAt(iterator) === '1') {
        showError = true;
    }

    logger().info(`showError for s2s-stub: ${showError}`);
    return showError;
};
