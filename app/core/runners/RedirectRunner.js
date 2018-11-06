'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner');
const co = require('co');
const logger = require('app/components/logger')('Init');

class RedirectRunner extends UIStepRunner {

    handleGet(step, req, res) {
        logger.info(`Session ID before we call UIStepRunner from RedirectRunner: ${req.sessionID}`);
        const originalHandleGet = super.handleGet;
        logger.info(`Session ID after we call UIStepRunner from RedirectRunner: ${req.sessionID}`);

        return co(function* () {
            logger.info(`Session ID before we call getContextData from RedirectRunner: ${req.sessionID}`);
            const ctx = step.getContextData(req);
            logger.info(`Session ID after we call getContextData from RedirectRunner: ${req.sessionID}`);

            if (!req.session.form.applicantEmail) {
                req.log.error('req.session.form.applicantEmail does not exist');
            }

            req.session.form.applicantEmail = req.session.regId;
            logger.info(`Session ID before we call runnerOptions from RedirectRunner: ${req.sessionID}`);
            const options = yield step.runnerOptions(ctx, req.session.form);
            if (options.redirect) {
                res.redirect(options.url);
            } else {
                req.errors = options.errors;
                return originalHandleGet(step, req, res);
            }
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }
}

module.exports = RedirectRunner;
