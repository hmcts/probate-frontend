'use strict';

const Step = require('app/core/steps/Step');
const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');
const PinNumber = require('app/services/PinNumber');
const config = require('app/config');
const FieldError = require('app/components/error');
const Authorise = require('app/services/Authorise');
const Security = require('app/services/Security');
const logger = require('app/components/logger')('Init');

class PinResend extends Step {

    static getUrl() {
        return '/pin-resend';
    }

    runner() {
        return new WithLinkStepRunner();
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.leadExecutorName = req.session.leadExecutorName;
        ctx.phoneNumber = req.session.phoneNumber;
        return ctx;
    }

    shouldPersistFormData() {
        return false;
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        const phoneNumber = session.phoneNumber;
        const authorise = new Authorise(config.services.idam.s2s_url, ctx.sessionID);
        const serviceAuthorisation = yield authorise.post();
        if (serviceAuthorisation.name === 'Error') {
            logger.info(`serviceAuthResult Error = ${serviceAuthorisation}`);
            const keyword = 'failure';
            errors.push(FieldError('authorisation', keyword, this.resourcePath, ctx));
            return [ctx, errors];
        }

        const security = new Security();
        const authToken = yield security.getUserToken(hostname);
        if (authToken.name === 'Error') {
            logger.info(`failed to obtain authToken = ${authToken}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
            return;
        }

        const pinNumber = new PinNumber(config.services.orchestrator.url, ctx.sessionID);
        yield pinNumber.get(phoneNumber)
            .then(generatedPin => {
                if (generatedPin.name === 'Error') {
                    throw new ReferenceError('Error when trying to resend pin');
                } else {
                    session.pin = generatedPin;
                }
            });

        return [ctx, errors];
    }
}

module.exports = PinResend;
