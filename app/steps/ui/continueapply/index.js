'use strict';

const Step = require('app/core/steps/Step');

module.exports = class ContinueApply extends Step {

    static getUrl() {
        return '/continue-apply';
    }
};
