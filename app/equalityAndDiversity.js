'use strict';

const router = require('express').Router();
const Healthcheck = require('app/utils/Healthcheck');
const config = require('app/config');
const logger = require('app/components/logger')('Init');

router.get('/task-list', (req, res, next) => {
    const healthcheck = new Healthcheck();
    const services = [
        {name: config.services.equalityAndDiversity.name, url: config.services.equalityAndDiversity.url}
    ];

    healthcheck.getDownstream(services, healthcheck.health, healthDownstream => {
        healthDownstream.status = 'UP';
        req.session.equalityHealth = healthDownstream[0].status;
        logger.info(config.services.equalityAndDiversity.name, 'is', req.session.equalityHealth);

        next();
    });
});

module.exports = router;
