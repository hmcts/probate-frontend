'use strict';

const Step = require('app/core/steps/Step.cjs');

class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = StartEligibility;
