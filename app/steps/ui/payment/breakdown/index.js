'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const config = require('app/config');
const {get, set} = require('lodash');
const logger = require('app/components/logger')('Init');
const ServiceMapper = require('app/utils/ServiceMapper');
const Payment = require('app/services/Payment');
const Authorise = require('app/services/Authorise');
const FeesCalculator = require('app/utils/FeesCalculator');

class PaymentBreakdown extends Step {
    static getUrl() {
        return '/payment-breakdown';
    }

    handleGet(ctx, formdata) {
        const fees = formdata.fees;
        this.checkFeesStatus(fees);

        ctx.copies = this.createCopiesLayout(formdata);
        ctx.applicationFee = fees.applicationfee;
        ctx.total = Number.isInteger(fees.total) ? fees.total : parseFloat(fees.total).toFixed(2);
        return [ctx, ctx.errors];
    }

    checkFeesStatus(fees) {
        if (fees.status !== 'success') {
            throw new Error('Unable to calculate fees from Fees Api');
        }
    }

    createCopiesLayout(formdata) {
        const ukCopies = formdata.fees.ukcopies;
        const overseasCopies = formdata.fees.overseascopies;
        return {
            uk: {number: ukCopies, cost: formdata.fees.ukcopiesfee},
            overseas: {number: overseasCopies, cost: formdata.fees.overseascopiesfee},
        };
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;

        ctx.authToken = req.authToken;
        ctx.userId = req.userId;
        ctx.deceasedLastName = get(formdata.deceased, 'lastName', '');
        ctx.paymentError = get(req, 'query.status');
        return ctx;
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        const feesCalculator = new FeesCalculator(config.services.feesRegister.url, ctx.sessionID);
        const confirmFees = yield feesCalculator.calc(formdata, ctx.authToken);
        this.checkFeesStatus(confirmFees);
        const originalFees = formdata.fees;
        if (confirmFees.total !== originalFees.total) {
            throw new Error (`Error calculated fees totals have changed from ${originalFees.total} to ${confirmFees.total}`);
        }
        ctx.total = originalFees.total;
        ctx.applicationFee = originalFees.applicationfee;
        ctx.copies = this.createCopiesLayout(formdata);

        const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
        const serviceAuthResult = yield authorise.post();
        if (serviceAuthResult.name === 'Error') {
            const options = {};
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            formdata.paymentPending = 'unknown';
            return options;
        }
        const canCreatePayment = yield this.canCreatePayment(ctx, formdata, serviceAuthResult);
        if (formdata.paymentPending !== 'unknown') {
            const [result, submissionErrors] = yield this.sendToSubmitService(ctx, errors, formdata, ctx.total);
            errors = errors.concat(submissionErrors);
            if (errors.length > 0) {
                logger.error('Failed to create case in CCD.');
                return [ctx, errors];
            }
            formdata.submissionReference = result.submissionReference;
            formdata.registry = result.registry;
            set(formdata, 'ccdCase.id', result.caseId);
            set(formdata, 'ccdCase.state', result.caseState);
            if (ctx.total > 0 && canCreatePayment) {
                formdata.paymentPending = 'true';

                if (formdata.creatingPayment !== 'true') {
                    formdata.creatingPayment = 'true';
                    session.save();

                    const serviceAuthResult = yield authorise.post();

                    if (serviceAuthResult.name === 'Error') {
                        logger.info(`serviceAuthResult Error = ${serviceAuthResult}`);
                        const keyword = 'failure';
                        formdata.creatingPayment = null;
                        formdata.paymentPending = null;
                        errors.push(FieldError('authorisation', keyword, this.resourcePath, ctx));
                        return [ctx, errors];
                    }

                    const data = {
                        amount: parseFloat(ctx.total),
                        authToken: ctx.authToken,
                        serviceAuthToken: serviceAuthResult,
                        userId: ctx.userId,
                        applicationFee: ctx.applicationFee,
                        copies: ctx.copies,
                        deceasedLastName: ctx.deceasedLastName,
                        ccdCaseId: formdata.ccdCase.id
                    };

                    const payment = new Payment(config.services.payment.createPaymentUrl, ctx.sessionID);
                    const [response, paymentReference] = yield payment.post(data, hostname);
                    logger.info(`Payment creation in breakdown for paymentReference = ${paymentReference} with response = ${JSON.stringify(response)}`);
                    formdata.creatingPayment = 'false';

                    if (response.name === 'Error') {
                        errors.push(FieldError('payment', 'failure', this.resourcePath, ctx));
                        return [ctx, errors];
                    }

                    ctx.paymentId = response.reference;
                    ctx.paymentReference = paymentReference;
                    ctx.paymentCreatedDate = response.date_created;

                    this.nextStepUrl = () => response._links.next_url.href;
                } else {
                    logger.warn('Skipping - create payment request in progress');
                }

            } else {
                formdata.paymentPending = ctx.total === 0 ? 'false' : 'true';
                delete this.nextStepUrl;
            }
        } else {
            logger.warn('Skipping create payment as authorisation is unknown.');
        }

        return [ctx, errors];
    }

    isComplete(ctx, formdata) {
        return [['true', 'false'].includes(formdata.paymentPending), 'inProgress'];
    }

    * sendToSubmitService(ctx, errors, formdata, total) {
        const softStop = this.anySoftStops(formdata, ctx) ? 'softStop' : false;
        set(formdata, 'payment.total', total);
        const submitData = ServiceMapper.map(
            'SubmitData',
            [config.services.submit.url, ctx.sessionID],
            ctx.journeyType
        );
        const result = yield submitData.post(formdata, ctx, softStop);
        logger.info(`submitData.post result = ${JSON.stringify(result)}`);

        if (result.name === 'Error' || result === 'DUPLICATE_SUBMISSION') {
            const keyword = result === 'DUPLICATE_SUBMISSION' ? 'duplicate' : 'failure';
            errors.push(FieldError('submit', keyword, this.resourcePath, ctx));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

        return [result, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.paymentError;
        delete ctx.deceasedLastName;
        delete formdata.fees;
        return [ctx, formdata];
    }

    * canCreatePayment(ctx, formdata, serviceAuthResult) {
        const paymentId = get(formdata, 'payment.paymentId');
        if (paymentId) {
            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                paymentId: paymentId
            };
            const payment = new Payment(config.services.payment.createPaymentUrl, ctx.sessionID);
            const paymentResponse = yield payment.get(data);
            logger.info(`Payment retrieval in breakdown for paymentId = ${ctx.paymentId} with response = ${JSON.stringify(paymentResponse)}`);
            if (typeof paymentResponse === 'undefined') {
                return true;
            }
            return (paymentResponse.status !== 'Initiated') && (paymentResponse.status !== 'Success');
        }
        return true;
    }
}

module.exports = PaymentBreakdown;
