'use strict';
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const FormatUrl = require('./FormatUrl');
const logger = require('app/components/logger')('Init');
const os = require('os');

const healthOptions = message => {
    return {
        callback: (error, res) => { // eslint-disable-line id-blacklist
            if (error) {
                logger.error(null, 'health_check_error', message, error);
            } else {
                logger.info(null, 'health check received', message);
            }
            return !error && res.status === 200 ? outputs.up() : outputs.down(error);
        },
        timeout: config.health.timeout,
        deadline: config.health.deadline
    };
};
const checks = () => {
    return {
        [config.services.validation.name]: healthcheck.web(FormatUrl.format(config.services.validation.url, config.endpoints.health),
            healthOptions('Health check failed on '+ config.services.validation.name)),
        [config.services.orchestrator.name]: healthcheck.web(FormatUrl.format(config.services.orchestrator.url, config.endpoints.health),
            healthOptions('Health check failed on '+ config.services.orchestrator.name))
    };
};

const setupHealthCheck = app => {
    healthcheck.addTo(app, {
        checks: checks(),
        buildInfo: {
            name: config.health.service_name,
            host: os.hostname(),
            uptime: process.uptime()
        }
    });
};

module.exports = setupHealthCheck;
