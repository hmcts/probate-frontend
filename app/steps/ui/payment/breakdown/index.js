'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const config = require('config');
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
        ctx.total = fees.total;
        logger.info('/payment-braekdown copies: ' + ctx.copies + ', application fee: ' + ctx.applicationFee + ', ' +
        'total fee: ' + ctx.total + ', for case id: ' + ctx.ccdCase.id);
        ctx = this.formatAmounts(ctx);

        return [ctx, ctx.errors];
    }

    checkFeesStatus(fees) {
        if (fees.status !== 'success') {
            logger.info('Fee.status not \'success\' for /payment-breakdown');
            logger.info('Unable to calculate fees from Fees Api');
            throw new Error('Unable to calculate fees from Fees Api');
        }
    }

    createCopiesLayout(formdata) {
        const ukCopies = typeof formdata.copies === 'undefined' ? 0 : formdata.copies.uk;
        const overseasCopies = typeof formdata.copies === 'undefined' ? 0 : formdata.copies.overseas;
        logger.info('ukCopies and overseasCopies for /payment-breakdown: ' + ukCopies + ' and ' + overseasCopies +
        ' respectively, for case id: ' + formdata.ccdCase.id);
        return {
            uk: {number: ukCopies, cost: formdata.fees.ukcopiesfee},
            overseas: {number: overseasCopies, cost: formdata.fees.overseascopiesfee},
        };
    }

    formatAmounts(ctx) {
        ctx.applicationFee = ctx.applicationFee.toFixed(2);
        ctx.total = ctx.total.toFixed(2);
        ctx.copies.uk.cost = ctx.copies.uk.cost.toFixed(2);
        ctx.copies.overseas.cost = ctx.copies.overseas.cost.toFixed(2);
        return ctx;
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
        logger.info('handlePost method initiated for /payment-breakdown for case id: ' + ctx.ccdCase.id);
        try {
            const feesCalculator = new FeesCalculator(config.services.feesRegister.url, ctx.sessionID);
            const confirmFees = yield feesCalculator.calc(formdata, ctx.authToken, session.featureToggles);
            ctx.applicationversion = confirmFees.applicationversion;
            ctx.applicationcode = confirmFees.applicationcode;
            ctx.ukcopiesversion = confirmFees.ukcopiesversion;
            ctx.ukcopiescode = confirmFees.ukcopiescode;
            ctx.overseascopiesversion = confirmFees.overseascopiesversion;
            ctx.overseascopiescode = confirmFees.overseascopiescode;
            this.checkFeesStatus(confirmFees);
            const originalFees = formdata.fees;
            if (confirmFees.total !== originalFees.total) {
                logger.info('confirmFees.total does not match originalFees.total for /payment-breakdown for case id: ' + ctx.ccdCase.id);
                throw new Error(`Error calculated fees totals have changed from ${originalFees.total} to ${confirmFees.total}`);
            }
            ctx.total = originalFees.total;
            ctx.applicationFee = originalFees.applicationfee;
            ctx.copies = this.createCopiesLayout(formdata);
            ctx = this.formatAmounts(ctx);

            const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
            const serviceAuthResult = yield authorise.post();
            if (serviceAuthResult.name === 'Error') {
                logger.info('serviceAuthResult.name is \'error\' for /payment-breakdown for case id: ' + ctx.ccdCase.id);
                const keyword = 'failure';
                errors.push(FieldError('authorisation', keyword, this.resourcePath, this.generateContent(ctx, formdata, session.language), session.language));
                return [ctx, errors];
            }

            const [canCreatePayment, paymentStatus] = yield this.canCreatePayment(ctx, formdata, serviceAuthResult);
            logger.info(`canCreatePayment result = ${canCreatePayment} with status ${paymentStatus}`);
            if (paymentStatus === 'Initiated') {
                const paymentCreateServiceUrl = config.services.payment.url + config.services.payment.paths.createPayment;
                const payment = new Payment(paymentCreateServiceUrl, ctx.sessionID);
                const data = {
                    authToken: ctx.authToken,
                    serviceAuthToken: serviceAuthResult,
                    userId: ctx.userId,
                    paymentId: ctx.reference
                };
                const paymentResponse = yield payment.get(data);
                logger.info('Checking status of reference = ' + ctx.reference + ' with response = ' + paymentResponse.status);
                if (paymentResponse.status === 'Initiated') {
                    logger.error('As payment is still Initiated, user will need to wait for this state to expire.');
                    errors.push(FieldError('payment', 'initiated', this.resourcePath, this.generateContent(ctx, formdata, session.language), session.language));
                    return [ctx, errors];
                }
            }

            if (ctx.total > 0 && canCreatePayment) {
                session.save();

                const serviceAuthResult = yield authorise.post();
                if (serviceAuthResult.name === 'Error') {
                    logger.info(`serviceAuthResult Error = ${serviceAuthResult}`);
                    const keyword = 'failure';
                    errors.push(FieldError('authorisation', keyword, this.resourcePath, this.generateContent(ctx, formdata, session.language), session.language));
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
                    ccdCaseId: formdata.ccdCase.id,
                    applicationversion: ctx.applicationversion,
                    applicationcode: ctx.applicationcode,
                    ukcopiesversion: ctx.ukcopiesversion,
                    ukcopiescode: ctx.ukcopiescode,
                    overseascopiesversion: ctx.overseascopiesversion,
                    overseascopiescode: ctx.overseascopiescode
                };

                const paymentCreateServiceUrl = config.services.payment.url + config.services.payment.paths.createPayment;
                const payment = new Payment(paymentCreateServiceUrl, ctx.sessionID);
                const paymentResponse = yield payment.post(data, hostname, session.language);
                logger.info(`Payment creation in breakdown for ccdCaseId = ${formdata.ccdCase.id} with response = ${JSON.stringify(paymentResponse)}`);
                if (paymentResponse.name === 'Error') {
                    logger.info('paymentResponse.name is \'error\' for /payment-breakdown for case id: ' + ctx.ccdCase.id);
                    errors.push(FieldError('payment', 'failure', this.resourcePath, this.generateContent(ctx, formdata, session.language), session.language));
                    return [ctx, errors];
                }
                const formDataResult = yield this.submitForm(ctx, errors, formdata, paymentResponse, serviceAuthResult, session.language);
                set(formdata, 'ccdCase', formDataResult.ccdCase);
                set(formdata, 'payment', formDataResult.payment);
                if (errors.length > 0) {
                    logger.error('Failed to create case in CCD.', errors);
                    return [ctx, errors];
                }
                ctx.reference = paymentResponse.reference;
                ctx.paymentCreatedDate = paymentResponse.date_created;
                this.nextStepUrl = () => paymentResponse._links.next_url.href;
                logger.info('Next step url after /payment-breakdown: ' + this.nextStepUrl + ' for case id: ' + ctx.ccdCase.id);
            } else {
                delete this.nextStepUrl;
            }
            return [ctx, errors];
        } finally {
            this.unlockPayment(session);
        }
    }

    isComplete(ctx, formdata) {
        return [typeof get(formdata, 'ccdCase.id') !== 'undefined' && (get(formdata, 'payment.total') === 0 || typeof get(formdata, 'payment.reference') !== 'undefined'), 'inProgress'];
    }

    * submitForm(ctx, errors, formdata, paymentDto, serviceAuthResult, language) {
        logger.info('submitForm method initiated for /payment-breakdown for case id: ' + ctx.ccdCase.id);
        const submitData = ServiceMapper.map(
            'SubmitData',
            [config.services.orchestrator.url, ctx.sessionID]
        );
        const result = yield submitData.submit(formdata, paymentDto, ctx.authToken, serviceAuthResult, ctx.caseType);
        if (result.type === 'VALIDATION') {
            errors.push(FieldError('submit', 'validation', this.resourcePath, this.generateContent(ctx, formdata, language), language));
        }
        logger.info(`submitData.submit result = ${JSON.stringify(result)}`);

        if (result.name === 'Error') {
            errors.push(FieldError('submit', 'failure', this.resourcePath, this.generateContent(ctx, formdata, language), language));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

        return result;
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
        const paymentReference = get(formdata, 'payment.reference');
        const caseId = get(formdata, 'ccdCase.id');
        let paymentStatus;
        let canMakePayment = true;
        if (caseId) {
            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: serviceAuthResult,
                userId: ctx.userId,
                caseId: caseId
            };
            const paymentServiceUrl = config.services.payment.url + config.services.payment.paths.payments;
            const payment = new Payment(paymentServiceUrl, ctx.sessionID);
            const casePaymentsArray = yield payment.getCasePayments(data);
            logger.debug(`Case payments for ${caseId} with response = ${JSON.stringify(casePaymentsArray)}`);
            const paymentResponse = payment.identifySuccessfulOrInitiatedPayment(casePaymentsArray);
            logger.debug(`Payment retrieval in breakdown for caseId = ${caseId} with response = ${JSON.stringify(paymentResponse)}`);
            if (!paymentResponse) {
                logger.info('No payments of Initiated or Success found for case id: ' + ctx.ccdCase.id);
            } else if (paymentResponse.status === 'Initiated' || paymentResponse.status === 'Success') {
                logger.info('PaymentResponse.status ' + paymentResponse.status + 'for /payment-breakdown for case id: ' + ctx.ccdCase.id);
                paymentStatus = paymentResponse.status;
                if (paymentResponse.payment_reference !== paymentReference) {
                    logger.info(`Payment with status ${paymentResponse.status} found, using reference ${paymentResponse.payment_reference}.`);
                    set(formdata, 'payment.reference', paymentResponse.payment_reference);
                    ctx.reference = paymentResponse.payment_reference;
                    ctx.paymentCreatedDate = paymentResponse.date_created;
                }
                canMakePayment = false;
            }
        }
        return [canMakePayment, paymentStatus];
    }

    unlockPayment(session) {
        logger.info('Unlocking payment ' + session.regId);
        session.paymentLock = 'Unlocked';
        session.save();
    }
}

module.exports = PaymentBreakdown;
