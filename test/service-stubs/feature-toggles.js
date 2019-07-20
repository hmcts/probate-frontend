'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const featureTogglesPort = config.featureToggles.port;

// router.get(`${config.featureToggles.path}/:featureToggleKey`, (req, res) => {
//     res.send('true');
// });

router.get(`${config.featureToggles.path}/probate-fe-shutter`, (req, res) => {
    res.send('true');
});

router.get(`${config.featureToggles.path}/probate-intestacy-questions`, (req, res) => {
    res.send('true');
});

router.get(`${config.featureToggles.path}/probate-fees-api`, (req, res) => {
    res.send('true');
});

router.get(`${config.featureToggles.path}/probate-copies-fees`, (req, res) => {
    res.send('true');
});

router.get(`${config.featureToggles.path}/probate-webchat`, (req, res) => {
    res.send('true');
});

app.use(router);

logger.info(`Listening on: ${featureTogglesPort}`);

const server = app.listen(featureTogglesPort);

module.exports = server;
