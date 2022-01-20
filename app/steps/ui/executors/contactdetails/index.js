'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const emailValidator = require('email-validator');
const ExecutorsWrapper = require('app/wrappers/Executors');
const FieldError = require('app/components/error');
const {findIndex, every, tail} = require('lodash');
const InviteData = require('app/services/InviteData');
const PhoneNumberValidator = require('app/utils/PhoneNumberValidator');
const config = require('config');
const pageUrl = '/executor-contact-details';

class ExecutorContactDetails extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        const executor = ctx.list[ctx.index];
        ctx.inviteId = executor.inviteId;
        ctx.otherExecName = executor.fullName;
        ctx.formdataId = req.session.form.applicantEmail;
        ctx.authToken = req.authToken;
        ctx.serviceAuthorization = req.session.serviceAuthorization;
        return ctx;
    }

    handleGet(ctx) {
        const executor = ctx.list[ctx.index];
        ctx.email = executor.email;
        ctx.mobile = executor.mobile;
        return [ctx];
    }

    * handlePost(ctx, errors, formdata, session) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        const executor = ctx.list[ctx.index];
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!PhoneNumberValidator.validateMobilePhoneNumber(ctx.mobile)) {
            errors.push(FieldError('mobile', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (executorsWrapper.executorPhoneNumberAlreadyUsed(ctx.mobile, executor.fullName)) {
            errors.push(FieldError('mobile', 'duplicate', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.email !== executor.email && executor.emailSent) {
            executor.emailChanged = true;
        }

        ctx.executorsEmailChanged = executorsWrapper.hasExecutorsEmailChanged();
        executor.email = ctx.email;
        executor.mobile = ctx.mobile;
        if (executor.emailSent) {
            const data = {
                inviteId: ctx.inviteId,
                email: executor.email,
                phoneNumber: executor.mobile,
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

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherExecName;
        delete ctx.email;
        delete ctx.mobile;
        delete ctx.index;
        delete ctx.formdataId;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [every(tail(ctx.list).filter(exec => exec.isApplying === true), exec => exec.email && exec.mobile && exec.address), 'inProgress'];
    }
}

module.exports = ExecutorContactDetails;
