'use strict';

const Step = require('app/core/steps/Step');

class NewStartEligibility extends Step {

    static getUrl() {
        return '/new-start-eligibility';
    }
}

module.exports = NewStartEligibility;
