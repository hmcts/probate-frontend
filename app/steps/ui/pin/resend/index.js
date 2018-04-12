const Step = require('app/core/steps/Step'),
    services = require('app/components/services'),
    WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');

module.exports = class PinResend extends Step {

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
            session.pin = generatedPin
        });
        return [ctx, errors];
    }
};