'use strict';

const Step = require('app/core/steps/Step.cjs');

class CopiesStart extends Step {

    static getUrl() {
        return '/copies-start';
    }
}

module.exports = CopiesStart;
