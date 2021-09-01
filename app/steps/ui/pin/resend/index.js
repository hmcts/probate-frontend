'use strict';

const Step = require('app/core/steps/Step');
const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');
const PinNumber = require('app/services/PinNumber');
const config = require('config');
const FieldError = require('app/components/error');
const Authorise = require('app/services/Authorise');
const Security = require('app/services/Security');
const logger = require('app/components/logger')('Init');
const get = require('lodash').get;

class PinResend extends Step {

    static getUrl() {
        return '/pin-resend*';
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
            errors.push(FieldError('authorisation', keyword, this.resourcePath, ctx, session.language));
            return [ctx, errors];
        }

        const security = new Security();
        const authToken = yield security.getUserToken(hostname);
        if (authToken.name === 'Error') {
            logger.info(`failed to obtain authToken = ${authToken}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx, session.language));
            return;
        }

        const pinNumber = new PinNumber(config.services.orchestrator.url, ctx.sessionID);
        const bilingual = get(formdata, 'language.bilingual', 'optionNo') === 'optionYes';

        yield pinNumber.get(phoneNumber, bilingual, authToken, serviceAuthorisation)
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
