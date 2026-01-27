'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const emailValidator = require('email-validator');
const ExecutorsWrapper = require('app/wrappers/Executors');
const FieldError = require('app/components/error');
const InviteData = require('app/services/InviteData');
const config = require('config');
const {get} = require('lodash');
const pageUrl = '/coapplicant-email';

class CoApplicantEmail extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, formdata);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        const executor = ctx.list[ctx.index];
        ctx.executorName= executor?.fullName;
        ctx.inviteId = executor?.inviteId;
        ctx.formdataId = req.session.form.applicantEmail;
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        return ctx;
    }

    recalcIndex(ctx, formdata) {
        ctx.applicantRelationshipToDeceased = get(formdata, 'applicant.relationshipToDeceased');
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        if (ctx.applicantRelationshipToDeceased === 'optionParent') {
            return 1;
        }
        return executorsWrapper.getNextIndex();
    }

    handleGet(ctx) {
        const executor = ctx.list[ctx.index];
        ctx.email = executor.email;
        return [ctx];
    }

    * handlePost(ctx, errors, formdata, session) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        const executor = ctx.list[ctx.index];
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (executorsWrapper.executorEmailAlreadyUsed(ctx.email, ctx.index, formdata.applicantEmail)) {
            errors.push(FieldError('email', 'duplicate', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (ctx.email !== executor.email && (executor.emailSent || executor.inviteId)) {
            executor.emailChanged = true;
        }

        ctx.executorsEmailChanged = executorsWrapper.hasExecutorsEmailChanged();
        executor.email = ctx.email;
        if (executor.emailSent || executor.inviteId) {
            const data = {
                inviteId: ctx.inviteId,
                email: executor.email,
                formdataId: ctx.formdataId
            };
            const inviteData = new InviteData(config.services.orchestrator.url, ctx.sessionID);
            yield inviteData.updateContactDetails(ctx.ccdCase.id, data, ctx)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error updating executor\'s contact details');
                    }
                });
        }
        return [ctx, errors];
    }
    isComplete(ctx) {
        if (ctx.list[ctx.index]?.email) {
            return [true, 'inProgress'];
        }
        return [false, 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherExecName;
        delete ctx.email;
        delete ctx.index;
        delete ctx.formdataId;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        return [ctx, formdata];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.executorName && errors) {
            errors[0].msg = errors[0].msg.replace('{executorName}', fields.executorName.value);
        }
        return fields;
    }
}

module.exports = CoApplicantEmail;
