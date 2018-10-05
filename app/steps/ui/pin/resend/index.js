'use strict';

const Step = require('app/core/steps/Step');
const services = require('app/components/services');
const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');

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
        yield services.sendPin(phoneNumber, session.id).then(generatedPin => {
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
