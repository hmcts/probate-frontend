'use strict';

const Step = require('app/core/steps/Step');
const services = require('app/components/services');
const FieldError = require('app/components/error');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');

class PaymentStatus extends Step {

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
        return [typeof formdata.payment !== 'undefined' && formdata.ccdCase.state === 'CaseCreated' && (formdata.payment.status === 'Success' || formdata.payment.status === 'not_required'), 'inProgress'];
    }

    * runnerOptions(ctx, formdata) {
        const options = {};

        if (formdata.paymentPending === 'true' || formdata.paymentPending === 'unknown') {
            const serviceAuthResult = yield services.authorise();
            logger.info('here at code block: 15');

            if (serviceAuthResult.name === 'Error') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                formdata.paymentPending = 'unknown';
                logger.info('here at code block: 16');
                return options;
            }

            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                paymentId: ctx.paymentId
            };
            logger.info('here at code block: 17');

            const findPaymentResponse = yield services.findPayment(data);
            const date = typeof findPaymentResponse.date_updated === 'undefined' ? ctx.paymentCreatedDate : findPaymentResponse.date_updated;
            this.updateFormDataPayment(formdata, findPaymentResponse, date);
            logger.info('here at code block: 18');
            if (findPaymentResponse.name === 'Error' || findPaymentResponse.status === 'Initiated') {
                logger.error('Payment retrieval failed for paymentId = ' + ctx.paymentId + ' with status = ' + findPaymentResponse.status);
                services.saveFormData(ctx.regId, formdata, ctx.sessionId);
                const options = {};
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                formdata.paymentPending = 'true';
                logger.info('here at code block: 19');
                return options;
            }

            const [updateCcdCaseResponse, errors] = yield this.updateCcdCasePaymentStatus(ctx, formdata);
            this.setErrors(options, errors);
            set(formdata, 'ccdCase.state', updateCcdCaseResponse.caseState);
            logger.info('here at code block: 20');

            if (findPaymentResponse.status !== 'Success') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                logger.error('Unable to retrieve a payment response.');
                logger.info('here at code block: 21');
            } else if (updateCcdCaseResponse.caseState !== 'CaseCreated') {
                options.redirect = false;
                logger.warn('Did not get a successful case created state.');
                logger.info('here at code block: 22');
            } else {
                options.redirect = false;
                formdata.paymentPending = 'false';
                logger.info('here at code block: 23');
            }
        } else {
            const [updateCcdCaseResponse, errors] = yield this.updateCcdCasePaymentStatus(ctx, formdata);
            this.setErrors(options, errors);
            options.redirect = false;
            set(formdata, 'payment.status', 'not_required');
            set(formdata, 'ccdCase.state', updateCcdCaseResponse.caseState);
            logger.info('here at code block: 24');
        }
        logger.info('here at code block: 25');
        const saveFormDataResponse = services.saveFormData(ctx.regId, formdata, ctx.sessionId);
        if (saveFormDataResponse.name === 'Error') {
            options.errors = saveFormDataResponse;
        }
        logger.info('here at code block: 26');

        return options;
    }

    * updateCcdCasePaymentStatus(ctx, formdata) {
        const submitData = {};
        Object.assign(submitData, formdata);
        let errors;
        const result = yield services.updateCcdCasePaymentStatus(submitData, ctx);

        if (!result.caseState) {
            errors = [(FieldError('update', 'failure', this.resourcePath, ctx))];
            logger.error('Could not update payment status', result.message);
        } else {
            logger.info({tags: 'Analytics'}, 'Payment status update');
            logger.info('Successfully updated payment status');
        }
        return [result, errors];
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }

    setErrors(options, errors) {
        if (typeof errors !== 'undefined') {
            options.errors = errors;
        }
    }

    updateFormDataPayment(formdata, findPaymentResponse, date) {
        Object.assign(formdata.payment, {
            channel: findPaymentResponse.channel,
            transactionId: findPaymentResponse.external_reference,
            reference: findPaymentResponse.reference,
            date: date,
            amount: findPaymentResponse.amount,
            status: findPaymentResponse.status,
            siteId: findPaymentResponse.site_id
        });
    }
}

module.exports = PaymentStatus;
