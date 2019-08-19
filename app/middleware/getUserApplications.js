'use strict';

const config = require('app/config');
const MultipleApplications = require('app/services/MultipleApplications');
const logger = require('app/components/logger')('Init');

const getUserApplications = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applications = new MultipleApplications(config.services.multipleApplicatons.url, session.id);

    applications.get(formdata.applicantEmail)
        .then(result => {
            formdata.applications = result.applications;
            session.form = formdata;
            next();
        })
        .catch(err => {
            logger.error(`Error while checking the link or sending the pin: ${err}`);
        });
};

module.exports = getUserApplications;
