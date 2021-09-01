'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const InviteData = require('app/services/InviteData');
const config = require('config');
const FieldError = require('app/components/error');
const Security = require('app/services/Security');
const Authorise = require('app/services/Authorise');
const logger = require('app/components/logger')('Init');
const {mapValues, get} = require('lodash');

class CoApplicantDeclaration extends ValidationStep {

    static getUrl() {
        return '/co-applicant-declaration*';
    }

    constructor(steps, section = null, resourcePath, i18next, schema, language = 'en') {
        super(steps, section, resourcePath, i18next, schema, language);
        this.content = {
            en: require(`app/resources/en/translation/${resourcePath}`),
            cy: require(`app/resources/cy/translation/${resourcePath}`)
        };
    }

    generateContent(ctx, formdata) {
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);

        mapValues(this.content.en, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
        mapValues(this.content.cy, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));

        return this.content;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.bilingual = (get(formdata, 'language.bilingual', 'optionNo') === 'optionYes').toString();
        ctx.language = req.session.language;
        ctx.inviteId = req.session.inviteId;
        ctx.formdataId = req.session.formdataId;
        ctx.applicant = formdata.applicant;
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        Object.assign(ctx, formdata.declaration);
        return ctx;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'agreement', value: 'optionYes', choice: 'agreed'}
            ]
        };
    }

    shouldPersistFormData() {
        return false;
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
        const serviceAuthorisation = yield authorise.post();
        if (serviceAuthorisation.name === 'Error') {
            logger.info(`serviceAuthResult Error = ${serviceAuthorisation}`);
            const keyword = 'failure';
            errors.push(FieldError('authorisation', keyword, this.resourcePath, ctx, session.language));
            return [ctx, errors];
        }

        const security = new Security();
        const authToken = yield security.getUserToken(hostname);
        if (authToken.name === 'Error') {
            logger.info(`failed to obtain authToken = ${authToken}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx, session.language));
            return;
        }

        const data = {
            inviteId: ctx.inviteId,
            agreed: ctx.agreement === 'optionYes'
        };
        const inviteData = new InviteData(config.services.orchestrator.url, ctx.sessionID);

        yield inviteData.setAgreedFlag(authToken, serviceAuthorisation, ctx.ccdCase.id, data)
            .then((result) => {
                if (result.name === 'Error') {
                    throw new ReferenceError('Error updating co-applicant\'s data');
                }
            });

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.inviteId;
        delete ctx.formdataId;
        delete ctx.applicant;
        delete ctx.declaration;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        delete ctx.bilingual;
        delete ctx.language;
        return [ctx, formdata];
    }
}

module.exports = CoApplicantDeclaration;
