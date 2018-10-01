'use strict';

const Step = require('app/core/steps/Step');

class NewStartApply extends Step {

    static getUrl() {
        return '/new-start-apply';
    }
}

module.exports = NewStartApply;
