const Step = require('app/core/steps/Step'),
    WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');

module.exports = class PinSent extends Step {
    static getUrl() {
        return '/pin-sent';
    }

    runner() {
        return new WithLinkStepRunner();
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.phoneNumber = req.session.phoneNumber;
        return ctx;
    }
};
