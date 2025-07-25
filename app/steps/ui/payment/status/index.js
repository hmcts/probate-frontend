'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');
const config = require('config');
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

        ctx.payment = get(formdata, 'payment');
        ctx.paymentNotRequired = get(ctx.payment, 'total') === '0.00';
        ctx.reference = get(formdata, 'payment.reference');
        ctx.paymentBreakdownSkipped = typeof ctx.reference === 'undefined';
        ctx.paymentDue = !ctx.paymentBreakdownSkipped && !ctx.paymentNotRequired;

        ctx.userId = req.userId;
        ctx.authToken = req.authToken;
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
        delete ctx.paymentNotRequired;
        delete ctx.paymentDue;
        delete ctx.payment;
        delete ctx.paymentBreakdownSkipped;
        return [ctx, formdata];
    }

    isComplete(ctx, formdata) {
        return [typeof formdata.payment !== 'undefined' && formdata.ccdCase.state === 'CasePrinted' && (formdata.payment.status === 'Success' || formdata.payment.status === 'not_required'), 'inProgress'];
    }

    * runnerOptions(ctx, session) {
        const formdata = session.form;

        const options = {};
        const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
        const serviceAuthResult = yield authorise.post();
        options.redirect = true;

        if (serviceAuthResult.name === 'Error') {
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;
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
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;
                return options;
            }

            const [updateCcdCaseResponse, errors] = yield this.updateForm(formdata, ctx, getPaymentResponse, serviceAuthResult, session.language);
            set(formdata, 'ccdCase', updateCcdCaseResponse.ccdCase);
            set(formdata, 'payment', updateCcdCaseResponse.payment);
            set(formdata, 'registry', updateCcdCaseResponse.registry);

            this.setErrors(options, errors);

            if (getPaymentResponse.status !== 'Success') {
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;
                logger.error(`Unable to retrieve a payment response with status ${getPaymentResponse.status} for reference ${ctx.reference}`);
            } else if (!updateCcdCaseResponse || !updateCcdCaseResponse.ccdCase || updateCcdCaseResponse.ccdCase.state !== 'CasePrinted') {
                options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;
                logger.warn(`Did not get a successful case created state for reference ${ctx.reference}`);
            } else {
                options.url = `${this.steps.ThankYou.constructor.getUrl()}`;
            }
        } else {
            if (ctx.paymentNotRequired) {
                set(ctx.payment, 'status', 'not_required');
            }
            const [updateCcdCaseResponse, errors] = yield this.updateForm(formdata, ctx, ctx.payment, serviceAuthResult, session.language);
            this.setErrors(options, errors);
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;

            if (ctx.paymentNotRequired) {
                set(formdata, 'ccdCase', updateCcdCaseResponse.ccdCase);
                set(formdata, 'payment', updateCcdCaseResponse.payment);
                set(formdata, 'registry', updateCcdCaseResponse.registry);
                options.url = `${this.steps.ThankYou.constructor.getUrl()}`;
            }
        }

        return options;
    }

    * updateForm(formdata, ctx, paymentDto, serviceAuthResult, language) {
        const submitData = ServiceMapper.map(
            'SubmitData',
            [config.services.orchestrator.url, ctx.sessionID]
        );
        let errors;
        const result = yield submitData.submit(formdata, paymentDto, ctx.authToken, serviceAuthResult, ctx.caseType);
        if (result.type === 'VALIDATION') {
            errors = [];
            errors.push(FieldError('update', 'failure', this.resourcePath, this.generateContent(ctx, formdata, language), language));
        }

        if (result.name === 'Error') {
            errors = [];
            errors.push(FieldError('update', 'failure', this.resourcePath, this.generateContent(ctx, formdata, language), language));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

        return [result, errors];
    }

    setErrors(options, errors) {
        if (typeof errors !== 'undefined') {
            options.errors = errors;
        }
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = PaymentStatus;
