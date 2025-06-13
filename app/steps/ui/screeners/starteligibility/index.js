'use strict';

const Step = require('app/core/steps/Step');

class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = StartEligibility;
