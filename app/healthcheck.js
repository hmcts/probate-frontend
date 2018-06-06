'use strict';

const config = require('app/config');
const {asyncFetch, fetchOptions} = require('app/components/api-utils');
const {map} = require('lodash');
const router = require('express').Router();
const os = require('os');
const gitProperties = require('git.properties');
const FormatUrl = require('app/utils/FormatUrl');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();
const gitCommitId = gitProperties.git.commit.id;

const formatHealthUrl = url => FormatUrl.format(url, config.healthEndpoint);

const services = [
    {'name': 'Validation Service', 'url': formatHealthUrl(config.services.validation.url)},
    {'name': 'Submit Service', 'url': formatHealthUrl(config.services.submit.url)},
    {'name': 'Persistence Service', 'url': formatHealthUrl(config.services.persistence.url)}
];

const createPromisesList = (services) => {
    const fetchOpts = fetchOptions({}, 'GET', {});
    return map(services, service => asyncFetch(service.url, fetchOpts, res => res.json().then(json => {
        return {'name': service.name, 'status': json.status};
    })).catch(err => {
        return {'name': service.name, 'status': err.toString()};
    }));
};

router.get('/', (req, res) => {
    const healthPromises = createPromisesList(services);
    Promise.all(healthPromises).then(downstream => {
        res.json({
            'name': commonContent.serviceName,
            'status': 'UP',
            'uptime': process.uptime(),
            'host': osHostname,
            'version': gitRevision,
            gitCommitId,
            downstream
        });
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
module.exports.gitCommitId = gitCommitId;
