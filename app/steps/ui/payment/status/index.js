'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');
const config = require('app/config');
const Payment = require('app/services/Payment');
const Authorise = require('app/services/Authorise');
const ServiceMapper = require('app/utils/ServiceMapper');

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
        const formData = ServiceMapper.map(
            'FormData',
            [config.services.persistence.url, ctx.sessionID],
            ctx.journeyType
        );

        if (formdata.paymentPending === 'true' || formdata.paymentPending === 'unknown') {
            const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
            const serviceAuthResult = yield authorise.post();

            if (serviceAuthResult.name === 'Error') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                formdata.paymentPending = 'unknown';
                return options;
            }

            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                paymentId: ctx.paymentId
            };

            const payment = new Payment(config.services.payment.createPaymentUrl, ctx.sessionID);
            const getPaymentResponse = yield payment.get(data);
            logger.info('Payment retrieval in status for paymentId = ' + ctx.paymentId + ' with response = ' + JSON.stringify(getPaymentResponse));
            const date = typeof getPaymentResponse.date_updated === 'undefined' ? ctx.paymentCreatedDate : getPaymentResponse.date_updated;
            this.updateFormDataPayment(formdata, getPaymentResponse, date);
            if (getPaymentResponse.name === 'Error' || getPaymentResponse.status === 'Initiated') {
                logger.error('Payment retrieval failed for paymentId = ' + ctx.paymentId + ' with status = ' + getPaymentResponse.status);
                formData.post(ctx.regId, formdata);
                const options = {};
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                formdata.paymentPending = 'true';
                return options;
            }

            const [updateCcdCaseResponse, errors] = yield this.updateCcdCasePaymentStatus(ctx, formdata);
            this.setErrors(options, errors);
            set(formdata, 'ccdCase.state', updateCcdCaseResponse.caseState);

            if (getPaymentResponse.status !== 'Success') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                logger.error('Unable to retrieve a payment response.');
            } else if (updateCcdCaseResponse.caseState !== 'CaseCreated') {
                options.redirect = false;
                logger.warn('Did not get a successful case created state.');
            } else {
                options.redirect = false;
                formdata.paymentPending = 'false';
            }
        } else {
            const [updateCcdCaseResponse, errors] = yield this.updateCcdCasePaymentStatus(ctx, formdata);
            this.setErrors(options, errors);
            options.redirect = false;
            set(formdata, 'payment.status', 'not_required');
            set(formdata, 'ccdCase.state', updateCcdCaseResponse.caseState);
        }

        const postFormDataResponse = formData.post(ctx.regId, formdata);
        if (postFormDataResponse.name === 'Error') {
            options.errors = postFormDataResponse;
        }

        return options;
    }

    * updateCcdCasePaymentStatus(ctx, formdata) {
        const submitData = {};
        Object.assign(submitData, formdata);
        let errors;
        const ccdCasePaymentStatus = ServiceMapper.map(
            'CcdCasePaymentStatus',
            [config.services.submit.url, ctx.sessionID],
            ctx.journeyType
        );
        const result = yield ccdCasePaymentStatus.post(submitData, ctx);

        if (!result.caseState) {
            errors = [(FieldError('update', 'failure', this.resourcePath, ctx))];
            logger.error('Could not update payment status', result.message);
        } else {
            logger.info({tags: 'Analytics'}, 'Payment status update');
            logger.info('Successfully updated payment status to caseState' + result.caseState);
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

    updateFormDataPayment(formdata, paymentResponse, date) {
        Object.assign(formdata.payment, {
            channel: paymentResponse.channel,
            transactionId: paymentResponse.external_reference,
            reference: paymentResponse.reference,
            date: date,
            amount: paymentResponse.amount,
            status: paymentResponse.status,
            siteId: paymentResponse.site_id
        });
    }
}

module.exports = PaymentStatus;
