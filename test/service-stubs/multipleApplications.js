'use strict';

const config = require('app/config');
const express = require('express');
const logger = require('app/components/logger');
const app = express();
const router = require('express').Router();
const MULTIPLE_APPLICATIONS_PORT = config.services.multipleApplicatons.port;
const content = require('app/resources/en/translation/dashboard');
const url = require('url');

router.get('/ma-get-applications', (req, res) => {
    res.status(200);
    res.send({
        applications: [{
            ccdCaseId: '1234-5678-9012-3456',
            deceasedFullName: 'Bob Jones',
            dateCreated: '7 October 2018',
            status: content.statusInProgress
        }, {
            ccdCaseId: '9012-3456-1234-5678',
            deceasedFullName: 'Tom Smith',
            dateCreated: '24 February 2019',
            status: content.statusSubmitted
        }]
    });
});

router.get('/ma-get-case', (req, res) => {
    const urlParts = url.parse(req.originalUrl, true);
    let status;

    switch (urlParts.query.ccdCaseId) {
    case '1234-5678-9012-3456':
        status = content.statusInProgress;
        break;
    case '9012-3456-1234-5678':
        status = content.statusSubmitted;
        break;
    default:
        status = '';
        break;
    }

    res.status(200);
    res.send({
        status: status,
        formdata: {
            executors: {}
        }
    });
});

app.use(router);

logger().info(`Listening on: ${MULTIPLE_APPLICATIONS_PORT}`);

const server = app.listen(MULTIPLE_APPLICATIONS_PORT);

module.exports = server;
