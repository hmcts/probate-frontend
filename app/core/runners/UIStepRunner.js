'use strict';

const co = require('co');
const {curry, set, isEmpty, forEach} = require('lodash');
const DetectDataChange = require('app/wrappers/DetectDataChange');
const FormatUrl = require('app/utils/FormatUrl');
const {get} = require('lodash');
const config = require('config');

class UIStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        let errors = null;
        const session = req.session;
        const formdata = session.form;
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function * () {
            let ctx = step.getContextData(req, res);
            if (ctx.redirect) {
                res.redirect(ctx.redirect);
            } else {
                const featureToggles = session.featureToggles;
                [ctx, errors] = yield step.handleGet(ctx, formdata, featureToggles, session.language);
                forEach(errors, (error) =>
                    req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
                );
                const content = step.generateContent(ctx, formdata, session.language);
                const fields = step.generateFields(session.language, ctx, errors, formdata);
                if (req.query.source === 'back') {
                    session.back.pop();
                } else if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                    session.back.push(step.constructor.getUrl());
                }
                const common = step.commonContent(session.language);
                common.SECURITY_COOKIE = `__auth-token-${config.payloadVersion}`;
                res.render(step.template, {content, fields, errors, common, userLoggedIn: req.userLoggedIn}, (err, html) => {
                    if (err) {
                        req.log.error(err);
                        return res.status(500).render('errors/500', {common: commonContent, userLoggedIn: req.userLoggedIn});
                    }
                    step.renderPage(res, html);
                });
            }
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500', {common: commonContent, userLoggedIn: req.userLoggedIn});
        });
    }

    handlePost(step, req, res) {
        const session = req.session;
        let formdata = session.form;
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function * () {
            let ctx = step.getContextData(req, res);
            let [isValid, errors] = [];
            [isValid, errors] = step.validate(ctx, formdata, session.language);
            const hasDataChanged = (new DetectDataChange()).hasDataChanged(ctx, req, step);
            const featureToggles = session.featureToggles;
            if (isValid) {
                [ctx, errors] = yield step.handlePost(ctx, errors, formdata, req.session, FormatUrl.createHostname(req), featureToggles);
            }

            if (isEmpty(errors)) {
                const nextStepUrl = step.nextStepUrl(req, ctx);
                [ctx, formdata] = step.action(ctx, formdata);

                delete ctx.ccdCase;
                set(formdata, step.section, ctx);

                if (hasDataChanged) {
                    formdata.declaration.declarationCheckbox = 'false';
                    formdata.declaration.hasDataChanged = true;
                }

                if ((get(formdata, 'ccdCase.state') === 'Pending' || get(formdata, 'ccdCase.state') === 'CasePaymentFailed') && session.regId && step.shouldPersistFormData()) {
                    const ccdCaseId = formdata.ccdCase.id;
                    const result = yield step.persistFormData(ccdCaseId, formdata, session.id, req);

                    if (result.name === 'Error') {
                        req.log.error('Could not persist user data', result.message);
                    } else if (result) {
                        session.form = Object.assign(session.form, result);
                        req.log.info('Successfully persisted user data');
                    }
                }

                if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                    session.back.push(step.constructor.getUrl());
                }

                res.redirect(nextStepUrl);
            } else {
                forEach(errors, (error) =>
                    req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
                );
                const content = step.generateContent(ctx, formdata, session.language);
                const fields = step.generateFields(session.language, ctx, errors, formdata);
                const common = step.commonContent(session.language);
                res.render(step.template, {content, fields, errors, common, userLoggedIn: req.userLoggedIn});
            }
        }).catch((error) => {
            req.log.error(error);
            const ctx = step.getContextData(req, res);
            const fields = step.generateFields(req.session.language, ctx, [], {});
            res.status(500).render('errors/500', {fields, common: commonContent, userLoggedIn: req.userLoggedIn});
        });
    }
}

module.exports = UIStepRunner;
