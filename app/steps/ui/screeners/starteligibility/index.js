'use strict';

const Step = require('app/core/steps/Step');

class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }
}

module.exports = StartEligibility;
