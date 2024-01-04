'use strict';

const logger = require('app/components/logger')('Init');
const os = require('os');
const config = require('config');

const setupHealthCheck = app => {
    app.get('/health/liveness', (req, res) => {
        logger.info('Liveness health check route hit');
        res.status(200).json({
            status: 'UP',
            message: 'Liveness check passed',
            name: config.health.service_name,
            host: os.hostname(),
            uptime: process.uptime()
        });
    });

    app.get('/health/readiness', (req, res) => {
        logger.info('Readiness health check route hit');
        res.status(200).json({
            status: 'UP',
            message: 'Readiness check passed',
            name: config.health.service_name,
            host: os.hostname(),
            uptime: process.uptime()
        });
    });
};

module.exports = setupHealthCheck;
