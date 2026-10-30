'use strict';

const Step = require('app/core/steps/Step');

class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }

    // eslint-disable-next-line no-unused-vars
    getUrlWithContext(ctx, unused) {
        return this.constructor.getUrl();
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = StartEligibility;
