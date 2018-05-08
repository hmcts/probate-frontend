const co = require('co');
const {curry} = require('lodash');

module.exports = class ActionStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        return co(function* () {
            req.log.error(`GET operation not defined for ${step.name} step`);
            res.status(404);
            res.render('errors/404');
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }

    handlePost(step, req, res) {

        return co(function* () {

            const session = req.session;
            let formdata = session.form;

            let ctx = yield step.getContextData(req);
            let [, errors] = step.validate(ctx, formdata);

            [ctx, errors] = yield step.handlePost(ctx, errors, formdata);

            const next = step.next(ctx);
            [ctx, formdata] = step.action(ctx, formdata);
            res.redirect(next.constructor.getUrl());

        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }

};
