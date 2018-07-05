'use strict';

const Step = require('app/core/steps/Step');

module.exports = class StartApply extends Step {

    static getUrl() {
        return '/start-apply';
    }
};
