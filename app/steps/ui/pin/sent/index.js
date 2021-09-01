'use strict';

const Step = require('app/core/steps/Step');
const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');

class PinSent extends Step {
    static getUrl() {
        return '/pin-sent*';
    }

    runner() {
        return new WithLinkStepRunner();
    }

    shouldPersistFormData() {
        return false;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.phoneNumber = req.session.phoneNumber;
        return ctx;
    }
}

module.exports = PinSent;
