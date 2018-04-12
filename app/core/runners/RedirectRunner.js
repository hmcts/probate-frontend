const UIStepRunner = require('app/core/runners/UIStepRunner'),
    co = require('co');
module.exports = class RedirectRunner extends UIStepRunner {

    handleGet(step, req, res) {
        const originalHandleGet = super.handleGet;

        return co(function* () {
            const ctx = step.getContextData(req);
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
};