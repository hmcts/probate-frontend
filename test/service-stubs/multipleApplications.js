'use strict';

const config = require('app/config');
const express = require('express');
const logger = require('app/components/logger');
const app = express();
const router = require('express').Router();
const MULTIPLE_APPLICATIONS_PORT = config.services.multipleApplicatons.port;
const content = require('app/resources/en/translation/dashboard');

router.get('/multiple-applications', (req, res) => {
    res.status(200);
    res.send({
        applications: [{
            deceasedFullName: 'Bob Jones',
            dateCreated: '7 October 2018',
            status: content.statusInProgress
        }, {
            deceasedFullName: 'Tom Smith',
            dateCreated: '24 February 2019',
            status: content.statusSubmitted
        }]
    });
});

app.use(router);

logger().info(`Listening on: ${MULTIPLE_APPLICATIONS_PORT}`);

const server = app.listen(MULTIPLE_APPLICATIONS_PORT);

module.exports = server;
