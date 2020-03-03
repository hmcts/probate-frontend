'use strict';

const router = require('express').Router();
const Healthcheck = require('app/utils/Healthcheck');
const completeEqualityTask = require('app/middleware/completeEqualityTask');
const config = require('app/config');
const logger = require('app/components/logger')('Init');

router.get('/task-list', (req, res, next) => {
    const healthcheck = new Healthcheck();
    const services = [
        {name: config.services.equalityAndDiversity.name, url: config.services.equalityAndDiversity.url}
    ];

    healthcheck.getDownstream(services, healthcheck.health, healthDownstream => {
        healthDownstream[0].status = 'UP';
        req.session.equalityHealth = healthDownstream[0].status;
        logger.info(config.services.equalityAndDiversity.name, 'is', req.session.equalityHealth);

        next();
    });
});

router.get('/equality-and-diversity', (req, res, next) => completeEqualityTask(req, res, next));

module.exports = router;
