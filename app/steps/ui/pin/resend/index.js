'use strict';

const Step = require('app/core/steps/Step');
const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');
const PinNumber = require('app/services/PinNumber');
const config = require('app/config');

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

    * handlePost(ctx, errors, formdata, session) {
        const phoneNumber = session.phoneNumber;
        const pinNumber = new PinNumber(config.services.validation.url, ctx.sessionID);
        yield pinNumber
            .get(phoneNumber, session.id)
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
