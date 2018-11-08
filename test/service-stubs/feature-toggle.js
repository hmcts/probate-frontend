'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();

//router.get(`${config.featureToggles.path}/:featureToggleKey`, (req, res) => {
//    res.send('true');
//});

router.get(`${config.featureToggles.path}/probate-screening-questions`, (req, res) => {
   res.send('true');
});

app.use(router);

logger.info(`Listening on: 8888`);

const server = app.listen(8888);

module.exports = server;
