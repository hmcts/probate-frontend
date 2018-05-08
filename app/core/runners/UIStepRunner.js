const co = require('co');
const {curry, set, isEmpty, forEach} = require('lodash');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const DetectDataChange = require('app/wrappers/DetectDataChange');

module.exports = class UIStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {

        return co(function * () {
            let errors = null;
            const session = req.session;
            const formdata = session.form;
            let ctx = step.getContextData(req);
            [ctx, errors] = yield step.handleGet(ctx, formdata);
            forEach(errors, (error) =>
                req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
            );
            const content = step.generateContent(ctx, formdata);
            const fields = step.generateFields(ctx, errors, formdata);
            if (req.query.source === 'back') {
                session.back.pop();
            } else if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                session.back.push(step.constructor.getUrl());
            }
            const common = step.commonContent();
            res.render(step.template, {content, fields, errors, common});
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }

    handlePost(step, req, res) {

        return co(function * () {

            const session = req.session;
            let formdata = session.form;
            let ctx = step.getContextData(req);
            let [isValid, errors] = [];
            [isValid, errors] = step.validate(ctx, formdata);
            const hasDataChanged = (new DetectDataChange()).hasDataChanged(ctx, req, step);
            if (isValid) {
                [ctx, errors] = yield step.handlePost(ctx, errors, formdata, req.session);
            }

            if (isEmpty(errors)) {
                const nextStepUrl = step.nextStepUrl(ctx);
                [ctx, formdata] = step.action(ctx, formdata);

                set(formdata, step.section, ctx);

                if (hasDataChanged) {
                    delete formdata.declaration.declarationCheckbox;
                    formdata.declaration.hasDataChanged = true;
                }

                const result = yield step.persistFormData(session.regId, formdata, session.id);
                if (result.name === 'Error') {
                    req.log.error('Could not persist user data', result.message);
                } else {
                    req.log.info('Successfully persisted user data');
                }

                if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                    session.back.push(step.constructor.getUrl());
                }

                res.redirect(nextStepUrl);
            } else {
                forEach(errors, (error) =>
                    req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
                );
                const content = step.generateContent(ctx, formdata);
                let fields = step.generateFields(ctx, errors, formdata);
                fields = mapErrorsToFields(errors, fields);
                const common = step.commonContent();
                res.render(step.template, {content, fields, errors, common});
            }
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }
};
