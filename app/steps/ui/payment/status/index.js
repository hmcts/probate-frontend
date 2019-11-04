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
        ctx.reference = get(formdata, 'payment.reference');
        ctx.userId = req.userId;
        ctx.authToken = req.authToken;
        if (!get(formdata, 'payment.amount')) {
            set(formdata, 'payment.amount', 0);
        }
        if (formdata.payment && formdata.payment.total) {
            set(formdata, 'payment.amount', formdata.payment.total);
        }
        ctx.paymentDue = get(formdata, 'payment.amount') > 0;
        ctx.paymentPending = !ctx.paymentDue && ctx.applicationFee !== 0;
        ctx.regId = req.session.regId;
        ctx.sessionId = req.session.id;
        ctx.errors = req.errors;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.userId;
        delete ctx.regId;
        delete ctx.sessionId;
        delete ctx.errors;
        delete ctx.paymentPending;
        return [ctx, formdata];
    }

    isComplete(ctx, formdata) {
        return [typeof formdata.payment !== 'undefined' && formdata.ccdCase.state === 'CaseCreated' && (formdata.payment.status === 'Success' || formdata.payment.status === 'not_required'), 'inProgress'];
    }

    * runnerOptions(ctx, formdata) {
        const options = {};
        const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
        const serviceAuthResult = yield authorise.post();

        if (serviceAuthResult.name === 'Error') {
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            return options;
        }

        if (ctx.paymentDue) {
            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                paymentId: ctx.reference
            };

            const paymentCreateServiceUrl = config.services.payment.url + config.services.payment.paths.createPayment;
            const payment = new Payment(paymentCreateServiceUrl, ctx.sessionID);
            const getPaymentResponse = yield payment.get(data);
            logger.info('Payment retrieval in status for reference = ' + ctx.reference + ' with response = ' + JSON.stringify(getPaymentResponse));
            if (getPaymentResponse.name === 'Error' || getPaymentResponse.status === 'Initiated') {
                logger.error('Payment retrieval failed for reference = ' + ctx.reference + ' with status = ' + getPaymentResponse.status);
                const options = {};
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                return options;
            }

            const [updateCcdCaseResponse, errors] = yield this.updateForm(formdata, ctx, getPaymentResponse, serviceAuthResult);
            set(formdata, 'ccdCase', updateCcdCaseResponse.ccdCase);
            set(formdata, 'payment', updateCcdCaseResponse.payment);

            this.setErrors(options, errors);

            if (getPaymentResponse.status !== 'Success') {
                options.redirect = true;
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
                logger.error('Unable to retrieve a payment response.');
            } else if (updateCcdCaseResponse.ccdCase.state !== 'CaseCreated') {
                options.redirect = false;
                logger.warn('Did not get a successful case created state.');
            } else {
                options.redirect = false;
            }
        } else {
            const paymentStatus = ctx.paymentPending ? 'Pending' : 'not_required';
            const paymentDto = {status: paymentStatus};
            const [updateCcdCaseResponse, errors] = yield this.updateForm(formdata, ctx, paymentDto, serviceAuthResult);

            if (!ctx.paymentPending) {
                set(formdata, 'ccdCase', updateCcdCaseResponse.ccdCase);
                set(formdata, 'payment', updateCcdCaseResponse.payment);
                set(formdata, 'registry', updateCcdCaseResponse.registry);
            }

            this.setErrors(options, errors);
            options.redirect = false;
        }

        return options;
    }

    * updateForm(formdata, ctx, paymentDto, serviceAuthResult) {
        const submitData = ServiceMapper.map(
            'SubmitData',
            [config.services.orchestrator.url, ctx.sessionID]
        );
        let errors;
        const result = yield submitData.submit(formdata, paymentDto, ctx.authToken, serviceAuthResult, ctx.caseType);
        if (result.type === 'VALIDATION') {
            errors = [];
            errors.push(FieldError('update', 'failure', this.resourcePath, ctx));
        }
        logger.info(`submitData.submit result = ${JSON.stringify(result)}`);

        if (result.name === 'Error') {
            errors = [];
            errors.push(FieldError('update', 'failure', this.resourcePath, ctx));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

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
}

module.exports = PaymentStatus;
