'use strict';

const config = require('app/config');
const {asyncFetch, fetchOptions} = require('app/components/api-utils');
const {map} = require('lodash');
const url = require('url');
const router = require('express').Router();
const os = require('os');
const gitRevision = process.env.GIT_REVISION;

const getServiceHealthUrl = (serviceUrl) => {
    serviceUrl = url.parse(serviceUrl);
    const port = serviceUrl.port ? `:${serviceUrl.port}` : '';
    return `${serviceUrl.protocol}//${serviceUrl.hostname}${port}${config.healthEndpoint}`;
}

const services = [
    {'name': 'Validation Service', 'url': getServiceHealthUrl(config.services.validation.url)},
    {'name': 'Submit Service', 'url': getServiceHealthUrl(config.services.submit.url)},
    {'name': 'Persistence Service', 'url': getServiceHealthUrl(config.services.persistence.url)}
];

const createPromisesList = (services) => {
    const fetchOpts = fetchOptions({}, 'GET', {});
    return map(services, service => asyncFetch(service.url, fetchOpts, res => res.json().then(json => {
        return {'name': service.name, 'status': json.status}
    })).catch(err => {
        return {'name': service.name, 'status': err.toString()}
    }));
}

router.get('/', (req, res) => {
    const healthPromises = createPromisesList(services);
    Promise.all(healthPromises).then(downstream => {
        res.json({
            'name': config.service.name,
            'status': 'UP',
            'uptime': process.uptime(),
            'host': os.hostname(),
            'version': gitRevision,
            downstream
        });
    });
});

module.exports = router;
