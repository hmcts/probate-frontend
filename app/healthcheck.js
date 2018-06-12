'use strict';

const router = require('express').Router();
const os = require('os');
const gitProperties = require('git.properties');
const Healthcheck = require('app/utils/Healthcheck');
const commonContent = require('app/resources/en/translation/common');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();
const gitCommitId = gitProperties.git.commit.id;

router.get('/', (req, res) => {
    const healthcheck = new Healthcheck();
    healthcheck.getDownstream(healthcheck.health, healthDownstream => {
        healthcheck.getDownstream(healthcheck.info, infoDownstream => {
            return res.json({
                name: commonContent.serviceName,
                status: 'UP',
                uptime: process.uptime(),
                host: osHostname,
                version: gitRevision,
                gitCommitId,
                downstream: healthcheck.mergeInfoAndHealthData(healthDownstream, infoDownstream)
            });
        });
    });
});

module.exports = router;
module.exports.osHostname = osHostname;
module.exports.gitCommitId = gitCommitId;
