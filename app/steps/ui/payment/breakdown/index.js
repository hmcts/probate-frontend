const Step = require('app/core/steps/Step'),
    FieldError = require('app/components/error'),
    config = require('app/config'),
    services = require('app/components/services'),
    {get} = require('lodash'),
    logger = require('app/components/logger')('Init');

module.exports = class PaymentBreakdown extends Step {
    static getUrl() {
        return '/payment-breakdown';
    }

    * handleGet(ctx) {

        if (ctx.paymentError === 'failure') {
            const keyword = 'failure';
            const errors = [];
            errors.push(FieldError('payment', keyword, this.resourcePath, ctx));
            return [ctx, errors];
        }

        return [ctx];
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

    * handlePost(ctx, errors, formdata, session) {

        if (formdata.paymentPending !== 'unknown') {

            if (ctx.total > 0) {
                formdata.paymentPending = 'true';

                if (formdata.creatingPayment !== 'true') {
                    formdata.creatingPayment = 'true';
                    session.save();

                    const serviceAuthResult = yield services.authorise();
                    if (serviceAuthResult.name === 'Error') {
                        const keyword = 'failure';
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
                        deceasedLastName: ctx.deceasedLastName
                    };

                    const [response, paymentReference] = yield services.createPayment(data);
                    formdata.creatingPayment = 'false';
                    if (response.name === 'Error') {
                        errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
                        return [ctx, errors];
                    }
                    ctx.paymentId = response.id;
                    ctx.paymentReference = paymentReference;

                    this.nextStepUrl = () => response._links.next_url.href;
                } else {
                    logger.warn('Skipping - create payment request in progress');
                }

            } else {
                formdata.paymentPending = 'false';
                delete this.nextStepUrl;
            }

        } else {
            logger.warn('Skipping create payment as authorisation is unknown.');
        }

        return [ctx, errors];
    }

    isComplete(ctx, formdata) {
        return [formdata.paymentPending === 'false' || formdata.paymentPending === 'true', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.paymentError;
        delete ctx.deceasedLastName;
        return [ctx, formdata];
    }
};
