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
                if (isEmpty(errors) && req.originalUrl !== '/sign-out' && req.originalUrl !== '/time-out' &&
                    req.originalUrl !== '/spouse-not-applying-reason' && req.originalUrl !== '/assets-overseas' &&
                    req.originalUrl !== '/co-applicant-agree-page' && req.originalUrl !== '/co-applicant-declaration' &&
                    req.originalUrl !== '/co-applicant-all-agreed-page' &&
                    req.originalUrl !== '/co-applicant-disagree-page' &&
                    req.originalUrl !== '/co-applicant-start-page' &&
                    req.originalUrl !== '/copies-start' &&
                    req.originalUrl !== '/copies-summary' &&
                    req.originalUrl !== '/copies-uk' &&
                    req.originalUrl !== '/all-children-over-18' &&
                    req.originalUrl !== '/any-children' &&
                    req.originalUrl !== '/any-deceased-children' &&
                    req.originalUrl !== '/any-grandchildren-under-18' &&
                    req.originalUrl !== '/any-other-children' &&
                    req.originalUrl !== '/deceased-details' &&
                    req.originalUrl !== '/divorce-place' &&
                    req.originalUrl !== '/english-foreign-death-cert' &&
                    req.originalUrl !== '/foreign-death-cert-translation' &&
                    req.originalUrl !== '/deceased-marital-status' &&
                    req.originalUrl !== '/executors-change-made' &&
                    req.originalUrl !== '/executors-alias' &&
                    req.originalUrl !== '/executor-current-name' &&
                    req.originalUrl !== '/executor-current-name-reason' &&
                    req.originalUrl !== '/executors-additional-invite' &&
                    req.originalUrl !== '/executors-additional-invite-sent' &&
                    req.originalUrl !== '/executors-address' &&
                    req.originalUrl !== '/executors-all-alive' &&
                    req.originalUrl !== '/executors-applying' &&
                    req.originalUrl !== '/executors-contact-details' &&
                    req.originalUrl !== '/executors-dealing-with-estate' &&
                    req.originalUrl !== '/executors-invite' &&
                    req.originalUrl !== '/executors-invites-sent' &&
                    req.originalUrl !== '/executors-other-names' &&
                    req.originalUrl !== '/executors-update-invite' &&
                    req.originalUrl !== '/executors-other-names' &&
                    req.originalUrl !== '/documents' &&
                    req.originalUrl !== '/error-pages' &&
                    req.originalUrl !== '/task-list' &&
                    req.originalUrl !== '/thank-you' &&
                    req.originalUrl !== '/declaration' &&
                    req.originalUrl !== '/deceased-divorce-or-separation-place' &&
                    req.originalUrl !== '/executor-current-name/4' &&
                    req.originalUrl !== '/executor-current-name/2' &&
                    req.originalUrl !== '/executor-current-name-reason/2' &&
                    req.originalUrl !== '/executor-address/1' &&
                    req.originalUrl !== '/other-executors-applying' &&
                    req.originalUrl !== '/executor-contact-details/1' &&
                    req.originalUrl !== '/executors-names' &&
                    req.originalUrl !== '/executors-number' &&
                    req.originalUrl !== '/executors-update-invite-sent' &&
                    req.originalUrl !== '/executor-when-died/*' &&
                    req.originalUrl !== '/executor-when-died/1' &&
                    req.originalUrl !== '/executors-who-died' &&
                    req.originalUrl !== '/executor-notified/*' &&
                    req.originalUrl !== '/executor-notified/1' &&
                    req.originalUrl !== '/executor-roles/*' &&
                    req.originalUrl !== '/executor-roles/1' &&
                    req.originalUrl !== '/assets-outside-england-wales' &&
                    req.originalUrl !== '/deceased-late-spouse-civil-partner' &&
                    req.originalUrl !== '/iht-identifier' &&
                    req.originalUrl !== '/iht-estate-values' &&
                    req.originalUrl !== '/iht-method' &&
                    req.originalUrl !== '/iht-paper' &&
                    req.originalUrl !== '/probate-estate-values' &&
                    req.originalUrl !== '/unused-allowance-claimed' &&
                    req.originalUrl !== '/iht-value' &&
                    req.originalUrl !== '/value-assets-outside-england-wales' &&
                    req.originalUrl !== '/value-assets-outside-england-wales' &&
                    req.originalUrl !== '/payment-breakdown' &&
                    req.originalUrl !== '/payment-status' &&
                    req.originalUrl !== '/pin-resend' &&
                    req.originalUrl !== '/sign-in' &&

                    req.originalUrl !== '/pin-sent' &&
                    req.originalUrl !== '/summary/*' &&
                    req.originalUrl !== '/terms-conditions' &&
                    req.originalUrl !== '/privacy-policy' &&
                    req.originalUrl !== '/cookies' &&

                    req.originalUrl !== '/cookies' &&
                    req.originalUrl !== '/contact-us' &&
                    req.originalUrl !== '/avaya-webchat' &&
                    req.originalUrl !== '/accessibility-statement' &&
                    req.originalUrl !== '/start-apply' &&

                    req.originalUrl !== '/related-to-deceased' &&
                    req.originalUrl !== '/other-applicants' &&
                    req.originalUrl !== '/died-after-october-2014' &&

                    req.originalUrl !== '/document-upload' &&

                    req.originalUrl !== '/copies-overseas'
                ) {
                    console.log('req.originalUrl--->'+req.originalUrl);
                    const previousStepUrl = step.previousStepUrl(req, ctx);
                    res.locals.previousUrl = previousStepUrl;
                }
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
            formdata.eventDescription = config.eventDescriptionPrefix + (step.constructor.getUrl()).replace('/', '');
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
