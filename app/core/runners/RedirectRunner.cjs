'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner.cjs');
const co = require('co');

class RedirectRunner extends UIStepRunner {

    handleGet(step, req, res) {
        const originalHandleGet = super.handleGet;

        return co(function* () {
            const ctx = step.getContextData(req);

            if (!req.session.form.applicantEmail) {
                req.log.error('req.session.form.applicantEmail does not exist');
            }

            req.session.form.applicantEmail = req.session.regId;
            const options = yield step.runnerOptions(ctx, req.session, req.headers.host);
            if (options.redirect) {
                res.redirect(options.url);
            } else {
                req.errors = options.errors;
                return originalHandleGet(step, req, res);
            }
        }).catch((error) => {
            const commonContent = require(`app/resources/${req.session.language}/translation/common`);

            req.log.error(error);
            res.status(500).render('errors/error', {common: commonContent, error: '500', userLoggedIn: req.userLoggedIn});
        });
    }
}

module.exports = RedirectRunner;
