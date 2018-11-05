'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const config = require('app/config');
const services = require('app/components/services');
const {get, set} = require('lodash');
const logger = require('app/components/logger')('Init');

class PaymentBreakdown extends Step {
    static getUrl() {
        return '/payment-breakdown';
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const commonContent = this.commonContent();

        let applicationFee;

        if (get(formdata, 'iht.netValue') < config.payment.applicationFeeThreshold) {
            applicationFee = 0;
        } else {
            applicationFee = config.payment.applicationFee;
        }

        const ukCopies = get(formdata, 'copies.uk', 0);
        const overseasCopies = get(formdata, 'assets.assetsoverseas', commonContent.no) === commonContent.yes ? formdata.copies.overseas : 0;
        const copies = {
            uk: {number: ukCopies, cost: parseFloat(ukCopies * config.payment.copies.uk.fee)},
            overseas: {number: overseasCopies, cost: parseFloat(overseasCopies * config.payment.copies.overseas.fee)},
        };
        const extraCopiesCost = copies.uk.cost + copies.overseas.cost;
        const total = applicationFee + extraCopiesCost;

        ctx.copies = copies;
        ctx.applicationFee = applicationFee;
        ctx.total = Number.isInteger(total) ? total : parseFloat(total).toFixed(2);
        ctx.authToken = req.authToken;
        ctx.userId = req.userId;
        ctx.deceasedLastName = get(formdata.deceased, 'lastName', '');
        ctx.paymentError = get(req, 'query.status');
        return ctx;
    }

    * handlePost(ctx, errors, formdata, session, hostname) {

        const serviceAuthResult = yield services.authorise();
        if (serviceAuthResult.name === 'Error') {
            const options = {};
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            formdata.paymentPending = 'unknown';
            return options;
        }
        const canCreatePayment = yield this.canCreatePayment(ctx, formdata, serviceAuthResult);
        if (formdata.paymentPending !== 'unknown') {
            const result = yield this.sendToSubmitService(ctx, errors, formdata, ctx.total);
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

                    const serviceAuthResult = yield services.authorise();

                    if (serviceAuthResult.name === 'Error') {
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
                    const [response, paymentReference] = yield services.createPayment(data, hostname);
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
        const result = yield services.sendToSubmitService(formdata, ctx, softStop);

        if (result.name === 'Error' || result === 'DUPLICATE_SUBMISSION') {
            const keyword = result === 'DUPLICATE_SUBMISSION' ? 'duplicate' : 'failure';
            errors.push(FieldError('submit', keyword, this.resourcePath, ctx));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

        return result;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.paymentError;
        delete ctx.deceasedLastName;
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
            const paymentResponse = yield services.findPayment(data);
            if (typeof paymentResponse === 'undefined') {
                return true;
            }
            return (paymentResponse.status !== 'Initiated') && (paymentResponse.status !== 'Success');
        }
        return true;
    }
}

module.exports = PaymentBreakdown;
