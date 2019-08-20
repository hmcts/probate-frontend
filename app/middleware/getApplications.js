'use strict';

const config = require('app/config');
const MultipleApplications = require('app/services/MultipleApplications');
const logger = require('app/components/logger')('Init');

const getApplications = (req, res, next) => {
    const session = req.session;
    const multipleApplications = new MultipleApplications(config.services.multipleApplicatons.urlApplications, session.id);

    multipleApplications.getApplications(session.form.applicantEmail)
        .then(result => {
            session.form.applications = result.applications;
            next();
        })
        .catch(err => {
            logger.error(`Error while getting applications: ${err}`);
        });
};

module.exports = getApplications;
