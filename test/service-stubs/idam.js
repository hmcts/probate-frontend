'use strict';

/* eslint no-console: 0 */
// idam service-service auth stub

const express = require('express'),
    app = express(),
    router = require('express').Router(),
    bodyParser = require('body-parser'),
    S2S_STUB_PORT = process.env.S2S_STUB_PORT || 4502;

    app.use(bodyParser.urlencoded({
        extended: true
    }));

router.post('/lease', function (req, res) {
    console.log(req.headers);
    console.log(req.body);
    res.status(200);
    res.send('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');
});

app.use(router);

// start the app
console.log(`Listening on: ${S2S_STUB_PORT}`);
const server = app.listen(S2S_STUB_PORT);

module.exports = server;
