'use strict';

const Step = require('app/core/steps/Step');

module.exports = class NewStartEligibility extends Step {

    static getUrl() {
        return '/new-start-eligibility';
    }
};
