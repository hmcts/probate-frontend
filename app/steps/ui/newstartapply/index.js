'use strict';

const Step = require('app/core/steps/Step');

module.exports = class NewStartApply extends Step {

    static getUrl() {
        return '/new-start-apply';
    }
};
