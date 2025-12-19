'use strict';

const Step = require('app/core/steps/Step.cjs');

class StartApply extends Step {

    static getUrl() {
        return '/start-apply';
    }
}

module.exports = StartApply;
