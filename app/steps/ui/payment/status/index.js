'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const services = require('app/components/services');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get} = require('lodash');

module.exports = class PaymentStatus extends Step {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/payment-status';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.paymentId = get(formdata, 'payment.paymentId');
        ctx.userId = req.userId;
        ctx.authToken = req.authToken;
        ctx.paymentDue = get(formdata, 'payment.total') > 0;
        ctx.regId = req.session.regId;
        ctx.sessionId = req.session.id;
        ctx.errors = req.errors;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.userId;
        delete ctx.submissionReference;
        delete ctx.regId;
        delete ctx.sessionId;
        delete ctx.errors;
        return [ctx, formdata];
    }

    isComplete(ctx, formdata) {
        return [formdata.submissionReference, 'inProgress'];
    }

    * runnerOptions(ctx, formdata) {
        const options = {};

        if (formdata.paymentPending === 'true') {
            const serviceAuthResult = yield services.authorise();

            if (serviceAuthResult.name === 'Error') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                return options;
            }

            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                paymentId: ctx.paymentId
            };

            const findPaymentResponse = yield services.findPayment(data);

            if (get(findPaymentResponse, 'state.status') !== 'success') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            } else {
                options.redirect = false;
                formdata.paymentPending = 'false';
                options.errors = yield this.sendApplication(ctx, formdata);
            }
        } else {
            options.redirect = false;
            options.errors = yield this.sendApplication(ctx, formdata);
        }

        return options;
    }

    * sendApplication(ctx, formdata) {
        const submitData = {};
        const softStop = this.anySoftStops(formdata, ctx) ? 'softStop' : false;
        Object.assign(submitData, formdata);

        const result = yield services.submitApplication(submitData, ctx, softStop);
        let errors;

        if (result.name === 'Error' || result === 'DUPLICATE_SUBMISSION') {
            const keyword = result === 'DUPLICATE_SUBMISSION' ? 'duplicate' : 'failure';
            errors = [(FieldError('submit', keyword, this.resourcePath, ctx))];
            return errors;
        }

        logger.info({tags: 'Analytics'}, 'Application Submitted');
        formdata.submissionReference = result.submissionReference;
        formdata.registry = {
            sequenceNumber: result.registrySequenceNumber,
            email: result.registryEmail,
            address: result.registryAddress
        };

        const saveResult = yield this.persistFormData(ctx.regId, formdata, ctx.sessionId);

        if (saveResult.name === 'Error') {
            logger.error('Could not persist user data', saveResult.message);
        } else {
            logger.info('Successfully persisted user data');
        }

        return errors;
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }
};
