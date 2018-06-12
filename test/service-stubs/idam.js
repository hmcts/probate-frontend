'use strict';

/* eslint no-console: 0 */
// idam service-service auth stub

const express = require('express'),
    config = require('test/config'),
    app = express(),
    router = require('express').Router(),
    bodyParser = require('body-parser'),
    S2S_STUB_PORT = process.env.S2S_STUB_PORT || 4502;

    const errorSequence = config.s2sStubErrorSequence;
    let iterator = 0;

    app.use(bodyParser.urlencoded({
        extended: true
    }));

router.post('/lease', function (req, res) {
    console.log(req.headers);
    console.log(req.body);

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

// start the app
console.log(`Listening on: ${S2S_STUB_PORT}`);
const server = app.listen(S2S_STUB_PORT);

module.exports = server;

function getShowErrorFromSeq() {
    let showError = false;
    if (errorSequence.charAt(iterator) === '1') {
        showError = true;
    }

    console.log(`showError for s2s-stub: ${showError}`);
    return showError;
}
