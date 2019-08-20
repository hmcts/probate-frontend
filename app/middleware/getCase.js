'use strict';

const config = require('app/config');
const MultipleApplications = require('app/services/MultipleApplications');
const logger = require('app/components/logger')('Init');
const content = require('app/resources/en/translation/dashboard');

const getCase = (req, res) => {
    const session = req.session;
    const multipleApplications = new MultipleApplications(config.services.multipleApplicatons.urlCase, session.id);
    const ccdCaseId = req.originalUrl.split('/')[2];

    multipleApplications.getCase(session.form.applicantEmail, ccdCaseId)
        .then(result => {
            session.form = result.formdata;
            if (result.status === content.statusInProgress) {
                res.redirect('/task-list');
            }

            res.redirect('/thank-you');
        })
        .catch(err => {
            logger.error(`Error while getting the case: ${err}`);
        });
};

module.exports = getCase;
