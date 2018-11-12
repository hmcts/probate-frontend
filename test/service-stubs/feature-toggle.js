'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const featureTogglesPort = config.featureToggles.port;

//enable all toggles
router.get(`${config.featureToggles.path}/:featureToggleKey`, (req, res) => {
    res.send('true');
});

//enable specific toggles here
//router.get(`${config.featureToggles.path}/probate-screening-questions`, (req, res) => {
//   res.send('true');
//});

app.use(router);

logger.info(`Listening on: ${featureTogglesPort}`);

const server = app.listen(featureTogglesPort);

module.exports = server;
