'use strict';

/* eslint handle-callback-err: 0 no-unused-vars: 0*/

const config = require('app/config'),
      {asyncFetch, fetchOptions} = require('app/components/api-utils'),
      {map} = require('lodash'),
      url = require('url'),
      router = require('express').Router(),
      os = require('os'),
      gitRevision = config.gitRevision;

const services = [
    {'name': 'Validation Service', 'url': getServiceHealthUrl(url.parse(config.services.validation.url))},
    {'name': 'Submit Service', 'url': getServiceHealthUrl(url.parse(config.services.submit.url))},
    {'name': 'Persistence Service', 'url': getServiceHealthUrl(url.parse(config.services.persistence.url))}];

function createPromisesList(services) {
    const fetchOpts = fetchOptions({}, 'GET', {});

    return map(services,
        service => asyncFetch(service.url, fetchOpts, res => res.json().then(json => {
                    return {'name': service.name, 'status': json.status};
                })
            ).catch(err => {
            return {'name': service.name, 'status': 'ERROR'};
        }));
}

function getServiceHealthUrl(url) {
    const serviceHealthUrl = `${url.protocol}//${url.hostname}:${url.port}/health`;
    return serviceHealthUrl;
}

router.get('/', function (req, res) {

    const healthPromises = [];
    healthPromises.push(...createPromisesList(services));

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
