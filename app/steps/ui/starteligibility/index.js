'use strict';

const Step = require('app/core/steps/Step');

module.exports = class StartEligibility extends Step {

    static getUrl() {
        return '/start-eligibility';
    }
};
